import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		email: { type: String },
		phone: { type: String },
		address: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.model('College', collegeSchema);



