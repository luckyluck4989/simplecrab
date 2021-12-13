const express = require("express");

// crabRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /crab.
const crabRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
const crabDAO = require("../dao/crab");
const battleDAO = require("../dao/battle");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

crabRoutes.route("/mycrab").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { "owner" : req.query.owner.toLowerCase() };

    db_connect
        .collection("crab")
        .find(myquery)
		.sort({"crabID" : 1})
		.toArray(function (err, result) {
          if (err) throw err;
		  res.json(result);
        });
});

crabRoutes.route("/battle").get(function (req, res) {
	//res.json(battleDAO.getBattle());
    let db_connect = dbo.getDb();
    let myquery = {};

    db_connect
        .collection("battle")
        .find(myquery)
		.sort({"battleStartTime" : -1})
		.toArray(function (err, result) {
          if (err) throw err;
		  res.json(result);
        });
});

/*
// This section will help you get a list of all the crab.
crabRoutes.post("/crab", async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { owner: ObjectId( req.params.owner )};
  db_connect
    .collection("crab")
    .find({myquery})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});
// This section will help you get a single crab by id
crabRoutes.route("/crab/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("crab")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new crab.
crabRoutes.route("/crab/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    _id: req.body.person_name,
    person_position: req.body.person_position,
    person_level: req.body.person_level,
  };
  db_connect.collection("crab").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a crab by id.
crabRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      person_name: req.body.person_name,
      person_position: req.body.person_position,
      person_level: req.body.person_level,
    },
  };
  db_connect
    .collection("crab")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 crab updated");
      response.json(res);
    });
});

// This section will help you delete a crab
crabRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("crab").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 crab deleted");
    response.status(obj);
  });
});
*/
var getMyCrab = function(owner, done) { //get a list of all the crab
  let db_connect = dbo.getDb();
  let myquery = { owner: owner};
  db_connect
    .collection("crab")
    .find({myquery})
    .toArray(function (err, res) {
      if (err) throw done(done);
      done(null, res);
    });
};

var getMyCrabByID = function(id, done) { //get a crab by id
  let db_connect = dbo.getDb();
  let myquery = { crabId: id };
  db_connect
      .collection("crab")
      .findOne(myquery, function (err, res) {
        if (err) done(err);
        done(null, res);
      });
};

var getBattleByCrabID = function(id, done) { //get all ended battles by crabid
  let db_connect = dbo.getDb();
  let myquery = { $or: [{ p1CrabID: id }, { p2CrabID: id }], battleStatus: '2' };
  db_connect
      .collection("battle")
      .find(myquery, function (err, res) {
        if (err) done(err);
        done(null, res);
      })
      .sort({"battleStartTime" : -1});
};

var getBattle = function(id, done) { //get all ongoing battles by id
  let db_connect = dbo.getDb();
  let myquery = { $or: [{ p1CrabID: id }, { p2CrabID: id }], battleStatus: { $ne: '2' } };
  db_connect
      .collection("battle")
      .find(myquery, function (err, res) {
        if (err) done(err);
        done(null, res);
      })
      .sort({"battleStartTime" : -1});
};

var getMyBattle = function(owner, done) { //get all battles by owner
  let db_connect = dbo.getDb();
  let myquery = { $or: [{ p1Adress: owner }, { p1Adress: owner }]};
  db_connect
      .collection("battle")
      .find(myquery, function (err, res) {
        if (err) done(err);
        done(null, res);
      })
      .sort({"battleStartTime" : -1});
};

var getAllBattleByCrabID = function(id, done) { //get all battles by crabid
  let db_connect = dbo.getDb();
  let myquery = { $or: [{ p1CrabID: id }, { p2CrabID: id }] };
  db_connect
      .collection("battle")
      .find(myquery, function (err, res) {
        if (err) done(err);
        done(null, res);
      })
      .sort({"battleStartTime" : -1});
};

var getBattleByBattleID = function(battleId, done) { //get a battle by id
  let db_connect = dbo.getDb();
  let myquery = { battleID: battleId };
  db_connect
      .collection("battle")
      .findOne(myquery, function (err, res) {
        if (err) done(err);
        done(null, res);
      });
};

module.exports = crabRoutes;
