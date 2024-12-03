import { readFileSync } from "fs";

const file = readFileSync(process.argv[2]).toString();
const result = [...file.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)].reduce(
  (r, match) => {
    const [, a, b] = match;

    return r + +a * +b;
  },
  0
);

console.log(result);
