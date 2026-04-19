const Product = require('../../models/product.model');

const getProductsForManager = async () => {
    return await Product.find()
        .populate('priceId')
        .sort({
            updatedAt: -1
        });
};

const createProduct = async (data) => {
    return await Product.create(data);
};