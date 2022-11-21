const Lock = artifacts.require("Lock");
const Debug = require("debug");
const LogTest = Debug("it");
const LogBefore = Debug("before");
const truffleAssert = require("truffle-assertions");
const {
  advanceTimeTo,
  getLatestBlockTimestamp,
  makeNetworkSnapshot,
  revertNetworkFromSnapshot
} = require("./ganache-helpers.js");

// process.env.DEBUG = `${process.env.DEBUG},Ganache.console`;

const add1YearTo = timestampInSecs => {
  const date = new Date(timestampInSecs * 1000) // Date consumes ms
  const oneYearFromDateInMS = new Date(
    date.setFullYear(date.getFullYear() + 1)
  ).getTime();
  return Math.floor(oneYearFromDateInMS/1000);
}

contract("Lock", function (accounts) {
  let lock, unlockTime, lockedAmount;
  let snapshotId;
  const owner = accounts[0];

  before(async function() {
    const ONE_GWEI = 1_000_000_000;
    lockedAmount = ONE_GWEI;

    const timestamp = await getLatestBlockTimestamp();
    unlockTime = add1YearTo(timestamp);
    LogBefore(`Unlock time:\n  ${unlockTime}\n  ${new Date(unlockTime*1000)}`);

    //lock 1 gwei for owner to reclaim after 1 year
    lock = await Lock.new(unlockTime, { value: lockedAmount, from: owner });
    snapshotId = await makeNetworkSnapshot();
  });

  beforeEach(async function() {
    snapshotId = await makeNetworkSnapshot();
  });

  afterEach(async function() {
    await revertNetworkFromSnapshot(snapshotId);
  });

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      assert.equal(await lock.unlockTime(), unlockTime);
    });

    it("Should set the right owner", async function () {
      assert(await lock.owner(), owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      assert.equal(
        await web3.eth.getBalance(lock.address),
        lockedAmount
      );
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      //Try to deploy a Lock contract that has an unlock date equal to the
      //current block timestamp
      latestTime = await getLatestBlockTimestamp();
      await truffleAssert.reverts(
        Lock.new(latestTime, { value: 1 }),
        "Unlock time should be in the future"
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        await truffleAssert.reverts(
          lock.withdraw({gas: 1_000_000}),
          "You can't withdraw yet"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const otherAccount = accounts[1];
        await advanceTimeTo(unlockTime);
        await truffleAssert.reverts(
          lock.withdraw({from: otherAccount, gas: 1_000_000}),
          "You aren't the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        await advanceTimeTo(unlockTime);
        await truffleAssert.passes(lock.withdraw());
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        await advanceTimeTo(unlockTime);
        const withdrawalTx = await lock.withdraw();
        truffleAssert.eventEmitted(
          withdrawalTx, 'Withdrawal', ev =>  ev.amount.toNumber() === lockedAmount);
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {

        await advanceTimeTo(unlockTime);

        // This looks to be a common assertion that users would make, there's
        // too much boiler plate! The account balance delta, accounting for
        // gasPrice (txCost)
        const preBalance = BigInt(await web3.eth.getBalance(owner))
        const tx = await lock.withdraw();
        const txCost = BigInt(tx.receipt.gasUsed) * BigInt(tx.receipt.effectiveGasPrice);
        const postBalance = BigInt(await web3.eth.getBalance(owner));

        LogTest(" preBalance: ", preBalance);
        LogTest("postBalance: ", postBalance);
        LogTest("      delta: ", postBalance - preBalance);

        // ugly
        expect(preBalance + BigInt(lockedAmount) - txCost).to.equal(postBalance);
        LogTest(tx.tx);
        LogTest("Lock instance", lock.address);
      });

    });
  });
});
