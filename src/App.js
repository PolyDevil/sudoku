import React, { Component } from 'react';
import SudokuEngine from './lib/sudoku';
import { DIMENSION } from './lib/consts';
import { maps } from './lib/maps';

import './App.css';

const DEBUG = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: new Array(DIMENSION).fill(0),
      isValid: false,
    }
  }

  componentWillMount() {
    console.log('componentWillMount');

    const validMaps = [];
    for (let i = 0; i < maps.length - 1; i++) {
      const sudoku = new SudokuEngine(maps[i]);
      let unsolved = sudoku.unsolved.size;
      for (let j = 0; j < 10; j++) {
        // sudoku.$wxyzWing.scan();
        // sudoku.$xyzWing.scan(); // safe
        sudoku.$yWing.scan(); // safe
        sudoku.$naked.scan(2);
        sudoku.$hidden.scan(4);
        sudoku.$xWing.scan(); // safe
        sudoku.$pointing.scan(); // safe
        sudoku.$boxLineReduction.scan(); // safe
      }

      validMaps.push({
        id: i,
        valid: sudoku.isGridValid(),
        solved: unsolved - sudoku.unsolved.size
      });
    }

    console.groupCollapsed('Test tesults');
    console.log('valid: ', validMaps.filter(e => e.valid && e.solved > 0));
    console.log('valid & not solved: ', validMaps.filter(e => e.valid && e.solved === 0));
    console.log('invalid: ', validMaps.filter(e => !e.valid));
    console.groupEnd();

    const sudoku = new SudokuEngine([
  0,
  7,
  2,
  0,
  0,
  0,
  6,
  8,
  0,
  0,
  0,
  0,
  7,
  0,
  0,
  0,
  0,
  0,
  5,
  0,
  0,
  0,
  1,
  6,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  8,
  1,
  0,
  0,
  2,
  0,
  0,
  3,
  7,
  1,
  0,
  0,
  6,
  0,
  0,
  4,
  5,
  6,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  3,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  7,
  0,
  0,
  0,
  0,
  1,
  5,
  0,
  0,
  0,
  8,
  9,
  0
]);
    const grid = sudoku.getGrid();

    sudoku.$pointing.scan();
    sudoku.$boxLineReduction.scan();

    sudoku.$naked.scan(2);
    sudoku.$naked.scan(4);
    sudoku.$hidden.scan(1);
    sudoku.$hidden.scan(2);
    sudoku.$hidden.scan(3);
    // sudoku.$hidden.scan(4);

    this.setState({
      sudoku,
      grid,
    });
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.setState({
      isValid: this.isGridValid(),
    });
  }

  searchWXYZWing() {
    const { sudoku } = this.state;
    sudoku.$wxyzWing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
      isValid: this.isGridValid(),
    });
  }

  searchXYZWing() {
    const { sudoku } = this.state;
    sudoku.$xyzWing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
      isValid: this.isGridValid(),
    });
  }

  searchYWing() {
    const { sudoku } = this.state;
    sudoku.$yWing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
      isValid: this.isGridValid(),
    });
  }

  searchHiddenSubsets(id) {
    const { sudoku } = this.state;
    sudoku.$hidden.scan(id);
    const grid = sudoku.getGrid();
    this.setState({
      grid,
      isValid: this.isGridValid(),
    });
  }

  searchNakedSubsets(id) {
    const { sudoku } = this.state;
    sudoku.$naked.scan(id);
    const grid = sudoku.getGrid();
    this.setState({
      grid,
      isValid: this.isGridValid(),
    });
  }

  searchXWing() {
    const { sudoku } = this.state;
    sudoku.$xWing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
      isValid: this.isGridValid(),
    });
  }

  searchPointingSubsets() {
    const { sudoku } = this.state;
    sudoku.$pointing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
      isValid: this.isGridValid(),
    });
  }

  searchBoxLineReduction() {
    const { sudoku } = this.state;
    sudoku.$boxLineReduction.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
      isValid: this.isGridValid(),
    });
  }

  isGridValid() {
    const { sudoku } = this.state;
    return sudoku.isGridValid();
  }

  classHelper(isGiven, isSolved, hasCandidates) {
    const a = isGiven ? `sudoku__cell____isGiven` : ``;
    const b = isSolved ? `sudoku__cell____isSolved` : ``;
    const c = hasCandidates ? `sudoku__cell____unSolved` : ``;
    return `${a} | ${b} | ${c}`;
  }

  render() {
    const { grid, isValid } = this.state;
    return (
      <div className="sudoku">
        <div className="sudoku_box">
          <div className={`sudoku__status ${isValid ? '--valid' : ''}`} />
          <div className="sudoku__grid">
            {grid.map((cell, id) => {
              const { value, isGiven, isSolved, candidates = new Set() } = cell;
              const hasCandidates = !(isGiven || isSolved);
              return (
                <span
                  key={id}
                  className={`sudoku__cell ${this.classHelper(isGiven, isSolved, hasCandidates)}`}
                >
                  {DEBUG && <var>{id}</var>}{hasCandidates ? [...candidates.values()] : value}</span>
              );
            })}
          </div>
        </div>
        <nav className="sudoku__nav">
          <div className="sudoku__block">
            <h2 className="sudoku__title">Solve:</h2>
            <ul className="sudoku__nav_list">
              <h4 className="sudoku__subtitle">Techniques:</h4>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchWXYZWing()}
                >
                  WXYZ-Wing
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchXYZWing()}
                >
                  XYZ-Wing
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchXWing()}
                >
                  X-Wing
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchYWing()}
                >
                  Y-Wing
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchPointingSubsets()}
                >
                  Pointing Subsets
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchBoxLineReduction()}
                >
                  Box / Line Reduction
                </button>
              </li>
            </ul>
            <ul className="sudoku__nav_list">
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchNakedSubsets(1)}
                >
                  Naked 1
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchNakedSubsets(2)}
                >
                  Naked 2
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchNakedSubsets(3)}
                >
                  Naked 3
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchNakedSubsets(4)}
                >
                  Naked 4
                </button>
              </li>
            </ul>
            <ul className="sudoku__nav_list">
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchHiddenSubsets(1)}
                >
                  Hidden 1
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchHiddenSubsets(2)}
                >
                  Hidden 2
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchHiddenSubsets(3)}
                >
                  Hidden 3
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchHiddenSubsets(4)}
                >
                  Hidden 4
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default App;
