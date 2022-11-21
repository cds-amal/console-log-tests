module.exports = {
  solidityLog: {
    displayPrefix: " |",
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

  mocha: {},

  compilers: {
    solc: {
      version: "0.8.17"
    }
  },

  db: {
    enabled: false,
    host: "127.0.0.1",
    adapter: {
      name: "indexeddb",
      settings: {
        directory: "db"
      }
    }
  }
};
