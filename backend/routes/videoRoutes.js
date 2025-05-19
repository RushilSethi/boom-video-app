const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/Video');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/\s+/g, '_');
    const finalName = `${Date.now()}-${originalName}`;
    cb(null, finalName);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { title, userId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newVideo = new Video({
      title,
      filename: req.file.filename,
      userId,
    });

    await newVideo.save();
    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/like/:videoId', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.likes += 1;
    await video.save();

    res.json({ message: 'Video liked', likes: video.likes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
