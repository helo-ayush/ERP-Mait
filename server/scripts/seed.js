import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import College from '../models/College.js';

// Load env from server/.env when run via npm scripts
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_erp';

async function run() {
	console.log('MONGODB_URI =', mongoUri);
	console.log('DB NAME =', process.env.MONGO_DB_NAME || 'college_erp');
	await mongoose.connect(mongoUri, { dbName: process.env.MONGO_DB_NAME || 'college_erp' });
	console.log('Connected to MongoDB for seeding');

	// Clean minimal (optional). Comment out if you don't want to wipe users.
	// await User.deleteMany({});
	// await College.deleteMany({});

	// Ensure college
	const collegeId = 'DEMO-COL-2025';
	let college = await College.findOne({ id: collegeId });
	if (!college) {
		college = await College.create({
			id: collegeId,
			name: 'Demo College',
			email: 'contact@demo-college.edu',
			phone: '+91 90000 00000',
			address: '123 Demo Street, City, State, 000000',
		});
		console.log('Created college:', college.id);
	} else {
		console.log('College already exists:', college.id);
	}

	const beforeUsers = await User.countDocuments({});
	const beforeColleges = await College.countDocuments({});
	console.log('Before -> users:', beforeUsers, 'colleges:', beforeColleges);

	// Users
	const ensureUser = async ({ name, email, role, password, phone, department, qualification, approved }) => {
		let user = await User.findOne({ email });
		if (user) { console.log('User exists:', email); return user; }
		const passwordHash = await User.hashPassword(password);
		user = await User.create({
			name,
			email,
			phone,
			role,
			passwordHash,
			collegeId: college.id,
			department,
			qualification,
			approved: approved ?? (role !== 'teacher'),
		});
		console.log('Created user:', role, email);
		return user;
	};

	await ensureUser({ name: 'Admin User', email: 'admin@demo.edu', role: 'admin', password: 'Admin@1234', phone: '+91 91111 11111' });
	await ensureUser({ name: 'Approved Teacher', email: 'teacher@demo.edu', role: 'teacher', password: 'Teacher@1234', phone: '+91 92222 22222', department: 'Computer Science', qualification: 'M.Tech', approved: true });
	await ensureUser({ name: 'Pending Teacher', email: 'pending.teacher@demo.edu', role: 'teacher', password: 'Teacher@1234', phone: '+91 93333 33333', department: 'Mathematics', qualification: 'M.Sc', approved: false });
	await ensureUser({ name: 'Student User', email: 'student@demo.edu', role: 'student', password: 'Student@1234', phone: '+91 94444 44444' });

	const afterUsers = await User.countDocuments({});
	const afterColleges = await College.countDocuments({});
	console.log('After -> users:', afterUsers, 'colleges:', afterColleges);
	console.log('Seeding complete.');
	await mongoose.disconnect();
}

run().catch(async (e) => {
	console.error(e);
	try { await mongoose.disconnect(); } catch {}
	process.exit(1);
});


