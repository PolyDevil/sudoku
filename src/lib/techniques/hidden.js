import HiddenNaked from './hidden_naked'
import { TUPLE } from '../consts'
import { AddToSetInMap, GetSubsetSizes } from '../utils'

export default class $Hidden extends HiddenNaked {
  constructor(grid, unsolved) {
    super(grid, unsolved);
    this.name = 'Hidden';
  }

  analyze($subsetSize, $rows, $columns, $blocks) {
    const units = [$rows, $columns, $blocks];
    const { grid, name } = this;
    const [maxSize, subsetSizes] = GetSubsetSizes($subsetSize);

    units.forEach(unit => {
      unit.forEach(cells => {
        const values = new Map();
        cells.forEach(id => {
          const { candidates } = grid[id];
          candidates.forEach(candidate => {
            AddToSetInMap(values, candidate, id);
          });
        });
        const subsets = new Map();
        values.forEach((value, key) => {
          const { size } = value;
          if (size < maxSize) {
            if (size === 1) {
              grid[[...value][0]].solve(key, `${name} ${TUPLE.get(1)}`);
            } else if (subsets.has(size)) {
              const map = subsets.get(size);
              map.set(key, [...value]);
            } else {
              subsets.set(size, new Map([[key, [...value]]]));
            }
          }
        });
        this.evaluate(subsetSizes, subsets);
      });
    });
  }

  eliminate($cells, $values, $type) {
    const type = TUPLE.get($type);
    const { grid, name } = this;
    $cells.forEach(id => {
      grid[id].updateCandidates(new Set($values), `${name} ${type}`);
    });
  }

}
