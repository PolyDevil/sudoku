export const BASE = 3;
export const DIMENSION = BASE * BASE;

export const ARRAY = new Array(DIMENSION).fill(0).map((el, index) => index); // [0, 1, 2, 3, 4, 5, 6, 7, 8]
export const GRID = ARRAY.map(el => el + 1); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const TUPLET = new Array(BASE).fill(0).map((el, index) => index); // [0, 1, 2]

export const BLOCK = {
  start: ARRAY.map(id => (Math.floor(id / BASE) * DIMENSION + id % BASE) * BASE), // [0, 3, 6, 27, 30, 33, 54, 57, 60]
  mask: ARRAY.map(id => (id % BASE) + Math.floor(id / BASE) * DIMENSION) // [0, 1, 2, 9, 10, 11, 18, 19, 20]
};

export const MIN_SUBSET_SIZE = 1;
export const DEFAULT_SUBSET_SIZE = MIN_SUBSET_SIZE;
export const MAX_SUBSET_SIZE = Math.floor(DIMENSION / 2);

export const WING_SIZE = 2;

export const TUPLE = new Map(
  [
    [1, 'Single'],
    [2, 'Double'],
    [3, 'Triple'],
    [4, 'Quadruple'],
    [5, 'Quintuple'],
    [6, 'Sextuple'],
    [7, 'Septuple'],
    [8, 'Octuple'],
    [9, 'Nonuple'],
    [10, 'Decuple'],
    [11, 'Undecuple'],
    [12, 'Duodecuple'],
    [13, 'Tredecuple']
  ]
);