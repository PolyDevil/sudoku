export default class Cell {
  constructor(id, cellOnSolved, value = 0) {
    this.id = id;
    this.value = value;
    this.cellOnSolved = cellOnSolved;
    this.candidates = new Set();

    const isGiven = value > 0;
    this.isGiven = isGiven;
    this.isSolved = isGiven;
  }

  setCandidates($candidates) {
    this.candidates = $candidates;
  }

  updateCandidates($candidates, $technique = '') {
    const { candidates } = this;
    const eliminatedCandidats = new Set([...candidates].filter(el => !$candidates.has(el)));
    const { size } = eliminatedCandidats;
    if (size > 0) {
      this.candidates = $candidates;
    }
    if (this.candidates.size === 1) {
      this.solve([...this.candidates][0], $technique || `Naked single`);
    }
  }

  eliminateCandidates($candidates, $technique = '') {
    $candidates.forEach(candidate => {
      this.eliminateCandidate(candidate);
    });
  }

  eliminateCandidate($candidate) {
    const { candidates } = this;
    if (candidates.has($candidate)) {
      candidates.delete($candidate);
    }
    if (this.candidates.size === 1) {
      this.solve([...candidates][0], `Naked single`);
    }
  }

  solve($value, $technique) {
    const { id, cellOnSolved } = this;
    this.value = $value;
    this.isSolved = true;
    cellOnSolved(id, $value, $technique);
  }

}
