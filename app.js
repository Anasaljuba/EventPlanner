const express = require("express");
const connectDb = require("./database");
const Events = require("./dataBase/models/Events");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/events", async (req, res) => {
  try {
    const event = req.body;
    const createdEvent = await Events.create(event);
    res.status(201).json({
      msg: "Event got created successfully",
      theProduct: createdEvent,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/events/:eventName", async (req, res) => {
  const { eventName } = req.params;
  try {
    const events = await Events.find();
    const filteredEvents = events.filter((event) => event.slug === eventName);
    res.json(filteredEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Events.find();

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/fullyBookedEvents", async (req, res) => {
  try {
    const events = await Events.find();
    const fullyBookedEvents = events.filter(
      (event) => event.numOfSeats === event.bookedSeats
    );
    res.json(fullyBookedEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/eventsByDate", async (req, res) => {
  const { startDate } = req.body;

  try {
    const events = await Events.find({
      startDate: { $gte: startDate },
    })
      .sort({ startDate: 1, name: 1 })
      .select("name _id startDate");

    console.log(startDate);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/events/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const eventCheck = await Events.findByIdAndDelete(eventId);
  try {
    if (eventCheck) {
      res.status(204).end();
    } else {
      res.status(404).json({ msg: "Event is not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/events/:eventId", async (req, res) => {
  const event = req.body;
  const { eventId } = req.params;
  try {
    const updateEvent = await Events.findByIdAndUpdate(eventId, event, {
      new: true,
    });
    res.status(200).json({
      msg: "event updated successfully",
      updateEvent: updateEvent,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  connectDb();

  console.log("The application is running on localhost:8000");
});
