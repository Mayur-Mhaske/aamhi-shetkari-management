import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import skillRoutes from "./routes/skillRoutes.js";
import customerRoutes from './routes/customers.js';
import dailyEntryRoutes from './routes/dailyEntry.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import summaryRoutes from "./routes/summaryRoutes.js";


dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/daily-entry', dailyEntryRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use("/api/summary", summaryRoutes);

app.get('/', (req, res) => {
  res.send('SkillSync Pro API is working ✅')
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.log(err))

// Sample item for testing
const sampleItem = {
  "itemName": "Oil",
  "quantity": 500,
  "date": "2025-06-20"
};

console.log('Sample Item:', sampleItem);
