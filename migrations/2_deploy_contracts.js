var SCG20Token = artifacts.require("./SCG20Token.sol");
var SimpleCrabGame = artifacts.require("./SimpleCrabGame.sol");

module.exports = async function(deployer) {
  await deployer.deploy(SCG20Token);
  await deployer.deploy(SimpleCrabGame, SCG20Token.address);
};