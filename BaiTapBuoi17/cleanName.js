function cleanName(name, keyword) {
    let clean = name.trim().toLowerCase();
    let key = keyword.toLowerCase();

    return clean.includes(key);
}

// Test
console.log(cleanName('   NGUYEN Van An   ', 'an')); // true
console.log(cleanName('   Tran Thi B ', 'hoang'));   // false