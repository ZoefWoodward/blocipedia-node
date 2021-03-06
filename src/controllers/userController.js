const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");

const secretKey = process.env.SECRET_KEY;
const publishableKey = process.env.PUBLISHABLE_KEY;
const stripe = require("stripe")(secretKey);


module.exports = {

  index(req, res, next){
    res.render("/users");
  },

  signUp(req, res, next){
    res.render("users/sign_up");
  },

  create(req, res, next){
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up!");
          res.redirect("/");
        })
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in");
  },

  signIn(req, res, next){
    passport.authenticate("local")(req, res, () => {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've succesfully signed out!");
    res.redirect("/");
  },

  //remember to change this to your live secret key in production: https://dashboard.stripe.com/account/apikeys
  upgrade(req, res, next){
    res.render("users/upgrade", {publishableKey});
  },

  payment(req, res, next){
    let payment = 1500;
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    }) 
    .then((customer) => {
      stripe.charges.create({
        amount: payment,
        description: "The Archive Premium Membership Charge",
        currency: "USD",
        customer: customer.id
      })
    }) 
    .then((charge) => {
      userQueries.upgrade(req.user.dataValues.id);
      res.render("users/payment_success");
    })
  },

  downgrade(req, res, next){
    userQueries.downgrade(req.user.dataValues.id);
    wikiQueries.privateToPublic(req.user.dataValues.id);
    req.flash("notice", "You are no longer a premium user!");
    res.redirect("/");
  },

  showCollaborations(req, res, next){
    userQueries.getUser(req.user.id, (err, result) => {
      user = result["user"];
      collaborations = result["collaborations"];
      if(err || user == null){
        res.redirect(404, "/");
      } else {
        res.render("users/collaborations", {user, collaborations});
      }
    });
  }
}