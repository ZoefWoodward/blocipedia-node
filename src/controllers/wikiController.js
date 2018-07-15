const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");

module.exports = {

    index(req, res, next){
      wikiQueries.getAllWikis((err, wikis) => {
          if(err){
              res.redirect(500, "static/index");
          } else {
              res.render("wikis/index", {wikis});
          }
      });
    },


    new(req, res, next){
      const authorized = new Authorizer(req.user).new();
      if(authorized){
        res.render("wikis/new");
      } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/wikis");
      }
    },

    create(req, res, next){
      const authorized = new Authorizer(req.user).create();
      if(authorized){
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.user.id
        };
        wikiQueries.addWiki(newWiki, (err, wiki) => {
            if(err){
                res.redirect(500, "/wikis/new");
            } else {
                res.redirect(303, `/wikis/${wiki.id}`);
            }
        });
    } else { 
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
      

    show(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/");
            } else {
                res.render("wikis/show", {wiki});
            }
        });
    },

    //possible removal of .params.id if failure
    destroy(req, res, next){
        wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
            if(err){
                res.redirect(500, `/wikis/${req.params.id}`); 
            } else {
                res.redirect(303, "/wikis"); 
            }
        });
    },

    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/");
            } else {
              const authorized = new Authorizer(req.user, wiki).edit();
              if(authorized){
                res.render("wikis/edit", {wiki});
            } else {
              req.flash("notice", "You are not authorized to do that.");
              res.redirect(`/wikis/${wiki.id}`)
            }
          }
        });
    },

    //possible removal of .params.id if failure
    update(req, res, next){
        wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, `/wikis/${wiki.id}/edit`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    }
  }