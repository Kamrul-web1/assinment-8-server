
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { ObjectId } from "mongodb";
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
const db = client.db('evints-menesment');
const eventsCollection = db.collection('events');
connectToMongoDB();


app.post('/create-event', async (req, res) => {
  try {
    const eventData = req.body;

    const result = await eventsCollection.insertOne({
      ...eventData,
      createdAt: new Date()
    });

    res.status(201).send({
      message: "Event created successfully",
      insertedId: result.insertedId
    });

  } catch (error) {
    console.error("Create Event Error:", error);

    res.status(500).send({
      message: "Failed to create event",
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.send('hello kamrul');
});


app.get('/upcoming-events', async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const result = await eventsCollection
      .find({
        eventDate: { $gte: today }
      })
      .sort({ eventDate: 1 })
      .limit(6)
      .toArray();

    res.send(result);

  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch upcoming events",
      error: error.message
    });
  }
});
app.get("/manage-events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const event = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).send({
        message: "Event not found",
      });
    }

    res.send(event);
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
});
app.get('/manage-events', async (req, res) => {
  try {
    const result = await eventsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);

  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch events",
      error: error.message
    });
  }
});
// updet 
app.patch("/manage-events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: req.body,
      }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Update failed" });
  }
});
// DEletde 

app.delete('/manage-events/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const result = await eventsCollection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: "Event not found"
      });
    }

    res.send({
      message: "Event deleted successfully"
    });

  } catch (error) {
    res.status(500).send({
      message: "Failed to delete event",
      error: error.message
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
