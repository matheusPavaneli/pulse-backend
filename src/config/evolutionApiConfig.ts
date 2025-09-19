import type IEvolutionApiRootConfig from "src/common/interfaces/IEvolutionApiRootConfig";

export default (): IEvolutionApiRootConfig => {
  return {
    evolutionApiConfig: {
      evolutionApiUrl: process.env.EVOLUTION_API_URL ?? '',
      instanceToken: process.env.INSTANCE_TOKEN ?? '',
    },
  };
};
