var SCG20Token = artifacts.require("./SCG20Token.sol");
var SimpleCrabGame = artifacts.require("./SimpleCrabGame.sol");

module.exports = async function(deployer) {
  //await deployer.deploy(SCG20Token);
  await deployer.deploy(SimpleCrabGame, SCG20Token.address);
  await deployer.deploy(SimpleCrabGame, "0x25E3da850910D346bdf34Ee1CBd3ea82ced24429");
};