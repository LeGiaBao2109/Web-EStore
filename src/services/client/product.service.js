const Product = require('../../models/product.model');
const mongoose = require('mongoose');

// exports.findAll = async () => {
//     try {
//         // Log này sẽ cho Bảo biết chính xác code đang đứng ở DB nào và tìm Collection nào
//         console.log("--- DEBUG CONNECT ---");
//         console.log("Đang đứng ở Database:", mongoose.connection.name); 
//         console.log("Đang tìm ở Collection:", Product.collection.name);
        
//         const data = await Product.find({}).lean(); // Thêm .lean() để lấy data nhanh
//         console.log("Số lượng SP tìm thấy:", data.length);
//         return data;
//     } catch (error) {
//         throw error;
//     }
// };

exports.findProductList = async () => {
    try {
        const data = await Product.find(
            {
                status: "active"
            }
        )
        return data;
    } catch (error) {
        throw error       
    }
}