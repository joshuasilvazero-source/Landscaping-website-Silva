require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error.message));

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  service: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });
bookingSchema.index({ date: 1, time: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/bookings/slots/:date', async (req, res) => {
  try {
    const bookings = await Booking.find({ date: req.params.date }).select('time -_id');
    const bookedTimes = bookings.map((booking) => booking.time);
    res.json({ bookedTimes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load booked slots.' });
  }
});
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load bookings.' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, service, date, time, notes } = req.body;

    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({ message: 'Please complete all required fields.' });
    }

    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.status(409).json({ message: 'That time slot is already booked. Please choose another.' });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      service,
      date,
      time,
      notes
    });
 try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'GreenScape Booking Confirmation',
        html: `
          <h2>Your appointment is confirmed</h2>
          <p>Hi ${name},</p>
          <p>Thanks for booking with GreenScape.</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p>We’ll reach out if we need any additional details.</p>
        `
      });
    } catch (emailError) {
      console.error('Email failed:', emailError.message);
    }

    res.status(201).json({
      message: 'Appointment booked successfully.',
      booking
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'That time slot is already booked. Please choose another.' });
    }

    console.error(error);
    res.status(500).json({ message: 'Failed to create booking.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});