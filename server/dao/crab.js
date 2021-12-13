// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


module.exports = {
  // Add new crab to db
  // event NewCrab(uint256 indexed eventType, address owner, uint256 crabID, uint256 kind, uint256 strength, CrabState state);
  addCrab : function (_crabInfo) {
      let db_connect = dbo.getDb();
      let myobj = {
        owner           : _crabInfo.owner.toLowerCase(),
        crabID          : _crabInfo.crabID,
        strength        : _crabInfo.strength,
        kind            : _crabInfo.kind,
        state           : _crabInfo.state
      };

      db_connect.collection("crab").insertOne(myobj, function (err, res) {
        if (err) throw err;
        //console.log(res);
      });

	  let myquery = {};
  
	  db_connect
		  .collection("crab")
		  .find(myquery, function (err, result) {
			if (err) throw err;
			console.log(result);
		  });
  },
  // Update info to db
  // event UpdateCrab(uint256 indexed eventType, address owner, uint256 crabID, uint256 strength, CrabState state);
  updateCrab : function (_crabInfo) {
      let db_connect = dbo.getDb();
      let myquery = { crabID : _crabInfo.crabID, owner : _crabInfo.owner.toLowerCase()};
      let newvalues = {
        $set : {
          strength  : _crabInfo.strength,
          state     : _crabInfo.strength
        }
      };

      db_connect
        .collection("crab")
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          console.log(res);
        });
  },
  //get a list of all the crab
  getMyCrab : function() { 
	console.log("Into getMyCrab DAO");
    let db_connect = dbo.getDb();
    let myquery = {};

    db_connect
        .collection("crab")
        .find({})
		.toArray(function (err, result) {
          if (err) throw err;
		  return result;
        });
  }
};
