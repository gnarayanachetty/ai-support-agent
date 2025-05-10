import express from 'express';
import chatRouter from './routes/chat';

const app = express();
app.use(express.json());

app.use('/chats', chatRouter);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});
