import System.Environment

isDiffSafe :: Int -> Bool
isDiffSafe diff = abs diff >= 1 && abs diff <= 3

isRising :: Int -> Int -> Bool
isRising a b = b > a

isMonotonicityPreserved :: Int -> Int -> Bool -> Bool
isMonotonicityPreserved current previous wasRising = wasRising == isRising current previous

isSafeStep :: [Int] -> Int -> Bool -> Bool
isSafeStep [] _ _ = True
isSafeStep rest previous wasRising = isDiffSafe (previous - head rest)
   && isMonotonicityPreserved previous (head rest) wasRising
   && isSafeStep (tail rest) (head rest) (isRising previous (head rest))

isSafe :: [Int] -> Bool
isSafe a = isSafeStep (tail a) (head a) (isRising (head a) (a !!1))

dropIndex :: [Int] -> Int -> [Int]
dropIndex array index = take index array ++ drop (index + 1) array

isSafeDampened :: [Int] -> Int -> Bool
isSafeDampened reports dampenedIndex = (dampenedIndex /= length reports)
   && (isSafe (dropIndex reports dampenedIndex)
   || isSafeDampened reports (dampenedIndex + 1))

sumSafeReports :: [[Int]] -> ([Int] -> Bool) -> Int
sumSafeReports [] isSafe = 0
sumSafeReports reports isSafe = (if isSafe (head reports) then 1 else 0) + sumSafeReports (tail reports) isSafe

toInts :: [[String]] -> [[Int]]
toInts = map (map read)

main = do
   args <- getArgs
   content <- readFile (head args)
   let linesList = map words (lines content)
   let reportsList = toInts linesList
   print "part1:"
   print (sumSafeReports reportsList isSafe)
   print "part2:"
   print (sumSafeReports reportsList (`isSafeDampened` 0))
