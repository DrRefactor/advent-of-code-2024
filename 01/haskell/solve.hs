import System.Environment
import Data.List (sort)

diff :: Int -> Int -> Int
diff l r = abs (l - r)

sumDiffs :: [Int] -> [Int] -> Int
sumDiffs [] [] = 0
sumDiffs leftArray rightArray = sumDiffs (tail leftArray) (tail rightArray) + diff (head leftArray) (head rightArray) 

main = do
   args <- getArgs
   content <- readFile (head args)
   let linesOfTuples = map words (lines content)
   let leftArray = sort (map (!!0) linesOfTuples)
   let rightArray = sort (map (!!1) linesOfTuples)
   let sum = sumDiffs (map read leftArray ::[Int]) (map read rightArray ::[Int])
   print sum 
