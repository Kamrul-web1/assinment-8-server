
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

connectToMongoDB();

app.get('/', (req, res) => {
  res.send('hello kamrul');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
