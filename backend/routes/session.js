const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Create a new session
router.post('/', async (req, res) => {
    try {
        const session = new Session(req.body);
        await session.save();
        res.status(201).json(session);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all sessions
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find().populate('course participants');
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single session by ID
router.get('/:id', async (req, res) => {
    try {
        const session = await Session.findById(req.params.id).populate('course participants');
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update session
router.put('/:id', async (req, res) => {
    try {
        const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSession);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete session
router.delete('/:id', async (req, res) => {
    try {
        await Session.findByIdAndDelete(req.params.id);
        res.json({ message: 'Session deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
