import { RollResult, RollType, CriticalTag } from "/src/roll_types.js";

const assert = chai.assert;
const expect = chai.expect;

describe('RollResult', function () {
  describe('#constructor()', function () {
    it('is constructible', function () {
      const rollResult = new RollResult();
      expect(rollResult).to.be.an('object');
    });
  });
});

describe('CriticalTag', function () {
  describe('#basic()', function () {
    it('is truthy', function () {
      let critical = CriticalTag.none;
      expect(critical).to.be.not.ok;

      critical = CriticalTag.natural1;
      expect(critical).to.be.ok;

      critical = CriticalTag.natural20;
      expect(critical).to.be.ok;
    });
  });
});

describe('RollType', function () {
  describe('#basic()', function () {
    it('has labels', function () {
      let roll_type = RollType.advantage;
      expect(roll_type).to.be.ok;

      roll_type = RollType.disadvantage;
      expect(roll_type).to.be.ok;

      roll_type = RollType.regular;
      expect(roll_type).to.be.ok;
    });
  });
});
