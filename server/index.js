import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_erp';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
	res.json({ ok: true, service: 'college-erp-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

mongoose
	.connect(mongoUri, { dbName: process.env.MONGO_DB_NAME || 'college_erp' })
	.then(() => {
		console.log('MongoDB connected.');
		app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
	})
	.catch((err) => {
		console.error('Failed to connect MongoDB', err);
		process.exit(1);
	});


