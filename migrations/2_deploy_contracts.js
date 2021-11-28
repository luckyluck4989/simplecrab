var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ERC20Basic = artifacts.require("ERC20Basic");
var OddEvenGameP1 = artifacts.require("OddEvenGameP1");

module.exports = function(deployer) {
  //deployer.deploy(SimpleStorage);
  //deployer.deploy(ERC20Basic);
  deployer.deploy(OddEvenGameP1, '0x36EAf25c9F5aa1bF49F5A5Bf02e7df562D387654');
};