import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// List pending teachers for a college
router.get('/pending-teachers', async (req, res) => {
	try {
		const { collegeId } = req.query;
		const filter = { role: 'teacher', approved: false };
		if (collegeId) filter.collegeId = collegeId;
		const users = await User.find(filter).lean();
		res.json({ users });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Server error' });
	}
});

// List approved teachers for a college
router.get('/approved-teachers', async (req, res) => {
	try {
		const { collegeId } = req.query;
		const filter = { role: 'teacher', approved: true };
		if (collegeId) filter.collegeId = collegeId;
		const users = await User.find(filter).lean();
		res.json({ users });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Server error' });
	}
});

export default router;



