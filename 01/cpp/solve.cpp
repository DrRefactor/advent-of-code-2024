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

int main()
{
    std::ifstream file("../input.txt");

    std::vector<int> leftArray;
    std::vector<int> rightArray;

    std::string str;
    while(getline(file, str)) {
        std::vector<std::string> line = split(str, "  ");
        if (line.size() == 0) {
            continue;
        }
        leftArray.push_back(std::stoi(line.front()));
        rightArray.push_back(std::stoi(line.back()));
    }

    std::sort(leftArray.begin(), leftArray.end());
    std::sort(rightArray.begin(), rightArray.end());
    int sum = 0;

    for (int i = 0; i < leftArray.size(); i++) {
        sum += std::abs(leftArray[i] - rightArray[i]);
    }
    std::cout << "sum:" << sum << "\n";
}