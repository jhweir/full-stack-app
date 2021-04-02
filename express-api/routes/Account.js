require('dotenv').config()
const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const authenticateToken = require('../middleware/authenticateToken')
const { Holon, User, Notification } = require('../models')

// GET
router.get('/account-data', authenticateToken, (req, res) => {
    const accountId = req.user.id
    User.findOne({ 
      where: { id: accountId },
      attributes: [
        'id', 'name', 'handle', 'bio', 'flagImagePath',
        [sequelize.literal(
          `(SELECT COUNT(*) FROM Notifications AS Notification WHERE Notification.ownerId = User.id AND Notification.seen = false)`
          ),'unseen_notifications'
        ]
      ],
      include: [
        {
          model: Holon,
          as: 'FollowedHolons',
          attributes: ['handle', 'name', 'flagImagePath'],
          through: { where: { relationship: 'follower', state: 'active' }, attributes: [] }
        },
        {
          model: Holon,
          as: 'ModeratedHolons',
          attributes: ['handle', 'name', 'flagImagePath'],
          through: { where: { relationship: 'moderator', state: 'active' }, attributes: [] }
        }
      ]
    })
    .then(user => res.send(user))
})

router.get('/account-notifications', authenticateToken, (req, res) => {
    const accountId = req.user.id
    Notification
        .findAll({
            where: { ownerId: accountId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'triggerUser',
                    attributes: ['id', 'handle', 'name', 'flagImagePath'],
                },
                {
                    model: Holon,
                    as: 'triggerSpace',
                    attributes: ['id', 'handle', 'name', 'flagImagePath'],
                },
                {
                    model: Holon,
                    as: 'secondarySpace',
                    attributes: ['id', 'handle', 'name', 'flagImagePath'],
                }
            ]
        })
        .then(notifications => res.send(notifications))
})

// POST
router.post('/update-account-setting', authenticateToken, async (req, res) => {
    const accountId = req.user.id
    const { setting, newValue } = req.body

    if (setting === 'change-user-name') {
        User.update({ name: newValue }, { where : { id: accountId } })
            .then(res.send('success'))
            .catch(err => console.log(err))
    }
    if (setting === 'change-user-bio') {
        User.update({ bio: newValue }, { where : { id: accountId } })
            .then(res.send('success'))
            .catch(err => console.log(err))
    }
})

router.post('/toggle-notification-seen', authenticateToken, (req, res) => {
    const accountId = req.user.id
    const { notificationId, seen } = req.body
    Notification
        .update({ seen }, { where: { id: notificationId, ownerId: accountId } })
        .then(res.send('success'))
})

router.post('/mark-all-notifications-seen', authenticateToken , (req, res) => {
    const accountId = req.user.id
    Notification
        .update({ seen: true }, { where: { ownerId: accountId } })
        .then(res.send('success'))
})

module.exports = router