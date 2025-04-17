import express from 'express';
import userRouter from './routes/user';

const app = express();
app.use(express.json());

app.use('/users', userRouter);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
