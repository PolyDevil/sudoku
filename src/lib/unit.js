import { BASE, DIMENSION } from './consts'

export const GetXAxis = ($id) => {
  return $id % DIMENSION;
}

export const GetYAxis = ($id) => {
  return Math.floor($id / DIMENSION);
}

export const GetAxis = ($id) => {
  return [GetYAxis($id), GetXAxis($id)];
}

export const GetBlockId = ($id) => {
  const [row, column] = GetAxis($id);
  return Math.floor(row / BASE) * BASE + Math.floor(column / BASE);
}

export const GetIds = ($id) => {
  const [row, column] = GetAxis($id);
  const block = GetBlockId($id);
  return [row, column, block];
}

