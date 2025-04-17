import express from 'express';
import authRouter from './routes/auth';

const app = express();
app.use(express.json());

app.use('/auth', authRouter);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
