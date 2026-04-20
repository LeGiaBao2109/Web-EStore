const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

module.exports.getCartByUserId = async (userId) => {
    return await Cart.findOne({
        userId: userId
    }).populate('items.productId');
};

module.exports.addToCart = async (userId, productData, quantity = 1) => {
    let cart = await Cart.findOne({
        userId: userId
    });

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
    return {
        success: true,
        cartCount: cart.items.length
    };
};

module.exports.updateQuantity = async (userId, productId, quantity) => {
    const cart = await Cart.findOne({
        userId: userId
    });
    if (!cart) return {
        success: false
    };

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (item) {
        item.quantity = quantity;
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.updatedAt = Date.now();
        await cart.save();
        return {
            success: true
        };
    }
    return {
        success: false
    };
};

module.exports.removeFromCart = async (userId, productId) => {
    try {
        const cart = await Cart.findOneAndUpdate({
            userId: userId
        }, {
            $pull: {
                items: {
                    productId: productId
                }
            }
        }, {
            returnDocument: 'after'
        });

        if (cart) {
            cart.totalAmount = cart.items.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);

            await cart.save();
        }

        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};