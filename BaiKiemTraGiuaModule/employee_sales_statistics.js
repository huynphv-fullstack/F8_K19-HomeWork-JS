const employees = [
    { id: 1, name: "Alice", age: 23, status: "working" },
    { id: 3, name: "Bob", age: 25, status: "working" },
    { id: 6, name: "John", age: 27, status: "working" },
    { id: 8, name: "David", age: 23, status: "quit_job" },
    { id: 10, name: "Eve", age: 20, status: "working" },
];

const products = [
    { id: 1, name: "Phone", price: 1200 },
    { id: 2, name: "Laptop", price: 3000 },
    { id: 3, name: "Tab", price: 2000 },
    { id: 4, name: "PC", price: 800 },
    { id: 5, name: "Monitor", price: 1500 },
];

const orders = [
    { id: 1, employeeId: 1, productId: 4, quantity: 1 },
    { id: 2, employeeId: 3, productId: 2, quantity: 4 },
    { id: 3, employeeId: 1, productId: 5, quantity: 3 },
    { id: 4, employeeId: 6, productId: 1, quantity: 2 },
    { id: 5, employeeId: 3, productId: 5, quantity: 3 },
    { id: 6, employeeId: 8, productId: 1, quantity: 1 },
    { id: 7, employeeId: 10, productId: 3, quantity: 2 },
];

function createProductMap(products) {
    const productMap = {};
    for (const product of products) {
        productMap[product.id] = product;
    }
    return productMap;
}

function createEmployeeMap(employees) {
    const employeeMap = {};
    for (const employee of employees) {
        employeeMap[employee.id] = employee;
    }
    return employeeMap;
}

const productMap = createProductMap(products);
const employeeMap = createEmployeeMap(employees);


// =========================
// Bai 1
function getWorkingEmployees(employees) {
    return employees.filter((employee) => employee.status === "working");
}
console.log("Bai 1");
console.log(getWorkingEmployees(employees));


// =========================
// Bai 2
function getOldestEmployee(employees) {
    let oldestEmployee = employees[0];
    for (const employee of employees) {
        if (employee.age > oldestEmployee.age) {
            oldestEmployee = employee;
        }
    }
    return oldestEmployee;
}
console.log("Bai 2");
console.log(getOldestEmployee(employees));


// =========================
// Bai 3
function getCheapestProduct(products) {
    let cheapestProduct = products[0];
    for (const product of products) {
        if (product.price < cheapestProduct.price) {
            cheapestProduct = product;
        }
    }
    return cheapestProduct;
}
console.log("Bai 3");
console.log(getCheapestProduct(products));


// =========================
// Bai 4
function getBestSellingProduct(orders, productMap) {
    const productQuantityMap = {};
    for (const order of orders) {
        if (!productQuantityMap[order.productId]) {
            productQuantityMap[order.productId] = 0;
        }
        productQuantityMap[order.productId] += order.quantity;
    }
    let bestProductId = null;
    let maxQuantity = 0;
    for (const productId in productQuantityMap) {
        if (productQuantityMap[productId] > maxQuantity) {
            maxQuantity = productQuantityMap[productId];
            bestProductId = Number(productId);
        }
    }
    return {
        product: productMap[bestProductId],
        totalQuantity: maxQuantity,
    };
}
console.log("Bai 4");
console.log(getBestSellingProduct(orders, productMap));


// =========================
// Bai 5
function getHighestRevenueProduct(orders, productMap) {
    const productRevenueMap = {};
    for (const order of orders) {
        const product = productMap[order.productId];
        const revenue = product.price * order.quantity;
        if (!productRevenueMap[order.productId]) {
            productRevenueMap[order.productId] = 0;
        }
        productRevenueMap[order.productId] += revenue;
    }
    let bestProductId = null;
    let maxRevenue = 0;
    for (const productId in productRevenueMap) {
        if (productRevenueMap[productId] > maxRevenue) {
            maxRevenue = productRevenueMap[productId];
            bestProductId = Number(productId);
        }
    }
    return {
        product: productMap[bestProductId],
        revenue: maxRevenue,
    };
}
console.log("Bai 5");
console.log(getHighestRevenueProduct(orders, productMap));


// =========================
// Bai 6
function getBestSellerEmployee(orders, employeeMap) {
    const employeeQuantityMap = {};
    for (const order of orders) {
        if (!employeeQuantityMap[order.employeeId]) {
            employeeQuantityMap[order.employeeId] = 0;
        }
        employeeQuantityMap[order.employeeId] += order.quantity;
    }
    let bestEmployeeId = null;
    let maxQuantity = 0;
    for (const employeeId in employeeQuantityMap) {
        if (employeeQuantityMap[employeeId] > maxQuantity) {
            maxQuantity = employeeQuantityMap[employeeId];
            bestEmployeeId = Number(employeeId);
        }
    }
    return {
        employee: employeeMap[bestEmployeeId],
        totalQuantity: maxQuantity,
    };
}
console.log("Bai 6");
console.log(getBestSellerEmployee(orders, employeeMap));


// =========================
// Bai 7
function getHighestRevenueEmployee(orders, employeeMap, productMap) {
    const employeeRevenueMap = {};
    for (const order of orders) {
        const product = productMap[order.productId];
        const revenue = product.price * order.quantity;
        if (!employeeRevenueMap[order.employeeId]) {
            employeeRevenueMap[order.employeeId] = 0;
        }
        employeeRevenueMap[order.employeeId] += revenue;
    }
    let bestEmployeeId = null;
    let maxRevenue = 0;
    for (const employeeId in employeeRevenueMap) {
        if (employeeRevenueMap[employeeId] > maxRevenue) {
            maxRevenue = employeeRevenueMap[employeeId];
            bestEmployeeId = Number(employeeId);
        }
    }
    return {
        employee: employeeMap[bestEmployeeId],
        revenue: maxRevenue,
    };
}
console.log("Bai 7");
console.log(
    getHighestRevenueEmployee(orders, employeeMap, productMap)
);


// =========================
// Bai 8
function getTopRevenueProductByEmployee(employees, orders, productMap) {
    const result = [];
    for (const employee of employees) {
        const revenueMap = {};
        for (const order of orders) {
            if (order.employeeId === employee.id) {
                const product = productMap[order.productId];
                const revenue = product.price * order.quantity;
                if (!revenueMap[order.productId]) {
                    revenueMap[order.productId] = 0;
                }
                revenueMap[order.productId] += revenue;
            }
        }
        let bestProductId = null;
        let maxRevenue = 0;
        for (const productId in revenueMap) {
            if (revenueMap[productId] > maxRevenue) {
                maxRevenue = revenueMap[productId];
                bestProductId = Number(productId);
            }
        }
        result.push({
            employeeName: employee.name,
            product: productMap[bestProductId] || null,
            revenue: maxRevenue,
        });
    }
    return result;
}
console.log("Bai 8");
console.log(
    getTopRevenueProductByEmployee(employees, orders, productMap)
);


// =========================
// Bai 9
function calculateEmployeeCommission(employees, orders, productMap) {
    const commissionRate = 0.03;
    const employeeRevenueMap = {};
    for (const order of orders) {
        const product = productMap[order.productId];
        const revenue = product.price * order.quantity;
        if (!employeeRevenueMap[order.employeeId]) {
            employeeRevenueMap[order.employeeId] = 0;
        }
        employeeRevenueMap[order.employeeId] += revenue;
    }
    const result = [];
    for (const employee of employees) {
        const revenue = employeeRevenueMap[employee.id] || 0;
        result.push({
            employeeName: employee.name,
            revenue,
            commission: revenue * commissionRate,
        });
    }
    return result;
}
console.log("Bai 9");
console.log(
    calculateEmployeeCommission(employees, orders, productMap)
);


// =========================
// Bai 10
function sortEmployeesByRevenue(employees, orders, productMap) {
    const employeeRevenueMap = {};
    for (const order of orders) {
        const product = productMap[order.productId];
        const revenue = product.price * order.quantity;
        if (!employeeRevenueMap[order.employeeId]) {
            employeeRevenueMap[order.employeeId] = 0;
        }
        employeeRevenueMap[order.employeeId] += revenue;
    }
    const result = [];
    for (const employee of employees) {
        result.push({
            ...employee,
            revenue: employeeRevenueMap[employee.id] || 0,
        });
    }
    result.sort((a, b) => b.revenue - a.revenue);
    return result;
}
console.log("Bai 10");
console.log(
    sortEmployeesByRevenue(employees, orders, productMap)
);