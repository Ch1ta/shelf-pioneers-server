const nodemailer = require('nodemailer')

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "shelfpioneerstest1@gmail.com",
                pass: "blcpehucppyibtlr"
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: "shelfpioneerstest1@gmail.com",
            to,
            subject: 'Пионеры шельфа: активация аккаунта',
            text: '',
            html:
                `<div>
                    <h1>Для активации аккаунта перейдите по ссылке: </h1>
                    <a href="${link}">${link}</a>
                </div>`
        })
    }
}

module.exports = new MailService();