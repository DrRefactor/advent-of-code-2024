import { readFileSync } from "fs";

const file = readFileSync(process.argv[2]).toString().split("\n");

type EquationInput = {
  result: number;
  elements: number[];
};

enum Operator {
  Multiply = "*",
  Add = "+",
  Concatenate = "||",
}

const RESULT_SEPARATOR = ": ";
const ELEMENT_SEPARATOR = " ";

function parseLine(line: string): EquationInput | undefined {
  const [resultPart, elementsPart] = line.split(RESULT_SEPARATOR);
  if (!resultPart || !elementsPart) {
    return;
  }
  const result = +resultPart;
  const elements = elementsPart.split(ELEMENT_SEPARATOR).map(Number);

  return { result, elements };
}

function parse(fileLines: string[]): EquationInput[] {
  const result: EquationInput[] = [];

  for (const line of fileLines) {
    const equation = parseLine(line);
    if (equation) {
      result.push(equation);
    }
  }

  return result;
}

function calculate(numbers: number[], operators: Operator[]) {
  return operators.reduce((r, operator, i) => {
    const currentNumber = numbers[i + 1];
    if (operator === Operator.Add) {
      return r + currentNumber;
    } else if (operator === Operator.Multiply) {
      return r * currentNumber;
    } else {
      return +("" + r + currentNumber);
    }
  }, numbers[0]);
}

function generateAllOperators(
  length: number,
  possibleOperators: Operator[]
): Operator[][] {
  let result: Operator[][] = possibleOperators.map((operator) => [operator]);
  let currentLength = 1;
  while (currentLength < length) {
    const newResult: Operator[][] = [];
    for (const operators of result) {
      newResult.push(
        ...possibleOperators.map((operator) => [...operators, operator])
      );
    }
    result = newResult;
    currentLength++;
  }

  return result;
}

function memoize<A, R>(f: (a: A) => R): (a: A) => R {
  const cache = new Map<A, R>();
  return (a: A): R => {
    if (!cache.has(a)) {
      cache.set(a, f(a));
    }
    return cache.get(a)!;
  };
}

const possibleOperators = {
  task1: [Operator.Add, Operator.Multiply],
  task2: [Operator.Add, Operator.Multiply, Operator.Concatenate],
};
const generateAllOperatorsForTask1Memoized = memoize((length: number) =>
  generateAllOperators(length, possibleOperators.task1)
);
const generateAllOperatorsForTask2Memoized = memoize((length: number) =>
  generateAllOperators(length, possibleOperators.task2)
);

function isEquationPossible(
  equationInput: EquationInput,
  generateAllOperators: (length: number) => Operator[][]
): boolean {
  const operatorsVariants = generateAllOperators(
    equationInput.elements.length - 1
  );
  for (const operators of operatorsVariants) {
    const resultCandidate = calculate(equationInput.elements, operators);
    if (resultCandidate === equationInput.result) {
      return true;
    }
  }

  return false;
}

function solve(
  fileLines: string[],
  generateAllOperators: (length: number) => Operator[][]
): number {
  const equations = parse(fileLines);

  let possibleEquationsSum = 0;
  for (const equation of equations) {
    if (isEquationPossible(equation, generateAllOperators)) {
      possibleEquationsSum += equation.result;
    }
  }

  return possibleEquationsSum;
}

let startTime = Date.now();
const resultTask1 = solve(file, generateAllOperatorsForTask1Memoized);
console.log(`task1 duration: ${Date.now() - startTime}ms`);
startTime = Date.now();
const resultTask2 = solve(file, generateAllOperatorsForTask2Memoized);
console.log(`task2 duration: ${Date.now() - startTime}ms`);

console.log("result: ", {
  task1: resultTask1,
  task2: resultTask2,
});
