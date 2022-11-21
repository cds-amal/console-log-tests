Truffle projects for testing Solidity Console log integration.

### truffle-config notes

```javascript
  solidityLog: {
    displayPrefix: " :", // defaults to "", this can be set to make the display
                         // nicer in `truffle develop` REPL

    disableMigrate: true // set this to disable migration on mainnet
                         // if a contract using console.log is to be migrated.
  }
  ```


## Simple

Simple tests using console.log

```console
.
├── simple
│   ├── contracts
│   │   └── Telephone.sol
│   ├── migrations
│   │   └── 1_telephone.js
│   ├── test
│   │   └── telephone.js
│   └── truffle-config.js

```

## Time Travel

More complex tests using console.log. Maybe not important.

```console
.
└── time-travel
    ├── contracts
    │   └── Lock.sol
    ├── migrations
    │   └── 1_lock.js
    ├── test
    │   ├── ganache-helpers.js
    │   └── lock.js
    └── truffle-config.js

```
