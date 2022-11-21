module.exports = {

  // configure solidity log
  solidityLog: {
    displayPrefix: " :",
    disableMigrate: true
  },


  networks: {
    xdevelopment: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },

    mainfork: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 1,
    },
  },

  mocha: {
    timeout: 10000
  },

  compilers: {
    solc: {
      version: "0.8.17"
    }
  }
};
