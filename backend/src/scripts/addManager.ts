// scripts/addManager.ts
import mongoose from 'mongoose';
import { HealthcareManager } from '../models/HealthcareManager';

async function addManager() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_management_db');
  
  const manager = await HealthcareManager.create({
    managerID: 'MGR-202510-0001',
    name: 'Ravindu',
  });
  
  console.log('✅ Manager created:', manager);
  await mongoose.disconnect();
}

addManager().catch(console.error);