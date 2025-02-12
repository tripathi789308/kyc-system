import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectToDatabase } from './db';
import router from "./routes";
import passport from 'passport';
import { jwtStrategy } from './middleware/auth';
async function main() {
  dotenv.config();
  const app = express();
  const port = process.env.PORT || 3001;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

    app.use(passport.initialize());
    passport.use(jwtStrategy);

  app.use(router);

  // Example route to check DB connection
  app.get('/api/health', async (req, res) => {
    res.status(200).send('OK');
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  await connectToDatabase();
}

main();