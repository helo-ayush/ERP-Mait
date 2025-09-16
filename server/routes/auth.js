import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import College from '../models/College.js';

const router = Router();

const signJwt = (payload) =>
	jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

router.post('/signup', async (req, res) => {
	try {
		const { role, name, email, phone, password, collegeId, department, qualification, college } = req.body;
		if (!role || !name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

		const exists = await User.findOne({ email });
		if (exists) return res.status(409).json({ error: 'Email already in use' });

		// Admin can create college on signup (if provided)
		if (role === 'admin' && college?.id) {
			const existingCollege = await College.findOne({ id: college.id });
			if (existingCollege) return res.status(409).json({ error: 'College ID already exists' });
			await College.create({ id: college.id, name: college.name, email: college.email, phone: college.phone, address: college.address });
		}

		const passwordHash = await User.hashPassword(password);
		const user = await User.create({
			name,
			email,
			phone,
			passwordHash,
			role,
			collegeId,
			department,
			qualification,
			approved: role !== 'teacher' ? true : false,
		});

		const token = signJwt({ id: user._id, role: user.role, email: user.email });
		res.json({ token, user });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Server error' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ error: 'User not found' });
		const ok = await user.comparePassword(password);
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
		if (user.role === 'teacher' && !user.approved) return res.status(403).json({ error: 'Teacher pending approval' });

		const token = signJwt({ id: user._id, role: user.role, email: user.email });
		res.json({ token, user });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Server error' });
	}
});

router.post('/approve-teacher', async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOneAndUpdate({ email, role: 'teacher' }, { approved: true }, { new: true });
		if (!user) return res.status(404).json({ error: 'Teacher not found' });
		res.json({ ok: true, user });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Server error' });
	}
});

export default router;



