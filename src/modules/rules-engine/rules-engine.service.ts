import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from '../rule/rule.entity';
import type { Event } from '../event/event.entity';

type EventWithParsed = Event & {
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

@Injectable()
export class RulesEngineService {
  constructor(
    @InjectRepository(Rule) private ruleRepository: Repository<Rule>,
  ) {}

  processEvent = async (event: Event): Promise<Rule[]> => {
    const rules = await this.ruleRepository.find({
      where: {
        enabled: true,
        eventType: event.type,
        companyId: event.companyId,
      },
    });

    const triggeredRules: Rule[] = [];

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
      const conditions =
        typeof rule.conditions === 'string'
          ? JSON.parse(rule.conditions)
          : rule.conditions;

      if (this.evaluateConditions(conditions, parsedEvent)) {
        triggeredRules.push(rule);
      }
    }

    return triggeredRules;
  };

  private evaluateConditions = (
    conditions: Record<string, unknown>,
    event: EventWithParsed,
  ): boolean => {
    if (conditions.$and && Array.isArray(conditions.$and)) {
      return conditions.$and.every((cond) =>
        this.evaluateConditions(cond as Record<string, unknown>, event),
      );
    }

    if (conditions.$or && Array.isArray(conditions.$or)) {
      return conditions.$or.some((cond) =>
        this.evaluateConditions(cond as Record<string, unknown>, event),
      );
    }

    return this.matchCondition(conditions, event);
  };

  private matchCondition = (
    condition: Record<string, unknown>,
    event: EventWithParsed,
  ): boolean => {
    for (const [key, value] of Object.entries(condition)) {
      const eventValue = this.resolveEventValue(key, event);

      if (!this.evaluateOperator(eventValue, value)) {
        return false;
      }
    }

    return true;
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

  private evaluateOperator = (
    eventValue: unknown,
    conditionValue: unknown,
  ): boolean => {
    if (
      typeof conditionValue === 'object' &&
      conditionValue !== null &&
      !Array.isArray(conditionValue)
    ) {
      const operators = conditionValue as Record<string, unknown>;

      for (const [op, val] of Object.entries(operators)) {
        switch (op) {
          case '$eq':
            if (eventValue !== val) return false;
            break;
          case '$neq':
            if (eventValue === val) return false;
            break;
          case '$gte':
            if (
              typeof eventValue !== 'number' ||
              typeof val !== 'number' ||
              eventValue < val
            )
              return false;
            break;
          case '$lte':
            if (
              typeof eventValue !== 'number' ||
              typeof val !== 'number' ||
              eventValue > val
            )
              return false;
            break;
          case '$gt':
            if (
              typeof eventValue !== 'number' ||
              typeof val !== 'number' ||
              eventValue <= val
            )
              return false;
            break;
          case '$lt':
            if (
              typeof eventValue !== 'number' ||
              typeof val !== 'number' ||
              eventValue >= val
            )
              return false;
            break;
          case '$in':
            if (!Array.isArray(val) || !val.includes(eventValue)) return false;
            break;
          case '$nin':
            if (!Array.isArray(val) || val.includes(eventValue)) return false;
            break;
          case '$exists':
            if (typeof val !== 'boolean') return false;
            if (val && eventValue === undefined) return false;
            if (!val && eventValue !== undefined) return false;
            break;
          case '$regex':
            if (typeof val !== 'string' || typeof eventValue !== 'string')
              return false;
            if (!new RegExp(val).test(eventValue)) return false;
            break;
          default:
            return false;
        }
      }
      return true;
    }

    return eventValue === conditionValue;
  };
}
