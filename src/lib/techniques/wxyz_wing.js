import $Wing from './wing'
import { ARRAY, DIMENSION, BLOCK } from '../consts'
import { GetIds } from '../unit'
import { GetIntersection } from '../utils'

export default class $WXYZWing extends $Wing {
  constructor(grid, unsolved) {
    super(grid, unsolved);
    this.grid = grid;
    this.unsolved = unsolved;

    this.baseSizes = [3, 4];
    this.wingSizes = [2, 3];
    this.wingsCount = 3;

    this.name = 'WXYZ-Wing';
  }

  scan() {
    const { baseSizes, wingSizes, wingsCount } = this;
    super.scan(baseSizes, wingSizes, wingsCount);
  }

  solve($wing) {
    const { grid, unsolved } = this;
    const { base, wings } = $wing;

    const { candidates: baseCandidates } = grid[base];
    if (wings.every(wing => GetIntersection([baseCandidates, grid[wing].candidates]).size > 0)) {
      const { start, mask } = BLOCK;
      const data = [base, ...wings].map(wing => {
        const [row, column, block] = GetIds(wing);
        return [...new Set([
          ...ARRAY.map(cell => row * DIMENSION + cell),
          ...ARRAY.map(cell => cell * DIMENSION + column),
          ...mask.map(cell => start[block] + cell)
        ])];
      });

      const _intersection = data.map(el => new Set(el)).reduce((p, set) => new Set([...p].filter(cell => set.has(cell))), new Set([...data[0]]));
      const intersection = new Set([..._intersection].filter(cell => ![base, ...wings].includes(cell) && unsolved.has(cell)));

      const keys = GetIntersection(wings.map(wing => grid[wing].candidates));
      if (keys.size === 1) {
        const technique = `${this.name} ${[base, ...wings]}`;
        intersection
          .forEach(cell => {
            this.eliminate(cell, keys, technique);
          });
      }
    }
  }

}
