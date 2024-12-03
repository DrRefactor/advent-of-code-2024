#include <vector>
#include <iterator>
#include <iostream>
#include <fstream>
#include <string>
#include <algorithm>

std::vector<std::string> split(const std::string &s, const std::string &delimiter) {
    size_t delim_start = 0;
    size_t delim_end = delimiter.length();
    size_t delim_len = delimiter.length();
    std::vector<std::string> res;

    while ((delim_end = s.find(delimiter, delim_start)) != std::string::npos) {
        std::string token = s.substr(delim_start, delim_end - delim_start);
        delim_start = delim_end + delim_len;
        res.push_back (token);
    }

    res.push_back(s.substr(delim_start));
    return res;
}

bool isDiffSafe(int diff) {
  return abs(diff) >= 1 && abs(diff) <= 3;
}

enum Monotonicity {
  UNDETERMINED,
  INCREASING,
  DECREASING,
};

Monotonicity getLocalMonotonicity(int first, int second) {
  return second > first ? INCREASING : DECREASING;
}

bool isReportSafe(const std::vector<int> &report) {
  int previous = report.front();
  bool first = true;
  enum Monotonicity monotonicity = UNDETERMINED;
  for (auto entry: report) {
    if (first) {
      first = false;
      continue;
    }
    int diff = entry - previous;
    if (!isDiffSafe(diff)) {
      return false;
    }
    Monotonicity localMonotonicity = getLocalMonotonicity(entry, previous);
    if (monotonicity == UNDETERMINED) {
      monotonicity = localMonotonicity;
    }

    if (monotonicity != localMonotonicity) {
      return false;
    }

    previous = entry;
  }
  
  return true;
}

int main()
{
    std::ifstream file("../input.txt");

    std::vector<std::vector<int>> reports;

    std::string str;
    while(getline(file, str)) {
        std::vector<std::string> line = split(str, " ");
        if (line.size() == 0) {
            continue;
        }
        std::vector<int> report;
        std::transform(line.begin(), line.end(), std::back_inserter(report), [](const std::string& str) { return std::stoi(str); });
        reports.push_back(report);
    }

    int safeReports = 0;
    int safeReportsDampened = 0;
    for (auto report: reports) {
      if (isReportSafe(report)) {
        safeReports++;
      } else {
        for (int i = 0; i < report.size(); i++) {
          std::vector<int> reportDampened = report;
          reportDampened.erase(reportDampened.begin() + i);
          if (isReportSafe(reportDampened)) {
            safeReportsDampened++;
            break;
          }
        }
      }
    }
    std::cout << "task1:" << "safe reports:" << safeReports << "\n";
    std::cout << "task2:" << "safe reports (with dampening):" << safeReports + safeReportsDampened << "\n";
}
