import ISendMailDTO from '../dtos/ISendMaillDTO';

export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
