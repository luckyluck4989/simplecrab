const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const Web3 = require('web3');
const fs = require('fs');
const provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545');
let web3 = new Web3(provider);
let senderAccount = '0x2C5b0Dd54bdF044629AA4b042FCa7b230b9e60Aa';
const contractJSON = JSON.parse(fs.readFileSync('./contracts/SimpleCrabGame.json'), 'utf8');
const abi = contractJSON.abi;
const contract = new web3.eth.Contract(abi, senderAccount);
const eventAbis = contract.options.jsonInterface.filter((abiObj) => abiObj.type === 'event')

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");
const crabDAO = require("./dao/crab");
const battleDAO = require("./dao/battle");

app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
    	console.log('Connect DB');
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
                        console.log('-----------------------------------');
                        console.log('ABI:' + eventSig);
                        const decoded = web3.eth.abi.decodeLog(abi.inputs, result.data, result.topics.slice(1));
                        console.log(decoded);
                        console.log(decoded.eventType);

                        if (decoded.eventType == 'undefined')
                            return;

                        switch (decoded.eventType) {
                            // new crab
                            case '1001':
                                crabDAO.addCrab(decoded);
                                console.log('New Crab Minted');
                                break;
                            // crab info update
                            case '1002':
                                crabDAO.updateCrab(decoded);
                                console.log('Crab Updated');
                                break;
                            // new battle
                            case '1003':
                            	battleDAO.addBattle(decoded);
                                console.log('New Battle Created');
                                break;
                            // battle info updated
                            case '1004':
                                battleDAO.updateBattle(decoded);
                                console.log('Battle Info Updated');
                                break;
                            default:
                                console.log('Invalid !');
                        }


                    }
                }
            }
    });

});
