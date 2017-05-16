import $Wing from './wing'
import { DIMENSION, BLOCK, TUPLET, BASE } from '../consts'
import { GetAxis, GetXAxis, GetYAxis, GetBlockId } from '../unit'
import { GetAxisTypesOfCells, GetIntersection, AreCellsInOneLine, AreCellsInOneBlock, AreCellsRightTriangle } from '../utils'

export default class $YWing extends $Wing {
  constructor(grid, unsolved) {
    super(grid, unsolved);
    this.grid = grid;
    this.unsolved = unsolved;

    this.baseSizes = [2];
    this.wingSizes = [2];
    this.wingsCount = 2;

    this.name = 'Y-Wing';
  }

  scan() {
    const { baseSizes, wingSizes, wingsCount } = this;
    super.scan(baseSizes, wingSizes, wingsCount);
  }

  getCells(inBlock, inLine, line) {
    const inBlockId = GetBlockId(inBlock);
    const inLineId = GetBlockId(inLine);

    const { type } = GetAxisTypesOfCells(line)[0];
    const { start } = BLOCK;

    const { cells } = (({
      row: () => {
        const inBlockAxis = GetYAxis(inBlock);
        const inLineAxis = GetYAxis(inLine);
        return {
          cells: [
            ...TUPLET.map(tuplet => start[inBlockId] + (DIMENSION * (inLineAxis % BASE)) + tuplet),
            ...TUPLET.map(tuplet => start[inLineId] + (DIMENSION * (inBlockAxis % BASE)) + tuplet)
          ]
        };
      },
      column: () => {
        const inBlockAxis = GetXAxis(inBlock);
        const inLineAxis = GetXAxis(inLine);
        return {
          cells: [
            ...TUPLET.map(tuplet => start[inBlockId] + DIMENSION * tuplet + inLineAxis % BASE),
            ...TUPLET.map(tuplet => start[inLineId] + DIMENSION * tuplet + inBlockAxis % BASE)
          ]
        };
      }
    })[type])();
    return cells;
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

}
