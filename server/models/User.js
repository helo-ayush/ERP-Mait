import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, index: true },
		phone: { type: String },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
		collegeId: { type: String },
		department: { type: String },
		qualification: { type: String },
		approved: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

userSchema.methods.comparePassword = function (plain) {
	return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plain) {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(plain, salt);
};

export default mongoose.model('User', userSchema);



