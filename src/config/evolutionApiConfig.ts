import type IEvolutionApiRootConfig from 'src/common/interfaces/IEvolutionApiRootConfig';

export default (): IEvolutionApiRootConfig => {
  return {
    evolutionApiConfig: {
      evolutionApiUrl: process.env.EVOLUTION_API_URL ?? '',
      evolutionApiToken: process.env.EVOLUTION_API_TOKEN ?? '',
      evolutionWhatsappInstance: process.env.EVOLUTION_API_WHATSAPP_INSTANCE ?? '',
    },
  };
};
