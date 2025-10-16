import mongoose from 'mongoose';
import { RoleModel } from '../models/Role';
import dotenv from 'dotenv';

dotenv.config();

const roles = [
  { name: 'admin', description: 'Full system access' },
  { name: 'manager', description: 'Management level access' },
  { name: 'doctor', description: 'Doctor access' },
  { name: 'nurse', description: 'Nurse access' },
  { name: 'staff', description: 'Basic staff access' },
  { name: 'patient', description: 'Patient access' },
];

async function seedRoles() {
  try {
    const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGO_URI or MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await RoleModel.deleteMany({});
    console.log('🗑️  Cleared existing roles');

    const createdRoles = await RoleModel.insertMany(roles);
    console.log('✅ Roles seeded successfully');

    console.log('\n📋 Created Roles:');
    createdRoles.forEach(role => {
      console.log(`   - ${role.name}: ${role.description}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    process.exit(1);
  }
}

seedRoles();