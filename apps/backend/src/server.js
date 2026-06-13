import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDatabase } from './db.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/cloudmart';

async function bootstrap() {
  await connectDatabase(mongoUri);
  await seedDatabase();

  const app = createApp();
  app.listen(port, () => {
    console.log(`CloudMart backend listening on port ${port}`);
  });
}

try {
  await bootstrap();
} catch (error) {
  console.error('Failed to start backend', error);
  process.exit(1);
}
