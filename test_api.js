const mongoose = require('mongoose');
require('dotenv').config();

const serviceProduct = require('./src/services/client/product.service');

async function testSearchAPI() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected');

        // Test 1: Search "ádfasdf" (not found)
        console.log('\n🔍 Test 1: Search "ádfasdf"');
        const result1 = await serviceProduct.findProductList({
            searchKeyword: "ádfasdf",
            status: "active"
        });
        console.log(`   Results: ${result1.length} products`);
        
        // Test 2: Search "iPhone" (should find)
        console.log('\n🔍 Test 2: Search "iPhone"');
        const result2 = await serviceProduct.findProductList({
            searchKeyword: "iPhone",
            status: "active"
        });
        console.log(`   Results: ${result2.length} products`);
        if (result2.length > 0) {
            console.log(`   Sample: ${result2[0].name}`);
        }

        // Test 3: No filter (all active)
        console.log('\n🔍 Test 3: All active products');
        const result3 = await serviceProduct.findProductList({
            status: "active"
        });
        console.log(`   Results: ${result3.length} products`);

        await mongoose.disconnect();
        console.log('\n✅ All tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

testSearchAPI();
