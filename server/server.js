const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const Web3 = require('web3');
const fs = require('fs');
const provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:7545');
let web3 = new Web3(provider);
let senderAccount = '0x29b8aEdf5B9658c5ABf682605439456AA2A7F9Fd';
const contractJSON = JSON.parse(fs.readFileSync('./contracts/OddEvenGameP1.json'), 'utf8');
const abi = contractJSON.abi;
const contract = new web3.eth.Contract(abi, senderAccount);
const eventAbis = contract.options.jsonInterface.filter((abiObj) => abiObj.type === 'event')

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  
  });

  	console.log(`Server is running on port: ${port}`);

	let subscription = web3.eth.subscribe("logs", function(err, result){
	    if (err){
	    	console.log(err);
	    } else {
	        const eventSig = result.topics[0];
	            for (let abi of eventAbis) {
	                if (eventSig === abi.signature) {
	                    const decoded = web3.eth.abi.decodeLog(abi.inputs, result.data, result.topics.slice(1));
	                    console.log(decoded._gameID);

						let db_connect = dbo.getDb();
						let myobj = {
						  gameID: decoded._gameID,
						  timeEndGame: decoded._timeEndGame,
						  amountPerPlayer: decoded._amountPerPlayer
						};

						db_connect.collection("records").insertOne(myobj, function (err, res) {
						  if (err) throw err;
						});

	                }
	            }
		    }
	});

});
