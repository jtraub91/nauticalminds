const NauticalToken = artifacts.require("NauticalToken");

module.exports = async (deployer) => {
  await deployer.deploy(NauticalToken);
}