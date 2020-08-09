/**
 * Tests for util.js
 */

describe('Util', function () {
  describe('#abbreviationToWord()', function () {
    it('returns full word on known input', function () {
      const word = abbreviationToWord("str");
      expect(word).to.be.equal("Strength");
    });
    it('returns abbreviation on unknown input', function() {
      const word = abbreviationToWord("unknown_abbr");
      expect(word).to.be.equal("unknown_abbr");
    });
  });
});
