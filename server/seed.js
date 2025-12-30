import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Plan from './src/models/Plan.js';
import Order from './src/models/Order.js';
import WalletTransaction from './src/models/WalletTransaction.js';

dotenv.config();

const users = [
    {
        name: 'Admin User',
        number: '8905066047',
        password: 'admin123',
        role: 'ADMIN',
    },
    {
        name: 'John Doe',
        number: '1234557890',
        password: 'user123',
        role: 'USER',
        AccountName: '@johndoe_ig',
        AccountLink: 'https://instagram.com/johndoe',
    },
    {
        name: 'Jane Smith',
        number: '1234567790',
        password: 'user123',
        role: 'USER',
        AccountName: '@jane_creatives',
        AccountLink: 'https://instagram.com/jane_creatives',
    },
];


const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Plan.deleteMany();
        await Order.deleteMany();
        await WalletTransaction.deleteMany();
        // Create users
        console.log('Seeding users...');
        await User.insertMany(users);
        console.log('✓ Users seeded');

        console.log('\n✅ Database seeded successfully!');
        console.log('\nTest Credentials:');
        console.log('Admin: admin@example.com / admin123');
        console.log('User:  user@example.com / user123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
