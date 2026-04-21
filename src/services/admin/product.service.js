const Product = require('../../models/product.model');
const Price = require('../../models/price.model');
const WarehouseLog = require('../../models/warehouseLog.model');
const slugify = require('slugify');

module.exports.getProductsForManager = async () => {
    return await Product.find()
        .populate('priceId')
        .sort({
            updatedAt: -1
        });
};

module.exports.createProduct = async (data, adminId) => {
    const slug = slugify(data.name, {
        lower: true,
        locale: 'vi'
    }) + "-" + Date.now();

    const newProduct = new Product({
        name: data.name,
        slug: slug,
        image: data.image,
        brand: data.brand,
        category: data.category,
        description: data.description,
        stock: data.stock,
        status: data.status || 'active'
    });

    const firstPrice = await Price.create({
        productId: newProduct._id,
        price: data.initialPrice,
        reason: "Khởi tạo sản phẩm",
        isCurrent: true,
        createdBy: adminId
    });

    await WarehouseLog.create({
        productId: newProduct._id,
        type: "import",
        quantity: data.stock,
        note: "Nhập kho lần đầu khi tạo sản phẩm",
        createdBy: adminId
    });

    newProduct.priceId = firstPrice._id;
    return await newProduct.save();
};

module.exports.getProductById = async (id) => {
    return await Product.findById(id).populate('priceId');
};

module.exports.updateProductInfo = async (id, data) => {
    return await Product.findByIdAndUpdate(id, {
        $set: data
    }, {
        new: true
    });
};

module.exports.updatePrice = async (productId, priceData, adminId) => {
    await Price.updateMany({
        productId
    }, {
        isCurrent: false
    });

    const newPrice = await Price.create({
        productId,
        price: priceData.price,
        reason: priceData.reason,
        isCurrent: true,
        createdBy: adminId
    });

    await Product.findByIdAndUpdate(productId, {
        priceId: newPrice._id
    });
    return newPrice;
};

module.exports.updateStock = async (productId, stockData, adminId) => {
    const product = await Product.findById(productId);
    const qtyChange = Number(stockData.quantity);
    const newStock = stockData.type === 'import' ?
        product.stock + qtyChange :
        product.stock - qtyChange;

    await WarehouseLog.create({
        productId,
        type: stockData.type,
        quantity: qtyChange,
        note: stockData.note,
        createdBy: adminId
    });

    return await Product.findByIdAndUpdate(productId, {
        stock: newStock
    }, {
        new: true
    });
};

module.exports.getPriceHistory = async (productId) => {
    return await Price.find({ productId }).sort({ createdAt: -1 });
};

module.exports.getWarehouseLogs = async (productId) => {
    return await WarehouseLog.find({ productId: productId }).sort({ createdAt: -1 });
};