import HiddenNaked from './hidden_naked'
import { TUPLE } from '../consts'
import { AddToSetInMap, GetSubsetSizes, GetTypeOfCells } from '../utils'

export default class $Naked extends HiddenNaked {
  constructor(grid, unsolved) {
    super(grid, unsolved);
    this.name = 'Naked';
  }

  analyze($subsetSize, $rows, $columns, $blocks) {
    const units = [$rows, $columns, $blocks];
    const { grid } = this;
    const [maxSize, subsetSizes] = GetSubsetSizes($subsetSize);

    units.forEach(unit => {
      unit.forEach(cells => {
        const values = new Map();
        cells.forEach(id => {
          const { candidates: { size } } = grid[id];
          if (size < maxSize) {
            AddToSetInMap(values, size, id);
          }
        });
        const subsets = new Map();
        values.forEach((value, key) => {
          value.forEach(cell => {
            const { candidates } = grid[cell];
            if (subsets.has(key)) {
              const map = subsets.get(key);
              map.set(cell, [...candidates]);
            } else {
              subsets.set(key, new Map([[cell, [...candidates]]]));
            }
          });
        });
        this.evaluate(subsetSizes, subsets);
      });
    });
  }

  eliminate($values, $cells, $type) {
    const type = TUPLE.get($type);
    const { name } = this;
    this.eliminateInSubset($values, $cells, `${name} ${type}`);
  }

  eliminateInSubset($values, $cells, $technique = '') {
    const types = GetTypeOfCells([...$cells]);
    types.forEach(el => {
      const { type, id } = el;
      const { grid, [type + 's']: unit } = this;
      const cells = unit.get(id);
      [...cells]
        .filter(el => !$cells.includes(el))
        .forEach(id => {
          grid[id].eliminateCandidates($values, $technique);
        });
    });
  }

}
