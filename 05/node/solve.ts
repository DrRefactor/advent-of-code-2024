import { readFileSync } from "fs";

type Rule = [number, number];
type Update = number[];

const SECTION_SEPARATOR = "";

function parse(file: string[]): { rules: Rule[]; updates: Update[] } {
  const rules: Rule[] = [];
  const updates: Update[] = [];
  let lineIndex = 0;
  while (file[lineIndex] !== SECTION_SEPARATOR) {
    const maybeRule = file[lineIndex].split("|").map((s) => +s);
    if (maybeRule.length === 2) {
      rules.push(maybeRule as Rule);
    }
    lineIndex++;
  }

  while (!file[lineIndex]) {
    lineIndex++;
  }

  while (file[lineIndex]) {
    const update = file[lineIndex].split(",").map((s) => +s);
    if (update.length) {
      updates.push(file[lineIndex].split(",").map((s) => +s));
    }
    lineIndex++;
  }

  return { rules, updates };
}

type RuleMap = {
  [index: number]: Set<number> | undefined;
};

function createRuleMap(rules: Rule[]): RuleMap {
  const ruleMap: RuleMap = rules.reduce((r, rule) => {
    const [predecessor, successor] = rule;
    r[predecessor] ??= new Set<number>();
    r[predecessor].add(successor);
    return r;
  }, {} as RuleMap);

  return ruleMap;
}

enum Compare {
  LhsFirst = -1,
  DontCare = 0,
  RhsFirst = 1,
}

function compareUpdateEntry(
  lhs: number,
  rhs: number,
  ruleMap: RuleMap
): Compare {
  const lhsSuccessors = ruleMap[lhs];
  const rhsSuccessors = ruleMap[rhs];

  if (lhsSuccessors?.has(rhs)) {
    return Compare.LhsFirst;
  }
  if (rhsSuccessors?.has(lhs)) {
    return Compare.RhsFirst;
  }

  return Compare.DontCare;
}

function isUpdateSorted(update: Update, ruleMap: RuleMap): boolean {
  for (let i = 0; i < update.length; i++) {
    const lhs = update[i];
    for (let j = i + 1; j < update.length; j++) {
      const rhs = update[j];
      if (compareUpdateEntry(lhs, rhs, ruleMap) === Compare.RhsFirst) {
        return false;
      }
    }
  }
  return true;
}

function getMiddleElement(update: Update): number {
  return update[Math.floor(update.length / 2)];
}

function getMiddleElements(updates: Update[]): number[] {
  return updates.map(getMiddleElement);
}

function sum(values: number[]): number {
  return values.reduce((r, x) => r + x, 0);
}

function solve(file: string[]): number {
  const { rules, updates } = parse(file);
  const ruleMap = createRuleMap(rules);
  const correctUpdates = updates.filter((update) =>
    isUpdateSorted(update, ruleMap)
  );
  return sum(getMiddleElements(correctUpdates));
}

const file = readFileSync(process.argv[2]).toString().split("\n");

const result = solve(file);

console.log("result: ", result);
