import $YWing from './y_wing'
import { ARRAY, DIMENSION, BLOCK, TUPLET, BASE } from '../consts'
import { GetXAxis, GetYAxis, GetBlockId } from '../unit'
import { AddToSetInMap, GetCombinations, AreSetsEqual, GetAxisTypesOfCells, GetIntersection } from '../utils'

export default class $XYZWing extends $YWing {
  constructor(grid, solved, unsolved) {
    super(grid, solved, unsolved);
    this.grid = grid;
    this.solved = solved;
    this.unsolved = unsolved;

    this.name = 'XYZ-Wing';
  }

  scan() {
    const { grid, unsolved } = this;

    const [axis] = [new Map()]; // Rows and Columns will provide the same result;
    ARRAY.forEach(row => {
      ARRAY.forEach(column => {
        const id = row * DIMENSION + column;
        if (unsolved.has(id)) {
          const { candidates = new Set() } = grid[id];
          if (candidates.size === 2 || candidates.size === 3) {
            AddToSetInMap(axis, row, id);
          }
        }
      });
    });

    axis.forEach((value, key, data) => {
      const { size } = value;
      if (size > 0) {
        if (size > 1) {
          const pairs = GetCombinations([...value], 2);
          pairs.forEach(pair => {
            const pairCandidates = pair.map(id => grid[id].candidates ? grid[id].candidates : []);
            if (!AreSetsEqual(pairCandidates[0], pairCandidates[1])) {
              data.forEach((v, k) => {
                if (k !== key) {
                  const { size: s } = v;
                  if (s > 0) {
                    const inunits = [...v];
                    inunits.forEach(inunit => {
                      const inunitCandidates = grid[inunit].candidates ? grid[inunit].candidates : [];
                      if (!pairCandidates.some(pairEl => AreSetsEqual(pairEl, inunitCandidates))) {
                        const union = new Set([
                          ...inunitCandidates,
                          ...pairCandidates.reduce((p, c) => p.concat([...c]), [])
                        ]);
                        if (union.size === 3) {
                          this.solve([...pair, inunit]);
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        }
      }
    });
  }

  solve($cells) {
    const wing = this.getWing($cells);
    if (wing) {
      const { grid, name, unsolved } = this;
      const { pivot } = wing;
      const { candidates } = grid[pivot];
      if (candidates && candidates.size === 3) {

        const { inBlock, inLine, pincers } = wing;
        const _inBlock = inBlock.filter(cell => cell !== pivot)[0];
        const _inLine = inLine.filter(cell => cell !== pivot)[0];

        const inBlockId = GetBlockId(_inBlock);
        const { type } = GetAxisTypesOfCells(inLine)[0];
        const { start } = BLOCK;

        const { cells } = (({
          row: () => {
            const inLineAxis = GetYAxis(_inLine);
            return {
              cells: [
                ...TUPLET.map(tuplet => start[inBlockId] + (DIMENSION * (inLineAxis % BASE)) + tuplet)
              ]
            };
          },
          column: () => {
            const inLineAxis = GetXAxis(_inLine);
            return {
              cells: [
                ...TUPLET.map(tuplet => start[inBlockId] + (DIMENSION * (inLineAxis % BASE)) + tuplet)
              ]
            };
          }
        })[type])();

        const keys = GetIntersection(grid[pincers[0]].candidates, grid[pincers[1]].candidates);
        if (keys.size === 1) {
          const technique = `${name}`;
          cells
            .filter(cell => cell !== pivot && unsolved.has(cell))
            .forEach(cell => {
              this.eliminate(cell, keys, technique);
            });
        }
      }
    }
  }

  eliminate($id, $values, $technique = '') {
    const { grid } = this;
    grid[$id].eliminateCandidates($values, $technique);
  }

}
