import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RulesEngineService } from '../rules-engine/rules-engine.service';
import type { Event } from './event.entity';
import { AlertService } from '../alert/alert.service';

@Processor('events')
export class EventProcessor extends WorkerHost {
  constructor(
    private readonly rulesEngineService: RulesEngineService,
    private readonly alertService: AlertService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>) {
    const event: Event = job.data;

    const triggeredRules = await this.rulesEngineService.processEvent(event);

    for (const rule of triggeredRules) {
      this.alertService.createAlert({
        companyId: event.companyId,
        event,
        rule,
        description: rule.name,
        severity: (event.metadata as { severity?: string })?.severity || 'low',
        metadata: { ...event.metadata },
      });

      console.log('sendind alert, template: ', rule?.actions?.template);
    }
  }
}
