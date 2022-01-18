require('dotenv').config()
const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const authenticateToken = require('../middleware/authenticateToken')
const { Holon, User, Notification, HolonUser } = require('../models')

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
// router.post('/update-account-setting', authenticateToken, async (req, res) => {
//     const accountId = req.user.id
//     const { setting, newValue } = req.body

//     if (setting === 'change-user-name') {
//         User.update({ name: newValue }, { where : { id: accountId } })
//             .then(res.send('success'))
//             .catch(err => console.log(err))
//     }
//     if (setting === 'change-user-bio') {
//         User.update({ bio: newValue }, { where : { id: accountId } })
//             .then(res.send('success'))
//             .catch(err => console.log(err))
//     }
// })

router.post('/update-account-name', authenticateToken, async (req, res) => {
    const accountId = req.user.id
    const { payload } = req.body

    User.update({ name: payload }, { where : { id: accountId } })
        .then(res.send('success'))
        .catch(err => console.log(err))
})

router.post('/update-account-bio', authenticateToken, async (req, res) => {
    const accountId = req.user.id
    const { payload } = req.body

    User.update({ bio: payload }, { where : { id: accountId } })
        .then(res.send('success'))
        .catch(err => console.log(err))
})

router.post('/mark-notifications-seen', authenticateToken, (req, res) => {
    const accountId = req.user.id
    const ids = req.body
    console.log('ids: ', ids)
    Notification
        .update({ seen: true }, { where: { id: ids, ownerId: accountId } })
        .then(res.send('success'))
})

// router.post('/toggle-notification-seen', authenticateToken, (req, res) => {
//     const accountId = req.user.id
//     const { notificationId, seen } = req.body
//     Notification
//         .update({ seen }, { where: { id: notificationId, ownerId: accountId } })
//         .then(res.send('success'))
// })

// router.post('/mark-all-notifications-seen', authenticateToken , (req, res) => {
//     const accountId = req.user.id
//     Notification
//         .update({ seen: true }, { where: { ownerId: accountId } })
//         .then(res.send('success'))
// })

// move to Space routes?
router.post('/respond-to-mod-invite', authenticateToken, async (req, res) => {
    const accountId = req.user.id
    const { notificationId, userId, spaceId, response } = req.body

    if (response === 'accepted') {
        // create moderator relationship
        HolonUser.create({
            relationship: 'moderator',
            state: 'active',
            holonId: spaceId,
            userId: accountId
        }).then(() => {
            // update mod-invite notification
            Notification
                .update({ state: 'accepted', seen: true }, { where: { id: notificationId } })
                .then(() => {
                    // send new mod-invite-response notification to trigger user
                    Notification.create({
                        ownerId: userId,
                        type: 'mod-invite-response',
                        state: 'accepted',
                        seen: false,
                        holonAId: spaceId,
                        userId: accountId
                    }).then(() => {
                        res.status(200).send({ message: 'Success' })
                    }).catch(() => res.status(500).send({ message: 'Failed to create mod-invite-response notification' }))
                }).catch(() => res.status(500).send({ message: 'Failed to update mod-invite notification' }))
        }).catch(() => res.status(500).send({ message: 'Failed to create moderator relationship' }))
    } else if (response === 'rejected') {
        // update mod-invite notification
        Notification
            .update({ state: 'rejected', seen: true }, { where: { id: notificationId } })
            .then(() => {
                // send new mod-invite-response notification to trigger user
                Notification.create({
                    ownerId: userId,
                    type: 'mod-invite-response',
                    state: 'rejected',
                    seen: false,
                    holonAId: spaceId,
                    userId: accountId
                }).then(() => {
                    res.status(200).send({ message: 'Success' })
                }).catch(() => res.status(500).send({ message: 'Failed to create mod-invite-response notification' }))
            }).catch(() => res.status(500).send({ message: 'Failed to update mod-invite notification' }))
    }
})

module.exports = router