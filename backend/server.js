import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes.js';
import { connectDB } from './utils/connectDB.js';
import { generateEvents } from './utils/generateData.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));


//middleware to log request details
app.use((req, res, next) => {
  console.log({
    "Request Method": req.method,
    "Request URL": req.url,
  })
  next();
})


app.get('/', (req, res) => {
  res.send('Event Collector API is running');
});



app.get('/generate-sample-data', async (req, res) => {
  try {
    await generateEvents(500);
    res.status(200).json({ message: 'Sample data generated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate sample data' });
  }
});

app.use('/events', eventRoutes);


const startServer = async () => {

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  connectDB();
}
startServer().catch((err) => {
  console.error('Error starting server:', err);
});
startServer();