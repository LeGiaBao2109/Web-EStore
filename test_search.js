const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/product.model');

async function testSearch() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Test 1: Get all active products
        const allProducts = await Product.find({ status: "active" });
        console.log(`\n📊 Total active products: ${allProducts.length}`);

        // Test 2: Search with regex
        const keyword = "ádfasdf";
        const searchResults = await Product.find({
            name: { $regex: keyword, $options: 'i' },
            status: "active"
        });
        console.log(`\n🔍 Search results for "${keyword}": ${searchResults.length}`);
        
        // Test 3: Search with existing keyword
        const keyword2 = "iPhone";
        const searchResults2 = await Product.find({
            name: { $regex: keyword2, $options: 'i' },
            status: "active"
        });
        console.log(`\n🔍 Search results for "${keyword2}": ${searchResults2.length}`);
        if (searchResults2.length > 0) {
            console.log('   Sample:', searchResults2[0].name);
        }

        await mongoose.disconnect();
        console.log('\n✅ Test complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testSearch();
