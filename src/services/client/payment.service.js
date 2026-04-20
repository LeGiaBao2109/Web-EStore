const ProductService = require("./product.service");
const Cart = require("../../models/cart.model");

module.exports.getCheckoutData = async (userId, type, productId) => {
    try {
        if (type === 'buy_now' && productId) {
            const product = await ProductService.findProductById(productId);
            
            if (!product) {
                return { success: false, message: "Sản phẩm không còn tồn tại!" };
            }

            const price = product.priceData ? product.priceData.price : 0;

            return {
                success: true,
                items: [{
                    productId: {
                        _id: product._id,
                        name: product.name,
                        image: product.image,
                        slug: product.slug
                    },
                    sku: product.slug,
                    price: price,
                    quantity: 1,
                    totalItemPrice: price
                }],
                totalAmount: price
            };
        }

        if (type === 'cart') {
            const cart = await Cart.findOne({ userId }).populate('items.productId');
            
            if (!cart || !cart.items || cart.items.length === 0) {
                return { success: false, message: "Giỏ hàng trống!" };
            }

            const itemsWithPrices = await Promise.all(cart.items.map(async (item) => {
                const productWithPrice = await ProductService.findProductById(item.productId._id);
                const currentPrice = productWithPrice?.priceData?.price || 0;
                
                return {
                    productId: item.productId,
                    sku: item.productId.slug,
                    price: currentPrice,
                    quantity: item.quantity,
                    totalItemPrice: currentPrice * item.quantity
                };
            }));

            const totalAmount = itemsWithPrices.reduce((sum, item) => sum + item.totalItemPrice, 0);

            return {
                success: true,
                items: itemsWithPrices,
                totalAmount: totalAmount
            };
        }

        return { success: false, message: "Loại hình thanh toán không hợp lệ" };
    } catch (error) {
        return { success: false, error: error.message };
    }
};