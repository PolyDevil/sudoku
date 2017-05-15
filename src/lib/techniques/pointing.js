import { BASE, DIMENSION, ARRAY, TUPLET, BLOCK } from '../consts'
import { AddToSetInMap, GetAxisTypesOfCells } from '../utils'

export default class $Pointing {
  constructor(grid, unsolved) {
    this.grid = grid;
    this.unsolved = unsolved;

    this.name = 'Pointing';
  }

  scan() {
    const { grid, unsolved } = this;
    const { start } = BLOCK;
    const base = BASE + 1;
    const { name } = this;

    ARRAY.forEach(block => {
      const values = new Map();
      TUPLET.forEach(row => {
        TUPLET.forEach(column => {
          const id = start[block] + row * DIMENSION + column;
          if (unsolved.has(id)) {
            const { candidates } = grid[id];
            candidates.forEach(candidate => {
              AddToSetInMap(values, candidate, id);
            });
          }
        });
      });

      values.forEach((value, key) => {
        const { size } = value;
        if (size < base) {
          const types = GetAxisTypesOfCells([...value]);
          types.forEach(el => {
            const { type, id } = el;
            this.solve(id, type, [...value], key, `${name}:${type}`);
          });
        }
      });
    });
  }

  solve($id, $type, $cells, $key, $technique = '') {
    const { unsolved } = this;
    const { cells } = (({
      row: () => {
        return {
          cells: ARRAY.map(axis => DIMENSION * $id + axis)
        };
      },
      column: () => {
        return {
          cells: ARRAY.map(axis => axis * DIMENSION + $id)
        };
      }
    })[$type])();

    cells
      .filter(cell => !$cells.includes(cell) && unsolved.has(cell))
      .forEach(cell => {
        this.eliminate(cell, new Set([$key]), $technique);
    })
  }

  eliminate($id, $values, $technique = '') {
    const { grid } = this;
    grid[$id].eliminateCandidates($values, $technique);
  }

}
