import { BASE, DIMENSION, TUPLE, BLOCK } from '../consts'
import { GetBlockId, GetAxis } from '../unit'
import { AddToSetInMap, AreCellsInOneBlock } from '../utils'

export default class $BoxLineReduction {
  constructor(grid, unsolved) {
    this.grid = grid;
    this.unsolved = unsolved;

    this.name = 'Box/Line Reduction';
  }

  scan() {
    const { grid, unsolved, name } = this;

    const [rows, columns] = [
      new Array(DIMENSION).fill(0).map(() => new Map()),
      new Array(DIMENSION).fill(0).map(() => new Map())
    ];

    unsolved.forEach(id => {
      const [row, column] = GetAxis(id);
      const { candidates } = grid[id];
      candidates.forEach(candidate => {
        AddToSetInMap(rows[row], candidate, id);
        AddToSetInMap(columns[column], candidate, id);
      });
    });

    const unitTypes = ['Row', 'Column'];
    const units = [rows, columns];
    units.forEach((unit, unitId) => {
      unit.forEach(el => {
        el.forEach((value, key) => {
          const { size } = value;
          if (size < BASE) {
            const cells = [...value];
            const tuplet = TUPLE.get(size);
            if (size === 1) {
              grid[cells[0]].solve(key, `Naked ${tuplet}`);
            } else if (AreCellsInOneBlock(cells)) {
              this.solve(cells, key, `${name}: ${unitTypes[unitId]} ${tuplet}`);
            }
          }
        });
      });
    });
  }

  solve($cells, $key, $technique = '') {
    const { unsolved } = this;
    const block = GetBlockId($cells[0]);
    const { start, mask } = BLOCK;
    const root = start[block];
    mask
      .map(cell => cell + root)
      .filter(cell => !$cells.includes(cell) && unsolved.has(cell))
      .forEach(cell => {
        this.eliminate(cell, new Set([$key]), $technique);
      });
  }

  eliminate($id, $values, $technique = '') {
    const { grid } = this;
    grid[$id].eliminateCandidates($values, $technique);
  }

}
