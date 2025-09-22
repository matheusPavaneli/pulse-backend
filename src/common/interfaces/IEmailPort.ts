export default interface IEmailPort {
  sendMail(
    to: string,
    subject: string,
    templateName: string,
    message: string,
  ): Promise<void>;
}
