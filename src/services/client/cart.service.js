const Cart = require("../../models/cart.model");

module.exports.addToCart = async (userId, productData, quantity = 1) => {
    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
        cart = new Cart({
            userId: userId,
            items: [],
            totalAmount: 0
        });
    }

    const existItem = cart.items.find(item => item.productId.toString() === productData._id.toString());

    if (existItem) {
        existItem.quantity += quantity;
    } else {
        cart.items.push({
            productId: productData._id,
            sku: productData.slug,
            price: productData.priceData.price,
            quantity: quantity
        });
    }

    cart.totalAmount = cart.items.reduce((sum, item) => {
        const itemPrice = Number(item.price) || 0;
        return sum + (itemPrice * item.quantity);
    }, 0);
    
    cart.updatedAt = Date.now();

    await cart.save();
    return { success: true, cartCount: cart.items.length };
};