import { readFileSync } from "fs";

const file = readFileSync(process.argv[2]).toString();

const lines = file.split("\n");
const delimeter = new RegExp(/\s+/);

const [leftArray, rightArray] = lines.reduce(
  ([resultLeft, resultRight], line) => {
    const [left, right] = line.split(delimeter);
    if (left && right) {
      resultLeft.push(+left);
      resultRight.push(+right);
    }
    return [resultLeft, resultRight];
  },
  [[], []] as [number[], number[]]
);

leftArray.sort();
rightArray.sort();

let sum = 0;

for (let i = 0; i < leftArray.length; i++) {
  const diff = Math.abs(leftArray[i] - rightArray[i]);
  sum += diff;
}

console.log("sum: ", sum);
