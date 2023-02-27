const isAuthenticated = require("../middlewares/auth");

const router = require("express").Router();


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/private", isAuthenticated, (req, res, next) => {
  res.render('private')
})

router.get("/main", (req, res, next) => {
  res.render('main')
})

module.exports = router;
