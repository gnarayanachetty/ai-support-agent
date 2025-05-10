import express from 'express';
import articlesRouter from './routes/articles';

const app = express();
app.use(express.json());

app.use('/articles', articlesRouter);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Knowledge Base Service running on port ${PORT}`);
});
