import $YWing from './y_wing'
import { DIMENSION, BLOCK, TUPLET, BASE } from '../consts'
import { GetXAxis, GetYAxis, GetBlockId } from '../unit'
import { GetAxisTypesOfCells } from '../utils'

export default class $XYZWing extends $YWing {
  constructor(grid, unsolved) {
    super(grid, unsolved);
    this.grid = grid;
    this.unsolved = unsolved;

    this.baseSizes = [3];
    this.wingSizes = [2];
    this.wingsCount = 2;

    this.name = 'XYZ-Wing';
  }

  scan() {
    const { baseSizes, wingSizes, wingsCount } = this;
    super.scan(baseSizes, wingSizes, wingsCount);
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
