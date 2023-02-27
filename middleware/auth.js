const isAuthenticated = (req, res, next) => {
    console.log(req.session.user)
    if (req.session.user) {
        next()
    } else {
        res.redirect('/auth/login')
    }
}

module.exports = isAuthenticated