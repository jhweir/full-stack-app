require("dotenv").config()
const User = require('./models').User
const Holon = require('./models').Holon
const bcrypt = require('bcrypt')
const passport = require("passport")
const jwt = require('jsonwebtoken')

var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')

// const passportJWT = require('passport-jwt')
// const JwtStrategy = passportJWT.Strategy
// const ExtractJwt = passportJWT.ExtractJwt
//const FacebookStrategy = require("passport-facebook").Strategy
// const LocalStrategy = require('passport-local').Strategy
// const flash = require('express-flash')
// const session = require('express-session')
// const Sequelize = require('sequelize')
// var SequelizeStore = require("connect-session-sequelize")(session.Store)

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//const { default: Users } = require("../react-app/src/components/Users")

const app = express()
app.use(cors())
//app.use(cors({ origin:true, credentials: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', require('./routes/Routes'))

app.listen(5000, () => console.log('Listening on port 5000'))

app.get('/', (req, res) => res.send('INDEX'))

app.post('/api/log-in', async (req, res) => {
  const { email, password } = req.body
  // Authenticate user
  User.findOne({ where: { email: email } }).then(user => {
      //res.send(user)
      if (!user) { return res.send('user-not-found') }
      bcrypt.compare(password, user.password, function(error, success) {
          if (error) { res.send('incorrect-password') /* handle error */ }
          if (success) { 
              const payload = { id: user.id }
              const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
              const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
              //res.cookie('cookie_name', accessToken, { httpOnly: true })
              res.send(accessToken)
          }
          else { res.send('incorrect-password') }
      })
  })
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).send('No token')

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.send('Invalid token')
    //console.log(user)
    req.user = user
    next()
  })
}

app.post('/api/protected', authenticateToken, (req, res) => {
  console.log(req.user.name)
  res.send('success. UserId: ' + req.user.id)
})

app.get('/api/account-data', authenticateToken, (req, res) => {
  //console.log('req.user.id: ', req.user.id)
  User.findOne({ 
    where: { id: req.user.id },
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
  .then(user => { res.send(user) })
})

app.get('/api/user-holons', (req, res) => {
  //console.log('req.user.id: ', req.user.id)
  Holon.findAll({ 
    where: { '$HolonFollowers.id$': '8' },
    attributes: ['handle'],
    include: [{ 
      model: User,
      as: 'HolonFollowers',
      attributes: [],
      through: { where: { state: 'active' } }
    }]
  }).then(holons => res.send(holons))

})

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: 'eu-west-1'
})

var s3 = new aws.S3({ /* ... */ })
 
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'new-weco-user-profile-images',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'testing...'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

app.post('/api/image-upload', authenticateToken, function(req, res) {
  upload.single('image')(req, res, function(err) {
    if (err) { console.log(err) }
    if (req.file) {
      User
        .update({ profileImagePath: req.file.location }, { where: { id: req.user.id }})
        .then(res.send('success'))
    } else { res.json({ message: 'failed' }) }
  })
})

app.post('/api/holon-flag-image-upload', authenticateToken, function(req, res) {
  const { holonId } = req.query
  upload.single('image')(req, res, function(err) {
    if (err) { console.log(err) }
    if (req.file) {
      Holon
        .update({ flagImagePath: req.file.location }, { where: { id: holonId }})
        .then(res.send('success'))
    } else { res.json({ message: 'failed' }) }
  })
})



// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
//   if (req.method === "OPTIONS") {
//       return res.status(200).end();
//   } else {
//       next();
//   }
// })

// const options = {
//   secretOrKey: process.env.ACCESS_TOKEN_SECRET,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// }

// const strategy = new JwtStrategy(options, (payload, next) => {
//   //const user = null
//   User.findOne({ where: { id: payload.id }}).then(user => next(null, user))
// })

// passport.use(strategy)
// app.use(passport.initialize())


// create database, ensure 'sqlite3' in your package.json
// var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   dialect: "mysql",
//   host: process.env.DB_HOST,
// });
// var store = new SequelizeStore({ db: sequelize })
// store.sync()

// app.get('/api/user-data', passport.authenticate('local', { session: true }), (req, res) => {
//   //console.log('req.session.passport.user', req.session)
//   res.json(req.session)
//   // if (req.user) {
//   //   res.json(req.user.dataValues)
//   // } else {
//   //   res.send('failed')
//   // }

//   //console.log('req.session', req.session)
//   // User.findOne({ where: { id: userId } })
//   // .then(user => res.json(user))
// })

// app.get('/api/protected', passport.authenticate('local', { session: true }), (req, res, next) => {
//   res.send('success')
// })

// app.get('/failure', (req, res) => {
//   res.send('log-in failed')
// })

// // Log in
// app.post('/api/log-in',
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/failure',
//     failureFlash: true
//   //})//(req, res, next)
// }))

// app.get('/api/log-out', (req, res) => {
//   req.logOut()
//   res.send('logged out')
// })

// app.get('/api/check-auth', passport.authenticate('local', { session: true }), (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send('true')
//   } else { res.send('false') }
// })

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   let user = User.findOne({ where: { id: id } })
//   done(null, true)
// })

// app.use(flash())
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   cookie: { 
//     name: 'test',
//     path: '/',
//     httpOnly: false,
//     secure: false,
//     maxAge: 1000 * 60 * 30
//   }
// }))
// app.use(passport.initialize())
// app.use(passport.session())

// // Local strategy
// passport.use(
//   new LocalStrategy(
//     { usernameField: 'email', passwordField: 'password' },
//     (email, password, done) => {
//       console.log(email)
//       User.findOne({ where: { email: email } }).then(user => {
//         //console.log(user)
//         if (!user) { return done(null, false, { message: 'User not found' }) }
//         bcrypt.compare(password, user.password, function(error, success) {
//           //if (error) { /* handle error */ }
//           if (success) { return done(null, user) }
//           else { return done(null, false, { message: 'Incorrect password' }) }
//         })
//       }).catch(err => { done(err) })
//     }
//   )
// )

// app.post('/api/log-in', (req, res) => {
//   console.log('req.body', req.body)
// })
// app.post('/api/log-in', async (req, res) => {
//   const { email, password } = req.body
//   // Authenticate user
//   User.findOne({ where: { email: email } }).then(user => {
//       //res.send(user)
//       if (!user) { return res.status(400).send('User not found') }
//       bcrypt.compare(password, user.password, function(error, success) {
//           if (error) { /* handle error */ }
//           if (success) { 
//               // const payload = { id: user.id }
//               // const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
//               // const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15m' })
//               res.cookie('cookie_name', accessToken, { httpOnly: true })
//               // res.send(refreshToken)
//           }
//           else { res.send('Incorrect password') }
//       })
//   })

//   // Create JWT access token
//   // const user = { email: email }
//   // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
//   // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
//   // res.json({ accessToken: accessToken, refreshToken: refreshToken })
// })


// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//       if (err) return res.sendStatus(403)
//       req.user = user
//       next()
//   })
// }



//Facebook strategry
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       profileFields: ['name', 'email', 'picture']
//     },
//     function(accessToken, refreshToken, profile, done) {
//       // console.log('accessToken', accessToken)
//       // console.log('refreshToken', refreshToken)
//       // console.log('profile', profile)
//       // console.log('profile.id', profile.id)

//       User.findOne({ 
//           where: { facebookId: profile.id }
//       }).then(foundUser => {
//           if (foundUser) { 
//             userId = foundUser.dataValues.id
//           }
//           else {
//             User.create({ 
//               name: profile.name.givenName,
//               profileImagePath: profile.photos[0].value,
//               facebookId: profile.id
//             })
//             .then(createdUser => {
//               userId = createdUser.dataValues.id
//             })
//           }
//       })//.then(console.log('user', user))
//       //user = {...profile}
//       done(null, profile)
//     }
//   )
// )

// app.get('/auth/facebook',
//   passport.authenticate('facebook'))
 
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('http://localhost:3000/h/root')
//   })

// const options = {
//   secretOrKey: process.env.ACCESS_TOKEN_SECRET,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// }

// const strategy = new JwtStrategy(options, (payload, next) => {
//   //const user = null
//   User.findOne({ where: { id: payload.id }}).then(user => next(null, user))
// })

// passport.use(strategy)
//app.use(passport.initialize())


// const authenticateUser = (email, password, done) => {
//   User.findOne({ where: { email: email } }).then(user => {
//     //res.send(user)
//     if (!user) { return done(null, false, { message: 'User not found' }) }
//     bcrypt.compare(password, user.password, function(error, success) {
//       if (error) { /* handle error */ }
//       if (success) { return done(null, user) }
//       else { return done(null, false, { message: 'Incorrect password' }) }
//     })
//   })
// }



// const jwt = require('jsonwebtoken')
// const passportJWT = require('passport-jwt')
// const JwtStrategy = passportJWT.Strategy
// const ExtractJwt = passportJWT.ExtractJwt



//const { authenticate } = require("passport")

// initalize sequelize with session store