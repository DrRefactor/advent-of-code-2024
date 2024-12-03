import { readFileSync } from "fs";

const file = readFileSync(process.argv[2]).toString();

const MIN_DIFF = 1;
const MAX_DIFF = 3;

function isDiffSafe(diff: number) {
  const a = Math.abs(diff);
  return a >= MIN_DIFF && a <= MAX_DIFF;
}

function isReportSafe(report: number[]): boolean {
  let isInreasing: boolean | undefined;
  let previous: number | undefined;
  for (const element of report) {
    if (previous === undefined) {
      previous = element;
      continue;
    }
    const diff = element - previous;
    if (!isDiffSafe(diff)) {
      return false;
    }
    const isLocallyIncreasing = diff > 0;
    isInreasing ??= isLocallyIncreasing;

    if (isInreasing !== isLocallyIncreasing) {
      return false;
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

  return isReportSafe(report) ? r + 1 : r;
}, 0);

console.log("safe reports: ", safeReports);
