import { ARRAY, DIMENSION, BLOCK, TUPLET, BASE } from '../consts'
import { GetXAxis, GetYAxis, GetBlockId, GetIds } from '../unit'
import { GetAxisTypesOfCells, GetCombinations, AreCellsInOneLine, AreCellsInOneBlock, GetIntersection, AreCellsRightTriangle, GetAxis, AreSetsEqual } from '../utils'

export default class $XYZWing {
  constructor(grid, unsolved) {
    this.grid = grid;
    this.unsolved = unsolved;

    this.baseSizes = [3];
    this.wingSizes = [2];
    this.wingsCount = 2;

    this.name = 'XYZ-Wing';
  }

  scan() {
    const { baseSizes, wingSizes, wingsCount } = this;
    const { grid, unsolved } = this;
    const { start, mask } = BLOCK;

    const tuplets = new Set();
    unsolved.forEach(cell => {
      const { candidates } = grid[cell];
      if (baseSizes.some(size => candidates.size === size)) {
        tuplets.add(cell);
      }
    });
    [...tuplets].forEach(base => {
      const [row, column, block] = GetIds(base);
      const cells = [...new Set([
        ...ARRAY.map(cell => row * DIMENSION + cell),
        ...ARRAY.map(cell => cell * DIMENSION + column),
        ...mask.map(cell => start[block] + cell)
      ])].filter(cell => cell !== base);
      const f = cells.filter(cell => {
        const { candidates } = grid[cell];
        return wingSizes.some(size => candidates.size === size);
      });
      GetCombinations(f, wingsCount).forEach(wings => {
        const wingCells = [base, ...wings];
        if (!AreCellsInOneLine(wingCells) && !AreCellsInOneBlock(wingCells)) {
          const [setA, setB, setC] = [grid[wingCells[0]].candidates, grid[wingCells[1]].candidates, grid[wingCells[2]].candidates];
          if (!(AreSetsEqual(setA, setB) || AreSetsEqual(setB, setC) || AreSetsEqual(setA, setC))) {
            console.log('solve', wingCells);
            // this.solve({
            //   base,
            //   wings
            // });
          }
        }
      });
    });
  }

  solve($wing) {
    const { wingsCount } = this;
    const cellsCount = wingsCount + 1;

    const { base, wings } = $wing;
    const { grid, unsolved } = this;
    const cells = [base, ...wings];
    const union = cells.reduce((p, c) => new Set([...p, ...grid[c].candidates]), new Set());
    if (union.size === cellsCount) {
      const { candidates: baseCandidates } = grid[base];
      if (wings.every(wing => GetIntersection([baseCandidates, grid[wing].candidates]).size > 0)) {
        if (AreCellsRightTriangle(cells)) {
          const axes = wings.map(cell => GetAxis(cell));
          const diagonals = [axes[0][0] * DIMENSION + axes[1][1], axes[1][0] * DIMENSION + axes[0][1]];
          const base_reflection = diagonals.filter(cell => cell !== base)[0];
          if (unsolved.has(base_reflection)) {
            const keys = GetIntersection(wings.map(wing => grid[wing].candidates));
            const technique = `${this.name}`;
            this.eliminate(base_reflection, keys, technique);
          }
        } else {
          const inBlocks = wings.filter(cell => AreCellsInOneBlock([base, cell]));
          const inBlock = inBlocks[0];
          const inLines = wings.filter(cell => AreCellsInOneLine([base, cell]));
          const inLine = inLines[0];
          const line = [base, ...inLines];

          const cells = this.getCells(inBlock, inLine, line);

          const keys = GetIntersection(wings.map(wing => grid[wing].candidates));
          if (keys.size === 1) {
            const technique = `${this.name}`;
            cells
              .filter(cell => cell !== base && unsolved.has(cell))
              .forEach(cell => {
                this.eliminate(cell, keys, technique);
              });
          }
        }
      }
    }
  }

  eliminate($id, $values, $technique = '') {
    console.log('eliminate', $id, $values, $technique);
/*    const { grid } = this;
    grid[$id].eliminateCandidates($values, $technique);*/
  }

  getCells(inBlock, inLine, line) {
    const inBlockId = GetBlockId(inBlock);

    const { type } = GetAxisTypesOfCells(line)[0];
    const { start } = BLOCK;

    const { cells } = (({
      row: () => {
        const inLineAxis = GetYAxis(inLine);
        return {
          cells: [
            ...TUPLET.map(tuplet => start[inBlockId] + (DIMENSION * (inLineAxis % BASE)) + tuplet)
          ]
        };
      },
      column: () => {
        const inLineAxis = GetXAxis(inLine);
        return {
          cells: [
            ...TUPLET.map(tuplet => start[inBlockId] + DIMENSION * tuplet + inLineAxis % BASE)
          ]
        };
      }
    })[type])();
    return cells;
  }

}
