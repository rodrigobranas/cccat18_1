export default class MailerGatewayMemory {

  async send(email: any) {
    console.log(`Email enviado para: ${email}`)
  }
}