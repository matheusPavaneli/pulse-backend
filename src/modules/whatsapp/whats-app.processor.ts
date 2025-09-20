import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';
import IEvolutionApiConfig from 'src/common/interfaces/IEvolutionApiConfig';

@Processor('whatsapp', {
  lockDuration: 120000,
  lockRenewTime: 30000,
  stalledInterval: 120000,
})
export class WhatsAppProcessor extends WorkerHost {
  constructor(
    @Inject('EVOLUTION_CONFIG') private evolutionConfig: IEvolutionApiConfig,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async process({ data }: Job<any, any, string>) {
    const { phoneNumber, message } = data;

    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.evolutionConfig.evolutionApiUrl}/message/sendText/${this.evolutionConfig.evolutionWhatsappInstance}`,
          {
            number: phoneNumber,
            textMessage: {
              text: message,
            },
            options: {
              delay: 1000,
            },
          },
          {
            headers: {
              apikey: this.evolutionConfig.evolutionApiToken,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return data;
    } catch (error) {
      console.error(
        'Erro ao enviar WhatsApp:',
        error?.response?.data || error.message,
      );
      throw error;
    }
  }
}
