import { ARRAY, DIMENSION, BLOCK } from '../consts'
import { GetIds, } from '../unit'
import { GetCombinations, AreCellsInOneLine, AreCellsInOneBlock } from '../utils'

export default class $Wing {
  constructor(grid, unsolved) {
    this.grid = grid;
    this.unsolved = unsolved;
  }

  scan(baseSizes, wingSizes, wingsCount) {
    const { grid, unsolved } = this;
    const { start, mask } = BLOCK;

    const tuplets = new Set();
    unsolved.forEach(cell => {
      const { candidates } = grid[cell];
      if (baseSizes.some(size => candidates.size === size)) {
        tuplets.add(cell);
      }
    });
    [...tuplets].forEach(base => {
      const [row, column, block] = GetIds(base);
      const cells = [...new Set([
        ...ARRAY.map(cell => row * DIMENSION + cell),
        ...ARRAY.map(cell => cell * DIMENSION + column),
        ...mask.map(cell => start[block] + cell)
      ])].filter(cell => cell !== base);
      const f = cells.filter(cell => {
        const { candidates } = grid[cell];
        return wingSizes.some(size => candidates.size === size);
      });
      GetCombinations(f, wingsCount).forEach(wings => {
        const wingCells = [base, ...wings];
        if (!AreCellsInOneLine(wingCells) && !AreCellsInOneBlock(wingCells)) {
          this.solve({
            base,
            wings
          });
        }
      });
    });
  }

  eliminate($id, $values, $technique = '') {
    const { grid } = this;
    grid[$id].eliminateCandidates($values, $technique);
  }

}
