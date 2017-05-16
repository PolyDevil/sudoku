import React, { Component } from 'react';
import SudokuEngine from './lib/sudoku';
import { DIMENSION } from './lib/consts'

import './App.css';

const DEBUG = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: new Array(DIMENSION).fill(0)
    }
  }

  componentDidMount() {
    const sudoku = new SudokuEngine();
    const grid = sudoku.getGrid();
    this.setState({
      sudoku,
      grid,
    });
  }

  searchWXYZWing() {
    const { sudoku } = this.state;
    sudoku.$wxyzWing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
    });
  }

  searchXYZWing() {
    const { sudoku } = this.state;
    sudoku.$xyzWing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
    });
  }

  searchYWing() {
    const { sudoku } = this.state;
    sudoku.$yWing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
    });
  }

  searchNakedSingles() {
    const { sudoku } = this.state;
    sudoku.$naked.scan(2);
    const grid = sudoku.getGrid();
    this.setState({
      grid,
    });
  }

  searchHiddenSubsets() {
    const { sudoku } = this.state;
    sudoku.$hidden.scan(4);
    const grid = sudoku.getGrid();
    this.setState({
      grid,
    });
  }

  searchNakedSubsets() {
    const { sudoku } = this.state;
    sudoku.$naked.scan(4);
    const grid = sudoku.getGrid();
    this.setState({
      grid,
    });
  }

  searchXWing() {
    const { sudoku } = this.state;
    sudoku.$xWing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
    });
  }

  searchPointingSubsets() {
    const { sudoku } = this.state;
    sudoku.$pointing.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
    });
  }

  searchBoxLineReduction() {
    const { sudoku } = this.state;
    sudoku.$boxLineReduction.scan();
    const grid = sudoku.getGrid();
    this.setState({
      grid,
    });
  }

  isGridValid() {
    const { sudoku } = this.state;
    const isValid = sudoku.isGridValid();
    console.log('validation...', isValid && isValid.reduce((pre, cur, ind) => ['row', 'column', 'block'].reduce((p, c, i) => cur[i] === true ? p : `${c}:${i}`, cur[0]), true));
  }

  classHelper(isGiven, isSolved, hasCandidates) {
    const a = isGiven ? `sudoku__cell____isGiven` : ``;
    const b = isSolved ? `sudoku__cell____isSolved` : ``;
    const c = hasCandidates ? `sudoku__cell____unSolved` : ``;
    return `${a} | ${b} | ${c}`;
  }

  render() {
    const { grid } = this.state;
    return (
      <div className="sudoku">
        <div className="sudoku_box">
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
                  onClick={() => this.searchNakedSubsets()}
                >
                  Naked Subsets
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchNakedSingles()}
                >
                  Naked Singles
                </button>
              </li>
              <li className="sudoku__nav_listItem">
                <button
                  className="sudoku__button"
                  onClick={() => this.searchHiddenSubsets()}
                >
                  Hidden Subsets
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
                  onClick={() => this.isGridValid()}
                >
                  isGridValid
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
