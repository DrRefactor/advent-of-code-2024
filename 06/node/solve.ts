import { readFileSync } from "fs";

const file = readFileSync(process.argv[2]).toString();
const GUARD = "^";
const WALL = "#";

type Coordinates = [number, number];
type Matrix = string[][];

function parse(file: string) {
  const invertedMartix: Matrix = file
    .split("\n")
    .filter((line) => !!line)
    .map((line) => line.split(""));

  const matrix = invertedMartix[0].reduce((r, _, columnIndex) => {
    r[columnIndex] = invertedMartix.reduce((r, row) => {
      r.push(row[columnIndex]);
      return r;
    }, [] as string[]);
    return r;
  }, [] as string[][]);

  return { matrix, invertedMartix };
}

function findGuard(matrix: Matrix): Coordinates {
  for (let columnIndex = 0; columnIndex < matrix.length; columnIndex++) {
    const column = matrix[columnIndex];
    for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
      const char = column[rowIndex];
      if (char === GUARD) {
        return [columnIndex, rowIndex];
      }
    }
  }
  throw "no guard, no problem";
}

const TraverseDirection = {
  RightDirection: [1, 0],
  LeftDirection: [-1, 0],
  UpDirection: [0, -1],
  DownDirection: [0, 1],
} as const;
type TraverseDirection =
  (typeof TraverseDirection)[keyof typeof TraverseDirection];

const directionOrder = [
  TraverseDirection.UpDirection,
  TraverseDirection.RightDirection,
  TraverseDirection.DownDirection,
  TraverseDirection.LeftDirection,
];
const nextDirection = directionOrder.reduce((r, direction, i) => {
  r.set(direction, directionOrder[(i + 1) % directionOrder.length]);
  return r;
}, new Map<TraverseDirection, TraverseDirection>());

function traverseInDirection(
  guard: Coordinates,
  matrix: Matrix,
  direction: TraverseDirection
): { path: Coordinates[]; endPosition: Coordinates | undefined } {
  const [startX, startY] = guard;
  const [deltaX, deltaY] = direction;

  const path: Coordinates[] = [];
  let currentX = startX;
  let currentY = startY;
  let char: string | undefined = matrix[currentX][currentY];
  while (char != null) {
    path.push([currentX, currentY]);
    const nextX = currentX + deltaX;
    const nextY = currentY + deltaY;
    const nextChar = matrix[nextX]?.[nextY];
    if (nextChar === WALL) {
      return { path, endPosition: [currentX, currentY] };
    }
    char = nextChar;
    currentX = nextX;
    currentY = nextY;
  }
  return { path, endPosition: undefined };
}

function traverse(guard: Coordinates, matrix: Matrix): Coordinates[] {
  let direction: TraverseDirection = TraverseDirection.UpDirection;
  let currentPosition = guard;
  let wholePath: Coordinates[] = [];
  while (currentPosition) {
    const { path, endPosition } = traverseInDirection(
      currentPosition,
      matrix,
      direction
    );
    wholePath.push(...path);
    currentPosition = endPosition;
    direction = nextDirection.get(direction);
  }
  return wholePath;
}

function draw(path: Coordinates[], invertedMatrix: Matrix) {
  const matrixCopy = invertedMatrix.map((row) => [...row]);
  path.slice(1).forEach(([x, y]) => {
    matrixCopy[y][x] = "X";
  });
  const log = matrixCopy.map((row) => row.join("")).join("\n");
  console.log(log);
}

class HashSet<T> {
  private set = new Set<string>();
  constructor(private hash: (value: T) => string) {}
  public add(value: T): this {
    this.set.add(this.hash(value));
    return this;
  }
  public has(value: T): boolean {
    return this.set.has(this.hash(value));
  }
}

function countUniqueCoordinates(path: Coordinates[]): number {
  const visited = new HashSet<Coordinates>(
    ([x, y]: Coordinates) => `${x},${y}`
  );

  return path.reduce((r, coords) => {
    if (visited.has(coords)) {
      return r;
    }
    visited.add(coords);
    return r + 1;
  }, 0);
}

function solve(file: string) {
  const { matrix, invertedMartix } = parse(file);
  const guardCoords = findGuard(matrix);
  const guardPath = traverse(guardCoords, matrix);
  return countUniqueCoordinates(guardPath);
}

const result = solve(file);

console.log("result: ", result);
