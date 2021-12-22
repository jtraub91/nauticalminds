const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();
 
module.exports = {
  migrations_directory: "./contracts_migrations",
  contracts_build_directory: "./contracts_build",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.RINKEBY_RPC_URL),
      network_id: '4',
      skipDryRun: true,
    }
  },
  compilers: {
    solc: {
      version: "0.8.10",
    }
  },
};
