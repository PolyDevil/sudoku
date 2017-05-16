import Cell from './cell'
import { DIMENSION, GRID, ARRAY, BLOCK } from './consts'
import { GetIds } from './unit'
import $Naked from './techniques/naked'
import $Hidden from './techniques/hidden'
import $Pointing from './techniques/pointing'
import $BoxLineReduction from './techniques/box_line_reduction'
import $XWing from './techniques/x_wing'
import $YWing from './techniques/y_wing'
import $XYZWing from './techniques/xyz_wing'
import $WXYZWing from './techniques/wxyz_wing'

export default class Sudoku {
  constructor($data = [
    6, 9, 0, 2, 0, 0, 0, 4, 1,
    2, 0, 4, 1, 6, 0, 5, 9, 0,
    1, 5, 0, 8, 4, 9, 6, 2, 0,
    0, 0, 5, 0, 0, 6, 1, 0, 0,
    0, 6, 0, 3, 1, 4, 0, 5, 0,
    0, 1, 0, 5, 0, 0, 9, 6, 0,
    0, 4, 0, 6, 0, 8, 2, 1, 5,
    0, 0, 1, 0, 0, 0, 4, 0, 6,
    5, 2, 6, 4, 0, 1, 0, 8, 9
  ]) {
    this.grid = [];

    this.givens = new Set();
    this.nonGivens = [];

    this.solved = new Set();
    this.unsolved = new Set();

    this.steps = new Map();
    this.setGrid($data);

    this.$naked = new $Naked(this.grid, this.unsolved);
    this.$hidden = new $Hidden(this.grid, this.unsolved);
    this.$pointing = new $Pointing(this.grid, this.unsolved);
    this.$boxLineReduction = new $BoxLineReduction(this.grid, this.unsolved);
    this.$xWing = new $XWing(this.grid, this.unsolved);
    this.$yWing = new $YWing(this.grid, this.unsolved);
    this.$xyzWing = new $XYZWing(this.grid, this.unsolved);
    this.$wxyzWing = new $WXYZWing(this.grid, this.unsolved);

    this.initCandidates();
    console.log('valid: ', this.isGridValid());
    // this.solve();
  }

  solve() {
    this.$naked.scan(4);
    this.$hidden.scan(4);
    this.$pointing.scan();
    this.$boxLineReduction.scan();
    this.$xWing.scan();
    this.$yWing.scan();
    this.$xyzWing.scan();
    this.$wxyzWing.scan();
  }

  setGrid($data) {
    const { givens, nonGivens, unsolved } = this;
    this.grid = $data.map((value, id) => {
      const cell = new Cell(id, this.cellOnSolved, value);
      if (value > 0) {
        givens.add(cell);
      } else {
        nonGivens.push(cell);
        unsolved.add(id);
      }
      return cell;
    });
  }

  getGrid() {
    return this.grid;
  }

  isGridValid() {
    const { grid, unsolved } = this;
    if (unsolved.size === 0) {
      const { start, mask } = BLOCK;
      return ARRAY.map(unit => {
        return [
          new Set(ARRAY.map(row => grid[unit * DIMENSION + row].value)),
          new Set(ARRAY.map(column => grid[column * DIMENSION + unit].value)),
          new Set(ARRAY.map(block => grid[start[unit] + mask[block]].value))
        ].map(type => {
          return type.size === DIMENSION ? true : unit;
        });
      });
    }
    return false;
  }

  initCandidates() {
    const { givens, nonGivens } = this;
    const [rows, columns, blocks] = [
      new Array(DIMENSION).fill(0).map(() => new Set()),
      new Array(DIMENSION).fill(0).map(() => new Set()),
      new Array(DIMENSION).fill(0).map(() => new Set())
    ];

    givens.forEach(cell => {
      const { id, value } = cell;
      const [row, column, block] = GetIds(id);
      rows[row].add(value);
      columns[column].add(value);
      blocks[block].add(value);
    });

    // Set candidates for each nonGiven
    nonGivens.forEach(cell => {
      const { id } = cell;
      const [row, column, block] = GetIds(id);
      const union = new Set([...rows[row], ...columns[column], ...blocks[block]]);
      cell.setCandidates(new Set(GRID.filter(el => !union.has(el))));
    });
  }

  // Cell onSolve callback - to eliminate solved value from units (row | column | block)
  cellOnSolved = ($id, $value, $technique = '') => {
    const placeholder = $technique.length > 0 ? 'as ' : '';
    console.log(
      `%c Solved:%c ${$id < 10 ? '0' : ''}${$id} =>%c ${$value}%c ${placeholder} ${$technique}`,
      `color: #7ac74f; font-size: 1rem;`,
      `color: #d5d887; font-size: 1rem;`,
      `color: #e87461; font-size: 1rem;`,
      `color: #4fa0c7; font-size: 1rem;`
    );
    const { grid, solved, unsolved } = this;
    unsolved.delete($id);
    solved.add($id);
    const [row, column, block] = GetIds($id);
    const { mask, start } = BLOCK;
    const blockBase = start[block];
    ARRAY.forEach(unit => {
      [
        row * DIMENSION + unit,
        unit * DIMENSION + column,
        blockBase + mask[unit]
      ].forEach(cell => {
        if (unsolved.has(cell)) {
          grid[cell].eliminateCandidates(new Set([$value]), `Solved cell ${$id}`);
        }
      });
    });
  }
}
