const Product = require('../../models/product.model');

exports.findProductList = async (filters = {}) => {
    try {
        let findQuery = {
            status: "active"
        };

        if (filters.searchKeyword) {
            findQuery.name = {
                $regex: filters.searchKeyword,
                $options: 'i'
            };
        }

        if (filters.name) {
            findQuery.name = filters.name;
        }

        if (filters.category) {
            findQuery.category = filters.category;
        }

        if (filters.brand) {
            findQuery.brand = {
                $regex: filters.brand,
                $options: 'i'
            };
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