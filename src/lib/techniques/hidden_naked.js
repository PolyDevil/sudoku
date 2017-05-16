import { MIN_SUBSET_SIZE, MAX_SUBSET_SIZE, DEFAULT_SUBSET_SIZE } from '../consts'
import { GetIds } from '../unit'
import { AddToSetInMap, GetCombinations } from '../utils'

export default class $NakedHidden {
  constructor(grid, unsolved) {
    this.grid = grid;
    this.unsolved = unsolved;

    this.rows = new Map();
    this.columns = new Map();
    this.blocks = new Map();
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
        this.eliminate(union, group, $type);
      }
    });
  }

}
