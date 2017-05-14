import { DIMENSION, MIN_SUBSET_SIZE } from './consts'
import { GetAxis, GetBlockId, GetIds } from './unit'

export const Random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const GenerateUnit = () => {
  let rand = Random(1, DIMENSION);
  const set = new Set();
  while (set.size < DIMENSION) {
    if (set.has(rand)) {
      rand = Random(1, DIMENSION);
    } else {
      set.add(rand);
    }
  }
  return [...set];
}

export const AreCellsInOneBlock = ($cells) => {
  const cells = $cells.map(el => GetBlockId(el));
  const block = cells[0];
  return cells.every(el => el === block);
}

export const GetAxisTypesOfCells = ($cells) => {
  const cells = $cells.map(el => GetAxis(el));
  const q = cells.reduce((p, c) => {
    return c.map((e, i) => e === p[i] ? e : false);
  }, cells[0]);
  return ['row', 'column'].map((el, i) => {
    return Number.isInteger(q[i]) ? {
      type: el,
      id: q[i]
    } : null;
  }).filter(el => el);
}

export const GetTypeOfCells = ($cells) => {
  const cells = $cells.map(el => GetIds(el));
  const q = cells.reduce((p, c) => {
    return c.map((e, i) => e === p[i] ? e : false);
  }, cells[0]);
  return ['row', 'column', 'block'].map((el, i) => {
    return Number.isInteger(q[i]) ? {
      type: el,
      id: q[i]
    } : null;
  }).filter(el => el);
}

export const AddToSetInMap = ($map, $key, $value) => {
  if ($map.has($key)) {
    const set = $map.get($key);
    set.add($value);
  } else {
    $map.set($key, new Set([$value]));
  }
}

export const GetFirstValue = ($set) => {
  return $set.values().next().value;
}

export const GetCombinations = ($set, k = 0) => {
  const size = $set.length;
  let combinations = [];
  if (k < 1 || k > size) {
    combinations = [];
  } else if (k === size) {
    combinations = [$set];
  } else if (k === 1) {
    combinations = $set.map(el => [el]);
  } else {
    for (let i = 0; i < size - k + 1; i++) {
      const head = $set.slice(i, i + 1);
      const tailcombs = GetCombinations($set.slice(i + 1), k - 1);
      tailcombs.forEach(tail => combinations.push(head.concat(tail)));
    }
  }
  return combinations;
}

export const GetAllPossibleCombinations = ($set) => {
  return $set.reduce((p, c, i) => {
    return p.concat(GetCombinations($set, i + 1).reduce((_p, _c) => [..._p, _c], []));
  }, []);
}

export const GetSubsetSizes = ($maxSubsetSize) => {
  return [$maxSubsetSize + 1, new Array($maxSubsetSize - 1).fill(0).map((el, index) => index + MIN_SUBSET_SIZE)];
}

export const AreSetsEqual = ($as, $bs) => {
  return $as.size !== $bs.size ? false : [...$as].every(el => $bs.has(el));
}

export const AreCellsRectangle = ($cells) => {
  if ($cells.length === 4) {
    const cells = $cells.map(cell => {
      const [row, column] = GetAxis(cell);
      return {
        x: column,
        y: row
      };
    });
    const cx = (cells[0].x + cells[1].x + cells[2].x + cells[3].x) / 4;
    const cy = (cells[0].y + cells[1].y + cells[2].y + cells[3].y) / 4;
    const dd1 = Math.pow(cx - cells[0].x, 2) + Math.pow(cy - cells[0].y, 2);
    const dd2 = Math.pow(cx - cells[1].x, 2) + Math.pow(cy - cells[1].y, 2);
    if (dd1 === dd2) {
      const dd3 = Math.pow(cx - cells[2].x, 2) + Math.pow(cy - cells[2].y, 2);
      if (dd1 === dd3) {
        const dd4 = Math.pow(cx - cells[3].x, 2) + Math.pow(cy - cells[3].y, 2);
        return dd1 === dd4;
      }
    }
    return false;
  }
  return false;
}

export const AreCellsRightTriangle = ($cells) => {
  if ($cells.length === 3) {
    const [x, y] = [new Set(), new Set()];
    $cells.forEach(cell => {
      const [row, column] = GetAxis(cell);
      x.add(column);
      y.add(row);
    });
    const { size } = x;
    return size === y.size && size === 2;
  }
  return false;
}

export const GetIntersection = ($setA, $setB) => {
  if ($setA && $setB) {
    return new Set([...$setA].filter(el => $setB.has(el)));
  } else {
    return new Set();
  }
}

export const GetBlockFromCellsTriplet = ($cells) => {
  const cells = $cells.map(el => GetBlockId(el));
  if (cells[0] === cells[1]) {
    return [$cells[0], $cells[1]];
  } else if (cells[0] === cells[2]) {
    return [$cells[0], $cells[2]];
  } else if(cells[1] === cells[2]) {
    return [$cells[1], $cells[2]];
  } else {
    return false;
  }
}