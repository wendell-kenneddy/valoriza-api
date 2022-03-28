import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { router } from '../routes';
import { errorHandler } from '../middlewares';

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandler);

export function init() {
  app.listen(process.env.PORT, () => console.log('Server running...'));
}
