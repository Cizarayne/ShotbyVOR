import mongoose from 'mongoose';
import dns from 'dns'

dns.setServers(['1.1.1.1', '8.8.4.4', '8.8.8.8', '4.4.4.4'])

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully✅');
  } catch (err) {
    console.error('Database connection Failed ❌', err.message);
    process.exit(1);
  }
}
