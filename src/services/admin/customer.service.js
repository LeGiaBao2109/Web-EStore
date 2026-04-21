const User = require('../../models/user.model');

class CustomerService {
    async getAllCustomers(search) {
        let filter = {};
        if (search && search.trim() !== "") {
            const keyword = search.trim();
            filter.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } },
                { phone: { $regex: keyword, $options: 'i' } }
            ];
        }
        return await User.find(filter).sort({ createdAt: -1 });
    }

    async getCustomerDetail(id) {
        const user = await User.findById(id);
        if (!user) throw new Error("Không tìm thấy khách hàng");
        return user;
    }

    async updateCustomer(id, data) {
        const { name, phone, address, status } = data;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, phone, address, status },
            { new: true }
        );
        if (!updatedUser) throw new Error("Cập nhật thất bại");
        return updatedUser;
    }

    async toggleStatus(id) {
        const user = await User.findById(id);
        if (!user) throw new Error("Không tìm thấy khách hàng");
        
        user.status = user.status === 'active' ? 'block' : 'active';
        await user.save();
        return user;
    }
}

module.exports = new CustomerService();