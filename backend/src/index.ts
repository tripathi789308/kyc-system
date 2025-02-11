import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectToDatabase, prisma } from './db'; // Import the connection function
dotenv.config();
async function main() {
  const app = express();
  const port = process.env.PORT || 3001;

  app.use(cors());
  app.use(express.json());

  // Example route to check DB connection
  app.get('/api/health', async (req, res) => {
    res.status(200).send('OK');
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  await connectToDatabase(); // Await the database connection before starting the server
}

main();