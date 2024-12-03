import { readFileSync } from "fs";

const file = readFileSync(process.argv[2]).toString();
const badLevelLimit = Number.parseInt(process.argv[3]);
if (Number.isNaN(badLevelLimit)) {
  throw "Bad level limit must be a number";
}

const MIN_DIFF = 1;
const MAX_DIFF = 3;

function isDiffSafe(diff: number) {
  const a = Math.abs(diff);
  return a >= MIN_DIFF && a <= MAX_DIFF;
}

function dropIndex<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1, array.length)];
}

function isReportSafe(report: number[], dropLimit: number): boolean {
  let isInreasing: boolean | undefined;
  let previous: number | undefined;
  const dampeningFallback = () => {
    for (let i = 0; i < report.length; i++) {
      if (isReportSafe(dropIndex(report, i), dropLimit - 1)) {
        return true;
      }
    }
    return false;
  };

  for (const element of report) {
    if (previous === undefined) {
      previous = element;
      continue;
    }

    const diff = element - previous;
    if (!isDiffSafe(diff)) {
      if (dropLimit === 0) {
        return false;
      }
      return dampeningFallback();
    }
    const isLocallyIncreasing = diff > 0;
    isInreasing ??= isLocallyIncreasing;

    if (isInreasing !== isLocallyIncreasing) {
      if (dropLimit === 0) {
        return false;
      }
      return dampeningFallback();
    }

    previous = element;
  }

  return true;
}

const delimeter = new RegExp(/\s+/);
const safeReports = file.split("\n").reduce((r, line) => {
  if (!line.length) {
    return r;
  }
  const report = line.split(delimeter).map((s) => +s);

  return isReportSafe(report, badLevelLimit) ? r + 1 : r;
}, 0);

console.log("safe reports: ", safeReports);
