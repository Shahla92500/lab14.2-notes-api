const router = require('express').Router();
const Note = require('../models/Notes');
const { authMiddleware } = require('../middlewares/auth');
 
// Apply authMiddleware to all routes in this file
router.use(authMiddleware);
 
// GET /api/notes - Get all notes for the logged-in user:
router.get('/', async (req, res) => {

try {
    const notes = await Note.find({user: req.user._id}); // It should find notes owned by the logged in user.
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      user: req.user._id // Save the user’s _id to the new note’s user field.
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {

try {
    const noteOne = await Note.findOne({user: req.params.id}); // It should find notes owned by the logged in user.
    if (req.params.id !== noteOne._id) {
        return res.status(403).json({message:"any note is not found for this user"})
    }
    res.json(noteOne);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    // This needs an authorization check
    const noteToUpdate = await Note.findById(req.params.id);

    if (req.user._id !== noteToUpdate.user.toString()){
        return res.status(403).json({message:"User is not authorized to update this note"})
    }
    
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    // This needs an authorization check
    const noteToDelete = await Note.findById(req.params.id)
    if (req.params.id != noteToDelete._id) {
        return res.status(403).json({message:"User is not authorized to delete this note"})
    }
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }
    res.json({ message: 'Note deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});
 
module.exports = router;