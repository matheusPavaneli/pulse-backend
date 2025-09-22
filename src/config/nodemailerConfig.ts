import type INodeMailerRootConfig from 'src/common/interfaces/INodeMailerRootConfig';

export default (): INodeMailerRootConfig => {
  return {
    nodemailerConfig: {
      user: process.env.MAIL_USERNAME ?? '',
      pass: process.env.MAIL_PASSWORD ?? '',
      host: process.env.MAIL_HOST ?? '',
      port: Number(process.env.MAILER_PORT ?? 587),
      from: process.env.MAIL_FROM ?? '',
    },
  };
};
