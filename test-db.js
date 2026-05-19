require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};
connectDB().then(async () => {
  const blogs = await mongoose.connection.db.collection('blogs').find().sort({ createdAt: -1 }).limit(1).toArray();
  console.log(blogs[0].content.substring(0, 500));
  process.exit();
});
