import type IResendConfigRoot from 'src/common/interfaces/IResendConfigRoot';

export default (): IResendConfigRoot => {
  return {
    resendConfig: {
      resendApiKey: process.env.RESEND_API_KEY ?? '',
      resendFromEmail: process.env.RESEND_FROM ?? '',
    },
  };
};
