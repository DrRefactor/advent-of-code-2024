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

sumSafeReports :: [[Int]] -> Int
sumSafeReports [] = 0
sumSafeReports reports = (if isSafe (head reports) then 1 else 0) + sumSafeReports (tail reports)

toInts :: [[String]] -> [[Int]]
toInts = map (map read)

main = do
   args <- getArgs
   content <- readFile (head args)
   let linesList = map words (lines content)
   let reportsList = toInts linesList
   print (sumSafeReports reportsList)
