require("dotenv").config()
const express = require('express')
const router = express.Router()

var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')

const User = require('../models').User
const Holon = require('../models').Holon

const authenticateToken = require('../middleware/authenticateToken')

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-1'
})
  
const s3 = new aws.S3({})
  
const userFlagImageUpload = multer({
  storage: multerS3({
        s3: s3,
        bucket: `weco-${process.env.NODE_ENV}-user-flag-images`,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: 'testing...'})
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})
  
const userCoverImageUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: `weco-${process.env.NODE_ENV}-user-cover-images`,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: 'testing...'})
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})
  
const holonFlagImageUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: `weco-${process.env.NODE_ENV}-space-flag-images`,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: 'testing...'});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})
  
const holonCoverImageUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: `weco-${process.env.NODE_ENV}-space-cover-images`,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: 'testing...'});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})
  
router.post('/user-flag-image-upload', authenticateToken, function(req, res) {
    console.log('user-flag-image-upload')
    userFlagImageUpload.single('image')(req, res, function(err) {
        const { file, user } = req
        if (err) { console.log(err) }
        if (file) {
            User.update({ flagImagePath: file.location }, { where: { id: user.id }})
                .then(res.send('success'))
        } else { res.json({ message: 'failed' }) }
    })
})
  
  router.post('/user-cover-image-upload', authenticateToken, function(req, res) {
    console.log('user-cover-image-upload')
    userCoverImageUpload.single('image')(req, res, function(err) {
      const { file, user } = req
      if (err) { console.log(err) }
      if (file) {
        User
          .update({ coverImagePath: file.location }, { where: { id: user.id }})
          .then(res.send('success'))
      } else { res.json({ message: 'failed' }) }
    })
  })
  
  router.post('/holon-flag-image-upload', authenticateToken, function(req, res) {
    console.log('holon-flag-image-upload')
    holonFlagImageUpload.single('image')(req, res, function(err) {
      const { file, query } = req
      if (err) { console.log(err) }
      if (file) {
        Holon
          .update({ flagImagePath: file.location }, { where: { id: query.holonId } })
          .then(res.send('success'))
      } else { res.json({ message: 'failed' }) }
    })
  })
  
  router.post('/holon-cover-image-upload', authenticateToken, function(req, res) {
    console.log('holon-cover-image-upload')
    holonCoverImageUpload.single('image')(req, res, function(err) {
      const { file, query } = req
      if (err) { console.log(err) }
      if (file) {
        Holon
          .update({ coverImagePath: file.location }, { where: { id: query.holonId }})
          .then(res.send('success'))
      } else { res.json({ message: 'failed' }) }
    })
  })

module.exports = router