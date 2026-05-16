const classA = [15, 2, 8, 10];
const classB = [8, 11, 2, 5, 9];
const merged = [...classA, ...classB];
function removeDuplicate(arr) {
    const seen = {};
    const result = [];
    for (const num of arr) {
        if (!seen[num]) {
            seen[num] = true;
            result.push(num);
        }
    }
    return result;
}
const uniqueIds = removeDuplicate(merged);

console.log(uniqueIds);

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [
        ...quickSort(left),
        pivot,
        ...quickSort(right)
    ];
}
const sortedIds = quickSort(uniqueIds);

console.log(sortedIds);