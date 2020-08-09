describe('DndBeyondObserver', function () {
  describe('#constructor()', function () {
    it('is constructible', function () {
      const observer = new DndBeyondObserver();
      expect(observer).to.be.an('object');
    });
  });

  describe('#populateRollResult()', function () {
    const observer = new DndBeyondObserver();

    it('sets detail', function() {
      const rollResult = observer.populateRollResult('longsword', '', '', '', 42);
      expect(rollResult.detail).to.equal('longsword');
    });

    it('sets type', function() {
      const rollResult = observer.populateRollResult('', 'to hit', '', '', 0);
      expect(rollResult.type).to.equal('to hit');
    });

    it('sets notation', function() {
      const rollResult = observer.populateRollResult('', '', '1d20+3', '', 0);
      expect(rollResult.notation).to.equal('1d20+3');
    });

    it('sets die faces', function() {
      const rollResult = observer.populateRollResult('', '', '2d8', '1+2', 0);
      expect(rollResult.die_faces).to.deep.equal([1, 2]);
    });

    it('sets die faces w/ bonus', function() {
      const rollResult = observer.populateRollResult('', '', '2d8+7', '3+4+7', 0);
      expect(rollResult.die_faces).to.deep.equal([3, 4]);
    });

    it('sets total', function() {
      const rollResult = observer.populateRollResult('', '', '', '', 42);
      expect(rollResult.total).to.equal(42);
    });

    it('sets bonus', function() {
      const rollResult = observer.populateRollResult('', '', '2d8+42', '', 0);
      expect(rollResult.bonus).to.equal(42);
    });

    it('sets bonus when empty', function() {
      const rollResult = observer.populateRollResult('', '', '2d8', '', 0);
      expect(rollResult.bonus).to.equal(0);
    });

    it('sets bonus when negative', function() {
      const rollResult = observer.populateRollResult('', '', '1d20-1', '', 0);
      expect(rollResult.bonus).to.equal(-1);
    });

    it('does not set advantage when rolled without advantage', function() {
      const rollResult = observer.populateRollResult('', '', '1d20-1', '', 0);
      expect(rollResult.advantage).to.equal(AdvantageTag.none);
    });

    it('sets advantage when rolled with advantage', function() {
      const rollResult = observer.populateRollResult('', '', '1d20kh1-1', '', 0);
      expect(rollResult.advantage).to.equal(AdvantageTag.advantage);
    });

    it('sets disadvantage when rolled with disadvantage', function() {
      const rollResult = observer.populateRollResult('', '', '1d20kl1-1', '', 0);
      expect(rollResult.advantage).to.equal(AdvantageTag.disadvantage);
    });

    it('sets critical tag to none when no critical is rolled', function() {
      const rollResult = observer.populateRollResult('', '', '1d20+10', '10+10', 0);
      expect(rollResult.critical_tag).to.equal(CriticalTag.none);
    });

    it('sets critical tag to success when 20 is rolled', function() {
      const rollResult = observer.populateRollResult('', '', '1d20', '20', 0);
      expect(rollResult.critical_tag).to.equal(CriticalTag.natural20);
    });

    it('sets critical tag to failure when 1 is rolled', function() {
      const rollResult = observer.populateRollResult('', '', '1d20', '1', 0);
      expect(rollResult.critical_tag).to.equal(CriticalTag.natural1);
    });
  });
});
