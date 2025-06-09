import { Router } from 'express';
import { verifyJWT } from '../middleware/auth';


const router = Router();

router.use(verifyJWT);

// create note
router.post('/notes', (req, res) => {
    res.send('create note');});
// update note
router.put('/notes/:id', (req, res) => {
    res.send('update note');
})
// delete note
router.delete('/notes/:id', (req, res) => {
    res.send('delete note');
})
// get one note
router.get('/notes/:id', (req, res) => {
    res.send('get one note');
})
// notes-list - get all notes
router.get('/notes', (req, res) => {
    res.send('get all notes');
})
// notes-search (query)
router.get('/notes/search', (req, res) => {
    res.send('search notes');
})


export default router;