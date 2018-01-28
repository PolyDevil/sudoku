import { TUPLE, MIN_SUBSET_SIZE, MAX_SUBSET_SIZE, DEFAULT_SUBSET_SIZE } from '../consts'
import { GetIds } from '../unit'
import { AddToSetInMap, GetSubsetSizes, GetTypeOfCells, GetCombinations } from '../utils'

export default class $Naked {
  constructor(grid, unsolved) {
    this.grid = grid;
    this.unsolved = unsolved;

    this.rows = new Map();
    this.columns = new Map();
    this.blocks = new Map();
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

  resetUnitsStore() {
    this.rows.clear();
    this.columns.clear();
    this.blocks.clear();
  }

  scan($maxSubsetSize = DEFAULT_SUBSET_SIZE) {
    this.resetUnitsStore();

    const { unsolved, name, rows, columns, blocks } = this;

    unsolved.forEach(id => {
      const [row, column, block] = GetIds(id);
      AddToSetInMap(rows, row, id);
      AddToSetInMap(columns, column, id);
      AddToSetInMap(blocks, block, id);
    });

    if (Number.isInteger($maxSubsetSize)) {
      if ($maxSubsetSize < MIN_SUBSET_SIZE) {
        throw new Error(`Error! $maxSubsetSize should be greater or equal than ${MIN_SUBSET_SIZE}.`);
      } else {
        const subsetSize = Math.min($maxSubsetSize, MAX_SUBSET_SIZE);
        this.analyze(subsetSize, rows, columns, blocks);
      }
    } else {
      throw new Error(`Error! $maxSubsetSize should be an integer. Check ${name}:scan: method.`);
    }
  }

  evaluate($subsetSizes, $subsets) {
    $subsetSizes.reduce((previousValue, currentValue) => {
      const subset = $subsets.get(currentValue);
      if (subset) {
        const { size } = subset;
        if (size > 0) {
          const set = new Map([...previousValue, ...subset]);
          if (set.size > currentValue - 1) {
            this.solve(currentValue, set);
          }
          return set;
        }
      }
      return previousValue;
    }, new Map());
  }

  solve($type, $map) {
    const groups = GetCombinations([...$map.keys()], $type);
    groups.forEach(group => {
      const candidates = group.map(el => $map.get(el));
      const union = new Set(candidates.reduce((p, c) => p.concat(c), []));
      if (union.size === $type) {
        // console.log('eliminate', union, group, $type);
        this.eliminate(union, group, $type);
      }
    });
  }
}
