const NauticalMindsEp = artifacts.require("NauticalMindsEp");

module.exports = async (deployer) => {
  await deployer.deploy(NauticalMindsEp);
}