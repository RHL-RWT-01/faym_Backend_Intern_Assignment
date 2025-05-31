import express from 'express';
import Event from '../models/eventModel.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { user_id, event_type, payload } = req.body;
    if (!user_id || !event_type || !payload) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const event = new Event({ user_id, event_type, payload });
    await event.save();
    return res.status(202).json({
      status: 'success',
      event_id: event._id,
      timestamp: event.timestamp,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/analytics/event-counts', async (req, res) => {
  try {
    const { event_type, start_date, end_date } = req.query;
    const filter = {};

    if (event_type) {
      filter.event_type = event_type;
    }
    if (start_date || end_date) {
      filter.timestamp = {};
      if (start_date) {
        const start = new Date(start_date);
        if (isNaN(start)) return res.status(400).json({ error: 'Invalid start_date' });
        filter.timestamp.$gte = start;
      }
      if (end_date) {
        const end = new Date(end_date);
        if (isNaN(end)) return res.status(400).json({ error: 'Invalid end_date' });
        filter.timestamp.$lte = end;
      }
    }

    const count = await Event.countDocuments(filter);
    return res.status(200).json({ total: count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/analytics/event-counts-by-type', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const match = {};

    if (start_date || end_date) {
      match.timestamp = {};
      if (start_date) {
        const start = new Date(start_date);
        if (isNaN(start)) return res.status(400).json({ error: 'Invalid start_date' });
        match.timestamp.$gte = start;
      }
      if (end_date) {
        const end = new Date(end_date);
        if (isNaN(end)) return res.status(400).json({ error: 'Invalid end_date' });
        match.timestamp.$lte = end;
      }
    }

    const results = await Event.aggregate([
      { $match: match },
      { $group: { _id: '$event_type', count: { $sum: 1 } } },
    ]);

    const response = {};
    results.forEach(r => {
      response[r._id] = r.count;
    });

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
