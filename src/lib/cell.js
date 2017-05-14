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
      this.setCandidates($candidates);
    }
  }

  eliminateCandidates($candidates, $technique = '') {
    $candidates.forEach(candidate => {
      this.eliminateCandidate(candidate);
    });
    const { candidates, candidates: { size } } = this;
    if (size === 1) {
      this.solve([...candidates][0], $technique);
    }
  }

  eliminateCandidate($candidate) {
    const { candidates } = this;
    if (candidates.has($candidate)) {
      candidates.delete($candidate);
    }
  }

  solve($value, $technique) {
    const { id, cellOnSolved } = this;
    this.value = $value;
    this.isSolved = true;
    cellOnSolved(id, $value);
  }

}
