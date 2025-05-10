import express from 'express';
import aiRouter from './routes/ai';

const app = express();
app.use(express.json());

app.use('/ai', aiRouter);

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});
