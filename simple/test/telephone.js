const Telephone = artifacts.require("Telephone");

contract("Simple", function(/* accounts */) {

  // the subject
  let subj;
  const deployedSecret = 13;

  describe("Works with migrations deployment", function() {
    before(async function() {
      subj = await Telephone.deployed();
    });

    it("Should have a deployed contract", async function() {
      return assert.isTrue(subj !== undefined);
    });

    it("has the secret", async function() {
      const expectedSecret = 13;
      const best = await subj.secret();
      return assert.equal(expectedSecret, best);
    });

    it("has the derived Secret\n\n", async function() {
      const best = await subj.derivedSecret();
      const expected = 100 * deployedSecret + deployedSecret;
      return assert.equal(expected, best);
    });
  });

  describe("Works with new deployment", function() {
    let newSecret;
    before(async function() {
      const getRnd = function() {
        const [min, max] = [13, 1013];
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      newSecret = getRnd();
      subj = await Telephone.new(newSecret);
    });

    it("Should have a deployed contract", async function() {
      return assert.isTrue(subj !== undefined);
    });

    it("has the secret", async function() {
      const best = await subj.secret();
      return assert.equal(newSecret, best);
    });

    it("has the derived Secret", async function() {
      const best = await subj.derivedSecret();
      const expected = 100 * newSecret + newSecret;
      return assert.equal(expected, best);
    });
  })
});
