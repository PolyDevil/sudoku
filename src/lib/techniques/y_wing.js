import { BASE, DIMENSION, ARRAY, BLOCK, TUPLET } from '../consts'
import { GetAxis, GetXAxis, GetYAxis, GetBlockId } from '../unit'
import { AddToSetInMap, GetCombinations, AreSetsEqual, AreCellsInOneBlock, AreCellsRightTriangle, GetAxisTypesOfCells, GetIntersection } from '../utils'

export default class $YWing {
  constructor(grid, solved, unsolved) {
    this.grid = grid;
    this.solved = solved;
    this.unsolved = unsolved;

    this.name = 'Y-Wing';
  }

  scan() {
    const { grid, unsolved } = this;

    const [rows, columns] = [new Map(), new Map()];
    ARRAY.forEach(row => {
      ARRAY.forEach(column => {
        const id = row * DIMENSION + column;
        if (unsolved.has(id)) {
          const { candidates } = grid[id];
          if (candidates.size === 2) {
            AddToSetInMap(rows, row, id);
            AddToSetInMap(columns, column, id);
          }
        }
      });
    });
    [rows, columns].forEach(unit => {
      unit.forEach((value, key, data) => {
        const { size } = value;
        if (size > 1) {
          const pairs = GetCombinations([...value], 2);
          pairs.forEach(pair => {
            const pairCandidates = pair.map(id => grid[id].candidates);
            if (!AreSetsEqual(pairCandidates[0], pairCandidates[1])) {
              data.forEach((v, k) => {
                if (k !== key) {
                  const { size: s } = v;
                  if (s > 0) {
                    const inunits = [...v];
                    inunits.forEach(inunit => {
                      const inunitCandidates = grid[inunit].candidates;
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
      });
    });
  }

  getLines($cells) {
    const { length } = $cells;
    const [rows, columns] = [new Map(), new Map()];

    $cells.forEach(id => {
      const [row, column] = GetAxis(id);
      AddToSetInMap(rows, row, id);
      AddToSetInMap(columns, column, id);
    });

    const lines = [];
    if (rows.size < length) {
      rows.forEach(e => lines.push([...e]));
    }
    if (columns.size < length) {
      columns.forEach(e => lines.push([...e]));
    }
    return lines.sort((x, y) => y.length - x.length);
  }

  getWing($cells) {
    const lines = this.getLines($cells);
    let _data = false;
    const setData = (data) => {
      _data = data;
    }
    const inLine = lines[0];
    if (AreCellsInOneBlock(inLine)) {
      const inBlock = inLine;
      const pivot = $cells.filter(cell => inBlock.includes(cell))[0];
      setData({
        inLine,
        inBlock,
        pivot,
        pincers: $cells.filter(cell => cell !== pivot)
      })
    }
    for (let l = 1; l < lines.length; l++) {
      lines[l].forEach(line => {
        inLine.forEach(cellInLine => {
          const inBlock = [cellInLine, line];
          if (AreCellsInOneBlock(inBlock)) {
            const pivot = inLine.filter(cell => inBlock.includes(cell))[0];
            setData({
              inLine,
              inBlock,
              pivot,
              pincers: $cells.filter(cell => cell !== pivot)
            })
          }
        });
      });
    }
    return _data;
  }

  solve($cells) {
    const wing = this.getWing($cells);
    if (wing) {
      const { name } = this;
      const { pivot } = wing;
      if (AreCellsRightTriangle($cells)) {
        const corners = $cells.filter(cell => cell !== pivot);
        const cells = corners.map(cell => GetAxis(cell));
        const anticorners = [cells[0][0] * DIMENSION + cells[1][1], cells[1][0] * DIMENSION + cells[0][1]];
        const anticorner = anticorners.filter(cell => cell !== pivot);

        this.eliminate([corners[0], corners[1]], anticorner, `${name} triangle`);
      } else {
        const { inBlock, inLine, pincers } = wing;
        const _inBlock = inBlock.filter(cell => cell !== pivot)[0];
        const _inLine = inLine.filter(cell => cell !== pivot)[0];

        const inBlockId = GetBlockId(_inBlock);
        const inLineId = GetBlockId(_inLine);

        const { type } = GetAxisTypesOfCells(inLine)[0];
        const { start } = BLOCK;
        const { cells } = (({
          row: () => {
            const inBlockAxis = GetYAxis(_inBlock);
            const inLineAxis = GetYAxis(_inLine);
            return {
              cells: [
                ...TUPLET.map(tuplet => start[inBlockId] + (DIMENSION * (inLineAxis % BASE)) + tuplet),
                ...TUPLET.map(tuplet => start[inLineId] + (DIMENSION * (inBlockAxis % BASE)) + tuplet)
              ]
            };
          },
          column: () => {
            const inBlockAxis = GetXAxis(_inBlock);
            const inLineAxis = GetXAxis(_inLine);
            return {
              cells: [
                ...TUPLET.map(tuplet => start[inLineId] + (DIMENSION * (inBlockAxis % BASE)) + tuplet),
                ...TUPLET.map(tuplet => start[inBlockId] + (DIMENSION * (inLineAxis % BASE)) + tuplet)
              ]
            };
          }
        })[type])();

        this.eliminate(pincers, cells.filter(cell => cell !== pivot), `${name}`);
      }
    }
  }

  eliminate($pincers, $cells, $technique = '') {
    const { grid } = this;
    if ($cells.length > 0) {
      const keys = GetIntersection(grid[$pincers[0]].candidates, grid[$pincers[1]].candidates);
      if (keys.size === 1) {
        $cells.forEach(cell => {
          grid[cell].eliminateCandidates(keys, $technique);
        });
      }
    }
  }

}
