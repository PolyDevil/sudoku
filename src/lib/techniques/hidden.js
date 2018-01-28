import { TUPLE } from '../consts'
import { AddToSetInMap, GetSubsetSizes, GetCombinations } from '../utils'
import { GetIds } from '../unit'
import { MIN_SUBSET_SIZE, MAX_SUBSET_SIZE, DEFAULT_SUBSET_SIZE } from '../consts'

export default class $Hidden {
  constructor(grid, unsolved) {
    this.grid = grid;
    this.unsolved = unsolved;

    this.rows = new Map();
    this.columns = new Map();
    this.blocks = new Map();
    this.name = 'Hidden';
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
    const { grid } = this;
    const groups = GetCombinations([...$map.keys()], $type);
    groups.forEach(group => {
      const candidates = group.map(el => $map.get(el));
      const cells = new Set(candidates.reduce((p, c) => p.concat(c), []));
      if (cells.size === $type) {
        const candidates = [...cells].map(e => grid[e].candidates).reduce((p, c) => {
          c.forEach(e => p.add(e));
          return p;
        }, new Set());
        if (candidates.size !== $type) {
          this.eliminate(cells, group, $type);
        }
      }
    });
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
      const candidates = [...grid[id].candidates].filter(e => !$values.includes(e));
      grid[id].eliminateCandidates(new Set(candidates), `${name} ${type}`);
    });
  }

}
