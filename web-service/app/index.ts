import dotenv from 'dotenv';
dotenv.config({ path: './../.env' });

import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import customerRouter from './api/v1/customer';

const app: Express = express();

// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
const main = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
};

main().catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(morgan('common'));
app.use(express.urlencoded({ extended: false }));

app.use(customerRouter);

export default app;