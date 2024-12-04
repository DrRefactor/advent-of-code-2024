import { readFileSync } from "fs";

const file = readFileSync(process.argv[2]).toString();
type Matrix = string[][];
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

const SEARCH_PHRASE = "XMAS";

type Coordinates = [number, number];

function findAllCoordinatesForChar(char: string): Coordinates[] {
  return matrix.reduce((r, column, x) => {
    const coordsForColumn = column.reduce((r, currentChar, y) => {
      if (currentChar === char) {
        r.push([x, y]);
      }
      return r;
    }, [] as Coordinates[]);

    r.push(...coordsForColumn);
    return r;
  }, [] as Coordinates[]);
}

const TraverseDirection = {
  RightDirection: [1, 0],
  LeftDirection: [-1, 0],
  UpDirection: [0, 1],
  DownDirection: [0, -1],
  UpLeftDirection: [-1, 1],
  UpRightDirection: [1, 1],
  DownLeftDirection: [-1, -1],
  DownRightDirection: [1, -1],
} as const;
type TraverseDirection =
  (typeof TraverseDirection)[keyof typeof TraverseDirection];

function traverse(
  coordinates: Coordinates,
  direction: TraverseDirection
): boolean {
  const [startX, startY] = coordinates;
  const [deltaX, deltaY] = direction;

  let currentX = startX;
  let currentY = startY;
  let char: string | undefined = matrix[currentX][currentY];
  let phraseIndex = 1;
  while (SEARCH_PHRASE[phraseIndex]) {
    currentX += deltaX;
    currentY += deltaY;
    char = matrix[currentX]?.[currentY];
    if (char !== SEARCH_PHRASE[phraseIndex]) {
      return false;
    }
    phraseIndex++;
  }
  return true;
}

function countMatchesFrom(coordinates: Coordinates): number {
  return Object.values(TraverseDirection).reduce(
    (r, direction) => r + (traverse(coordinates, direction) ? 1 : 0),
    0
  );
}

const result = findAllCoordinatesForChar(SEARCH_PHRASE[0]).reduce(
  (r, coordinates) => {
    return r + countMatchesFrom(coordinates);
  },
  0
);

console.log("result:", result);
