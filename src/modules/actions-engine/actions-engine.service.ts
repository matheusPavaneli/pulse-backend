import { Injectable } from '@nestjs/common';
import type { Event } from '../event/event.entity';
import { Rule } from '../rule/rule.entity';
import { WhatsAppService } from '../whatsapp/whats-app.service';

type EventWithParsed = Event & {
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

@Injectable()
export class ActionsEngineService {
  constructor(private readonly whatsAppService: WhatsAppService) {}

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

    for (const rule of rules) {
      if (!rule.actions) continue;

      const actions =
        typeof rule.actions === 'string'
          ? JSON.parse(rule.actions)
          : rule.actions;

      if (!actions.template) continue;

      const message = this.interpolateTemplate(actions.template, parsedEvent);

      await this.dispatchAction(actions, message);
    }
  };

  private interpolateTemplate = (
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
        console.log('Sending Email:', message, actions.to);
        break;
      default:
        console.log('Unknown action channel:', actions.channel);
    }
  };
}
