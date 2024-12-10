import { readFileSync } from "fs";

const file = readFileSync(process.argv[2]).toString().split("\n");

type EquationInput = {
  result: number;
  elements: number[];
};

enum Operator {
  Multiply = "*",
  Add = "+",
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
    } else {
      return r * currentNumber;
    }
  }, numbers[0]);
}

function generateAllOperators(length: number): Operator[][] {
  let result: Operator[][] = [[Operator.Add], [Operator.Multiply]];
  let currentLength = 1;
  while (currentLength < length) {
    const newResult: Operator[][] = [];
    for (const operators of result) {
      newResult.push(
        [...operators, Operator.Add],
        [...operators, Operator.Multiply]
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

const generateAllOperatorsMemoized = memoize(generateAllOperators);

function isEquationPossible(equationInput: EquationInput): boolean {
  const operatorsVariants = generateAllOperatorsMemoized(
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

function solve(fileLines: string[]): number {
  const equations = parse(fileLines);

  let possibleEquationsSum = 0;
  for (const equation of equations) {
    if (isEquationPossible(equation)) {
      possibleEquationsSum += equation.result;
    }
  }

  return possibleEquationsSum;
}

let startTime = Date.now();
const result = solve(file);
const duration = Date.now() - startTime;

console.log("result: ", result);
console.log(`duration: ${duration}ms`);
