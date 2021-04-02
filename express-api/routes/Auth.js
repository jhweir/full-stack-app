require('dotenv').config()
const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const { User, Notification } = require('../models')

async function verifyRecaptch(reCaptchaToken, res) {
    const secret = process.env.APP_ENV === 'dev' ? process.env.RECAPTCHA_SECRET_KEY_DEV : process.env.RECAPTCHA_SECRET_KEY_PROD
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${reCaptchaToken}`)
    if (!response.data.success) res.status(400).send({ message: 'Recaptcha request failed' })
    else if (response.data.score < 0.5) res.status(403).send({ message: 'Recaptcha score < 0.5' })
    else return true
}

// POST
router.post('/log-in', async (req, res) => {
    const { reCaptchaToken, emailOrHandle, password } = req.body
    // verify recaptcha
    const recaptchaValid = await verifyRecaptch(reCaptchaToken, res)
    if (recaptchaValid) {
        // check user exists
        const matchingUser = await User.findOne({
            where: { [sequelize.Op.or]: [{ email: emailOrHandle }, { handle: emailOrHandle }] },
            attributes: ['id', 'password', 'emailVerified']
        })
        if (!matchingUser) res.status(404).send({ message: 'User not found' })
        else {
            // check password is correct
            bcrypt.compare(password, matchingUser.password, function(error, success) {
                if (!success) res.status(404).send({ message: 'Incorrect password' })
                else {
                    // check email is verified
                    if (!matchingUser.emailVerified) res.status(403).send({ message: 'Email not yet verified', userId: matchingUser.id })
                    else {
                        // create access token
                        const payload = { id: matchingUser.id }
                        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
                        // const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
                        res.status(200).send(accessToken)
                    }
                }
            })
        }
    }
})

router.post('/register', async (req, res) => {
    const { reCaptchaToken, newHandle, newName, newEmail, newPassword } = req.body
    // verify recaptcha
    const recaptchaValid = await verifyRecaptch(reCaptchaToken, res)
    if (recaptchaValid) {
        // check if user handle or email already taken
        const matchingHandle = await User.findOne({ where: { handle: newHandle } })
        const matchingEmail = await User.findOne({ where: { email: newEmail } })
        if (matchingHandle) res.status(403).send({ message: 'Handle already taken' })
        else if (matchingEmail) res.status(403).send({ message: 'Email already taken' })
        else {
            // create account and send verification email
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            const emailToken = crypto.randomBytes(64).toString('hex')
            const createUserAndNotification = await User.create({
                handle: newHandle,
                name: newName,
                email: newEmail,
                password: hashedPassword,
                emailVerified: false,
                emailToken
            }).then(user => {
                Notification.create({
                    ownerId: user.id,
                    type: 'welcome-message',
                    seen: false
                })
            })
            const message = {
                to: newEmail,
                from: 'admin@weco.io',
                subject: 'Weco - verify your email',
                text: `
                    Hi, thanks for creating an account on weco.
                    Please copy and paste the address below to verify your email address:
                    http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}?alert=verify-email&token=${emailToken}
                `,
                html: `
                    <h1>Hi</h1>
                    <p>Thanks for creating an account on weco.</p>
                    <p>Please click the link below to verify your account:</p>
                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}?alert=verify-email&token=${emailToken}'>Verfiy your account</a>
                `,
            }
            const sendEmail = await sgMail.send(message)
            Promise
                .all([createUserAndNotification, sendEmail])
                .then(res.status(200).send({ message: 'Success' }))
                .catch(error => console.log('error: ', error))
        }
    }
})

router.post('/reset-password-request', async (req, res) => {
    const { reCaptchaToken, email } = req.body
    // verify recaptcha
    const recaptchaValid = await verifyRecaptch(reCaptchaToken, res)
    if (recaptchaValid) {
        // find user with matching email
        User.findOne({ where: { email } }).then(user => {
            if (!user) res.send('user-not-found')
            else {
                // update passwordResetToken in db
                const passwordResetToken = crypto.randomBytes(64).toString('hex')
                user.update({ passwordResetToken })
                // send email to user with password reset link
                let message = {
                    to: email,
                    from: 'admin@weco.io',
                    subject: 'Weco - reset your password',
                    text: `
                        Hi, we recieved a request to reset your password.
                        If that's correct, copy and paste the address below to set a new password:
                        http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}?alert=reset-password&token=${passwordResetToken}
                    `,
                    html: `
                        <p>Hi, we recieved a request to reset your password on weco.</p>
                        <p>If that's correct click the link below to set a new password:</p>
                        <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}?alert=reset-password&token=${passwordResetToken}'>Set new password</a>
                    `,
                }
                sgMail.send(message)
                    .then(() => res.send('email-sent'))
                    .catch((error) => console.error(error))
            }
        })
    }
})

// todo: add recaptcha token
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body

    User.findOne({ where: { passwordResetToken: token } })
        .then(async user => {
            if (user) {
                let hashedPassword = await bcrypt.hash(newPassword, 10)
                user.update({ password: hashedPassword, passwordResetToken: null })
                res.send('success')
            } else {
                res.send('invalid-token')
            }
        })
})

// todo: add recaptcha token
router.post('/resend-verification-email', async (req, res) => {
    const { userId } = req.body
    let token = crypto.randomBytes(64).toString('hex')

    User.findOne({ where: { id: userId } })
        .then(user => {
            if (user) {
                user.update({ emailToken: token })
                let message = {
                    to: user.email,
                    from: 'admin@weco.io',
                    subject: 'Weco - verify your email',
                    text: `
                        Hi, thanks for creating an account on weco.
                        Please copy and paste the address below to verify your email address:
                        http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}?alert=verify-email&token=${token}
                    `,
                    html: `
                        <h1>Hi</h1>
                        <p>Thanks for creating an account on weco.</p>
                        <p>Please click the link below to verify your account:</p>
                        <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}?alert=verify-email&token=${token}'>Verfiy your account</a>
                    `,
                }
                sgMail.send(message)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                res.send('success')
            }
            else {
                res.send('user-not-found')
            }
        })
})

// todo: add recaptcha token
router.post('/verify-email', (req, res) => {
    const { token } = req.body
    User.findOne({ where: { emailToken: token } })
        .then(async user => {
            if (user) {
                const markEmailVerified = await user.update({ emailVerified: true, emailToken: null })
                const createNotification = Notification.create({
                    ownerId: user.id,
                    type: 'email-verified',
                    seen: false
                })
                Promise
                    .all([markEmailVerified, createNotification])
                    .then(res.send('success'))
            }
            else res.send(`Sorry, we couldn't find a user with that email token.`)
        })
})

module.exports = router