const Product = require('../../models/product.model');

exports.findProductList = async (filters = {}) => {
    try {
        let findQuery = {
            status: "active"
        };

        // Filter by search keyword (for search functionality)
        if (filters.searchKeyword) {
            findQuery.name = { $regex: filters.searchKeyword, $options: 'i' };
        }

        // Filter by product name (alternative)
        if (filters.name) {
            findQuery.name = filters.name;
        }

        // Filter by category
        if (filters.category) {
            findQuery.category = filters.category;
        }

        // Filter by brand (case-insensitive)
        if (filters.brand) {
            findQuery.brand = { $regex: filters.brand, $options: 'i' };
        }

        let pipeline = [{
                $match: findQuery
            },
            {
                $lookup: {
                    from: "prices",
                    localField: "priceId",
                    foreignField: "_id",
                    as: "priceData"
                }
            },
            {
                $unwind: "$priceData"
            },
            {
                $addFields: {
                    "finalPrice": {
                        $toDouble: "$priceData.price"
                    }
                }
            }
        ];

        // Xử lý Price Ranges (Giữ nguyên logic của Bảo)
        const rawRanges = filters['priceRanges[]'] || filters.priceRanges;
        if (rawRanges) {
            const rangeArray = Array.isArray(rawRanges) ? rawRanges : [rawRanges];
            const priceConditions = rangeArray.map(range => {
                const parts = range.split('-');
                const min = Number(parts[0]);
                const max = parts[1] ? Number(parts[1]) : null;

                if (max) {
                    return {
                        "finalPrice": {
                            $gte: min,
                            $lte: max
                        }
                    };
                }
                return {
                    "finalPrice": {
                        $gte: min
                    }
                };
            });

            if (priceConditions.length > 0) {
                pipeline.push({
                    $match: {
                        $or: priceConditions
                    }
                });
            }
        }

        // Xử lý Sort (Giữ nguyên logic của Bảo)
        if (filters.sortPrice && filters.sortPrice !== 'default') {
            pipeline.push({
                $sort: {
                    "finalPrice": filters.sortPrice === 'asc' ? 1 : -1
                }
            });
        }

        const products = await Product.aggregate(pipeline);

        return products.map(p => ({
            ...p,
            priceId: {
                ...p.priceData,
                price: p.finalPrice
            }
        }));

    } catch (error) {
        console.error("Lỗi tại Product Service:", error);
        throw error;
    }
};