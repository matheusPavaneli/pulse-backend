import { Injectable } from '@nestjs/common';
import type { Event } from '../event/event.entity';
import { Rule } from '../rule/rule.entity';
import { WhatsAppService } from '../whatsapp/whats-app.service';
import { EmailService } from '../email/email.service';

import * as Handlebars from 'handlebars';

type EventWithParsed = Event & {
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

@Injectable()
export class ActionsEngineService {
  constructor(
    private readonly whatsAppService: WhatsAppService,
    private readonly emailService: EmailService,
  ) {}

  processActions = async (event: Event, rules: Rule[]): Promise<void> => {
    const payload =
      typeof event.payload === 'string'
        ? JSON.parse(event.payload)
        : event.payload;
    const metadata =
      typeof event.metadata === 'string'
        ? JSON.parse(event.metadata)
        : event.metadata;

    const parsedEvent: EventWithParsed = { ...event, payload, metadata };

    await Promise.all(
      rules.map(async (rule) => {
        if (!rule.actions) return;

        const raw =
          typeof rule.actions === 'string'
            ? JSON.parse(rule.actions)
            : rule.actions;
        const actions = Array.isArray(raw) ? raw : [raw];

        await Promise.all(
          actions
            .filter((action) => action.message)
            .map(async (action) => {
              try {
                const message =
                  action.channel === 'email'
                    ? this.interpolateTemplate(action.message, parsedEvent)
                    : this.resolveTemplateString(action.message, parsedEvent);

                await this.dispatchAction(action, message);
              } catch (err) {
                console.error('Failed to dispatch action', { action, err });
              }
            }),
        );
      }),
    );
  };

  private interpolateTemplate = (
    template: string,
    event: EventWithParsed,
  ): string => {
    Handlebars.registerHelper('get', (key: string) => {
      const value = this.resolveEventValue(key, event);
      return value !== undefined ? value : null;
    });

    Handlebars.registerHelper('add', (key1: string, key2: string) => {
      const val1 = Number(this.resolveEventValue(key1, event) ?? 0);
      const val2 = Number(this.resolveEventValue(key2, event) ?? 0);
      return val1 + val2;
    });

    Handlebars.registerHelper('subtract', (key1: string, key2: string) => {
      const val1 = Number(this.resolveEventValue(key1, event) ?? 0);
      const val2 = Number(this.resolveEventValue(key2, event) ?? 0);
      return val1 - val2;
    });

    Handlebars.registerHelper('uppercase', (key: string) => {
      const value = this.resolveEventValue(key, event);
      return value ? String(value).toUpperCase() : null;
    });

    const compiled = Handlebars.compile(template);
    return compiled({});
  };

  private resolveTemplateString = (
    template: string,
    event: EventWithParsed,
  ): string => {
    return template.replace(/{{(.*?)}}/g, (_, key) => {
      const value = this.resolveEventValue(key.trim(), event);
      return value !== undefined ? String(value) : '';
    });
  };

  private resolveEventValue = (
    key: string,
    event: EventWithParsed,
  ): unknown => {
    const getNested = (obj: unknown, path: string): unknown => {
      if (!path) return obj;

      return path.split('.').reduce((acc, rawKey) => {
        if (acc === undefined || acc === null) return undefined;

        const arrayMatch = rawKey.match(/^(.+)\[(\d+)\]$/);
        if (arrayMatch) {
          const [, arrKey, index] = arrayMatch;
          const arrayVal = (acc as Record<string, unknown>)[arrKey];
          if (Array.isArray(arrayVal)) {
            return arrayVal[Number(index)];
          }
          return undefined;
        }

        if (Array.isArray(acc) && !isNaN(Number(rawKey))) {
          return acc[Number(rawKey)];
        }

        return (acc as Record<string, unknown>)[rawKey];
      }, obj);
    };

    if (key.startsWith('payload.')) {
      return getNested(event.payload, key.slice(8));
    }

    if (key.startsWith('metadata.')) {
      return getNested(event.metadata, key.slice(9));
    }

    return (
      getNested(event, key) ??
      getNested(event.payload, key) ??
      getNested(event.metadata, key)
    );
  };

  private dispatchAction = async (
    actions: any,
    message: string,
  ): Promise<void> => {
    switch (actions.channel) {
      case 'whatsapp':
        this.whatsAppService.enqueue(actions.phoneNumber, message);
        break;
      case 'email':
        this.emailService.enqueue(
          actions.to,
          actions.subject,
          actions.template,
          message,
        );
        break;
      default:
        console.log('Unknown action channel:', actions.channel);
    }
  };
}
