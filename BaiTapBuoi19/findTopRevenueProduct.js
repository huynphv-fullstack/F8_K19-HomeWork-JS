const products = [
    { id: 1, name: 'iPhone', price: 2000 },
    { id: 2, name: 'Samsung', price: 1500 },
    { id: 3, name: 'Xiaomi', price: 1000 },
    { id: 4, name: 'Oppo', price: 1200 }
]
const orders = [
    {
        id: 1,
        items: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 }
        ]
    },
    {
        id: 2,
        items: [
            { productId: 1, quantity: 1 },
            { productId: 3, quantity: 3 }
        ]
    },
    {
        id: 3,
        items: [
            { productId: 2, quantity: 2 },
            { productId: 4, quantity: 1 }
        ]
    }
]
function findTopRevenueProduct(products, orders) {
    const revenueMap = {}
    for (const order of orders) {
        for (const item of order.items) {
            const product = products.find(p => p.id === item.productId)
            const revenue = product.price * item.quantity
            revenueMap[product.id] =
                (revenueMap[product.id] || 0) + revenue
        }
    }
    let topProduct = null
    let maxRevenue = 0
    for (const product of products) {
        const revenue = revenueMap[product.id] || 0
        if (revenue > maxRevenue) {
            maxRevenue = revenue
            topProduct = {
                ...product,
                revenue: revenue
            }
        }
    }
    return topProduct
}
const result = findTopRevenueProduct(products, orders)

console.log(result)