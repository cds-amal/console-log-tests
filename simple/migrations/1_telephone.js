const Telephone = artifacts.require("Telephone");
module.exports = function(deployer) {
  deployer.deploy(Telephone, 13);
};
