// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


module.exports = {
  // Add new crab to db
  // event NewBattle(uint256 indexed eventType, uint256 _battleID, uint256 _battleAmount, address _p1Adress, uint256 _p1CrabID, address _p2Adress, uint256 _p2CrabID, uint256 _winerCrabID, BattleState _battleStatus, uint256 _battleStartTime, uint256 _battleEndTime);
  addBattle : function (_battleInfo) {
      let db_connect = dbo.getDb();
      let myobj = {
        _id              : ObjectId(_battleInfo._battleID)
        battleID         : _battleInfo._battleID,
        battleAmount     : _battleInfo._battleAmount,
        p1Adress         : _battleInfo._p1Adress,
        p1CrabID         : _battleInfo._p1CrabID,
        p2Adress         : _battleInfo._p2Adress,
        p2CrabID         : _battleInfo._p2CrabID,
        winerCrabID      : _battleInfo._winerCrabID,
        battleStatus     : _battleInfo._battleStatus,
        battleStartTime  : _battleInfo._battleStartTime,
        battleEndTime    : _battleInfo._battleEndTime
      };

      console.log(myobj);
      db_connect.collection("battle").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log(res);
      });
  },
  // Update info to db
  // event UpdateBattle(uint256 indexed eventType, uint256 _battleID, address _p1Adress, uint256 _p1CrabID, address _p2Adress, uint256 _p2CrabID, uint256 _winerCrabID, BattleState _battleStatus, uint256 _battleStartTime, uint256 _battleEndTime);
  updateBattle : function (_battleInfo) {
      let db_connect = dbo.getDb();
      let myquery = { _id : ObjectId(_battleInfo._battleID)};
      let newvalues = {
        $set : {
            p2Adress         : _battleInfo._p2Adress,
            p2CrabID         : _battleInfo._p2CrabID,
            winerCrabID      : _battleInfo._winerCrabID,
            battleStatus     : _battleInfo._battleStatus,
            battleStartTime  : _battleInfo._battleStartTime,
            battleEndTime    : _battleInfo._battleEndTime
        }
      };

      db_connect
        .collection("battle")
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          console.log(res);
        });
  },
  // get battle by battle id
  getBattleByBattleID : function (_battleID) {
      let db_connect = dbo.getDb();
      let myquery = { _id : ObjectId(_battleID)};

      db_connect
          .collection("battle")
          .findOne(myquery, function (err, result) {
            if (err) throw err;
            console.log(result);
          });
  },
  // get battle crab by id
  getBattleByCrabID : function (_crabID) {
      let db_connect = dbo.getDb();
      let myquery = {
        $or: [
            {'p1CrabID': _crabID},
            {'p2CrabID': _crabID}
        ],
        "battleStatus" : { "$in": ["0", "1"] }
      };

      db_connect
          .collection("battle")
          .find(myquery)
          .sort({"battleStartTime":-1}, function (err, result) {
                if (err) throw err;
                console.log(result);
          });
  },
  // get all my battle exsist
  getMyBattle : function (_owner) {
      let db_connect = dbo.getDb();
      let myquery = {
        $or: [
            {'p1Adress': _owner},
            {'p2Adress': _owner}
        ],
        "battleStatus" : { "$in": ["0", "1"] }
      };

      db_connect
          .collection("battle")
          .find(myquery)
          .sort({"battleStartTime":-1}, function (err, result) {
                if (err) throw err;
                console.log(result);
          });
  },
  // get all battle exists
  getBattle : function (_owner) {
      let db_connect = dbo.getDb();
      // status (0:Waiting, 1:Fighting, 2:Ended)
      let myquery = {"battleStatus" : { "$in": ["0", "1"] }};

      db_connect
          .collection("battle")
          .find(myquery)
          .sort({"battleStartTime":-1}, function (err, result) {
                if (err) throw err;
                console.log(result);
          });
  },
};
