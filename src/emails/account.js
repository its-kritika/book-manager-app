const mailgun = require("mailgun-js");
require('dotenv').config()

const domain = process.env.MAILGUN_DOMAIN
const api_key = process.env.MAILGUN_API_KEY

const mg = mailgun({apiKey: api_key, domain });

const sendResetPasswordEmail = (email, name, token) => {
    const url = `http://localhost:3000/reset-password?token=${token}`

    const data = {
        from: `kritika@${domain}`,
        to: email,
        subject: 'Reset Your Password',
        text: `Hello ${ name }. Click on the link given to reset your password ${ url }`,
        html: `
            <p>Hello ${name},</p>
            <p>Click <a href="${url}">here</a> to reset your password.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire within 2 minutes.</p>
            <p>Thanks,<br/>Kritika</p>
        `,
    }

    mg.messages().send(data)
}

module.exports = {
    sendResetPasswordEmail
}