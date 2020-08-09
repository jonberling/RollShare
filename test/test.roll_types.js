/**
 * Tests for roll_types.js
 */

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

describe('AdvantageTag', function () {
  describe('#basic()', function () {
    it('has labels', function () {
      let roll_type = AdvantageTag.advantage;
      expect(roll_type).to.equal(AdvantageTag.advantage);

      roll_type = AdvantageTag.disadvantage;
      expect(roll_type).to.equal(AdvantageTag.disadvantage);

      roll_type = AdvantageTag.none;
      expect(roll_type).to.equal(AdvantageTag.none);
    });
  });
});
