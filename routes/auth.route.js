const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs')

router.get('/signup', (req, res, next) => {
    res.render('user/sign-up')
})

router.post('/signup', (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt)

    User.create({
        username: req.body.username,
        password: hash
    }).then(data => {
        res.redirect('/auth/login')
    }).catch(err => {
        res.render('user/sign-up', {mensajeError: "Username is taken."})
    })
})

router.get('/login', (req, res, next) => {
    res.render('user/login')
})

router.post('/login', (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).then(data => {
        if (!data) {
            return res.render('user/login', {mensajeError: 'Account does not exist'})
        }
        const passwordHash = data.password
        const result = bcrypt.compareSync(req.body.password, passwordHash)

        if (!result) {
            return res.render('user/login', {mensajeError: 'Password incorrect'})
        }

        req.session.user = {
            uuid: data.id
        }

        req.session.save(err => {
            if (err) console.log(err)
            res.redirect('/private')
        })

        
    })
})

module.exports = router