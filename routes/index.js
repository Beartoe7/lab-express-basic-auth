const router = require("express").Router();

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

/* GET home page */

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("user/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {

  let {username, password, passwordRepeat} = req.body;

  //comprobaciones de campos
  if(username == "" || password == "" || passwordRepeat == "") {
    res.render("users/login", {mensajeError: "Faltan campos"});
    return;
  }
  else if(password != passwordRepeat) {
    res.render("users/login", {mensajeError: "Passwords diferentes"});
    return;
  }
  
  User.find({username})
  .then(results => {
    console.log("results ", results);
    // if(results) {  //[{username: "Mariona", password: "1234"}]
    if(results.length != 0) {
      //error
      res.render("users/login", {mensajeError: "El usuario ya existe"});
      return;
    }
    //el usuario ha pasado las validaciones

    //proceso de encriptación con bcrypt:
    let salt = bcrypt.genSaltSync(saltRounds);
    let passwordEncriptado = bcrypt.hashSync(password, salt);

    User.create({
      username: username, 
      password: passwordEncriptado
    })
    .then(result => {
      res.redirect("/user/signup");
    })
    .catch(err => next(err))
  })
  .catch(err => {
    console.log("err ", err);
    next(err);
  })
  
});


router.get("/signup", isLoggedOut, (req, res, next)=> {
  console.log("REQ.SESSION: ", req.session);
  res.render("users/signup");
})

router.post("/login", isLoggedOut, (req, res, next)=>{
  
  let {username, password} = req.body;


  if(username == "" || password == "") {
    res.render("users/login", { mensajeError: "Faltan campos" });
    return;
  } 

  User.find({username})
  .then(results => {
    if(results.length == 0) {
      res.render("users/login", { mensajeError: "Credenciales incorrectas" });
      return;
    }

    if(bcrypt.compareSync(password, results[0].password)) {
      req.session.currentUser = username; 
      res.redirect("/user/profile");
    } else {
      res.render("users/login", { mensajeError: "Credenciales incorrectas" });
    }
  })
  .catch(err => next(err));

})

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("users/profile", {username: req.session.currentUser});
})

router.get("/logout", isLoggedIn, (req, res, next)=>{
  req.session.destroy(err => {
    if(err) next(err);
    else res.redirect("/user/login");
  });
});

module.exports = router;







