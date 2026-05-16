const numbers = [9, 8, 3, 5, 6, 2, 7, 9];
function findSecondLargest(arr) {
    let max = -Infinity;
    let secondMax = -Infinity;
    for (const num of arr) {
        if (num > max) {
            secondMax = max;
            max = num;
        }
        else if (num < max && num > secondMax) {
            secondMax = num;
        }
    }
    return secondMax;
}

console.log(findSecondLargest(numbers));