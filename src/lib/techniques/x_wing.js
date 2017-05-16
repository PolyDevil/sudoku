import $Wing from './wing'
import { ARRAY, DIMENSION, WING_SIZE } from '../consts'
import { GetXAxis, GetYAxis } from '../unit'
import { AddToSetInMap, AreCellsRectangle } from '../utils'

export default class $XWing extends $Wing {
  constructor(grid, unsolved) {
    super(grid, unsolved);
    this.grid = grid;
    this.unsolved = unsolved;

    this.name = 'X-Wing';
  }

  scanRows() {
    const { grid, unsolved } = this;

    const pairs = new Map();
    ARRAY.forEach(row => {
      const values = new Map();
      ARRAY.forEach(column => {
        const id = row * DIMENSION + column;
        if (unsolved.has(id)) {
          const { candidates } = grid[id];
          candidates.forEach(candidate => {
            AddToSetInMap(values, candidate, id);
          });
        }
      });
      values.forEach((value, key) => {
        const { size } = value;
        if (size === WING_SIZE) {
          AddToSetInMap(pairs, key, value);
        }
      });
    });
    pairs.forEach((value, key) => {
      const { size } = value;
      if (size >= WING_SIZE) {
        for (let i = 0; i < size - 1; i++) {
          const a = [...[...value][i]];
          for (let j = i + 1; j < size; j++) {
            const b = [...[...value][j]];
            const cells = [...a, ...b];
            if (AreCellsRectangle(cells)) {
              this.solve('row', key, cells);
            }
          }
        }
      }
    });
  }

  scanColumns() {
    const { grid, unsolved } = this;

    const pairs = new Map();
    ARRAY.forEach(column => {
      const values = new Map();
      ARRAY.forEach(row => {
        const id = row * DIMENSION + column;
        if (unsolved.has(id)) {
          const { candidates } = grid[id];
          candidates.forEach(candidate => {
            AddToSetInMap(values, candidate, id);
          });
        }
      });
      values.forEach((value, key) => {
        const { size } = value;
        if (size === WING_SIZE) {
          AddToSetInMap(pairs, key, value);
        }
      });
    });
    pairs.forEach((value, key) => {
      const { size } = value;
      if (size >= WING_SIZE) {
        for (let i = 0; i < size - 1; i++) {
          const a = [...[...value][i]];
          for (let j = i + 1; j < size; j++) {
            const b = [...[...value][j]];
            const cells = [...a, ...b];
            if (AreCellsRectangle(cells)) {
              this.solve('column', key, cells);
            }
          }
        }
      }
    });
  }

  scan() {
    this.scanRows();
    this.scanColumns();
  }

  solve($type, $key, $cells) {
    const { unsolved, name } = this;
    const { cells } = (({
      row: () => {
        const lines = new Set($cells.map(cell => GetYAxis(cell)));
        return {
          cells: [...lines].map(line => ARRAY.map(unit => DIMENSION * line + unit))
        };
      },
      column: () => {
        const lines = new Set($cells.map(cell => GetXAxis(cell)));
        return {
          cells: [...lines].map(line => ARRAY.map(unit => DIMENSION * unit + line))
        };
      }
    })[$type])();

    const technique = `${name}(${$key}) in ${$type}: [${$cells}]`;
    cells
      .reduce((p, c) => p.concat([...c]), [])
      .filter(cell => !$cells.includes(cell) && unsolved.has(cell))
      .forEach(cell => {
        this.eliminate(cell, new Set([$key]), technique);
      });
  }

}
