const express = require ('events');
const router = express.Router();
const {
    createDocument,
    getMyDocs,
    getDocumentById,
    updateDocument,
    deleteDocument,
} = require ('../controllers/documentController');

const {protect} = require ('../middleware/authMiddleware');


router.use(protect);

router.post('/',createDocument);
router.get('/',getMyDocs);
router.get('/:id',getDocumentById);
router.update('/:id',updateDocument);
router.delete('/:id',deleteDocument);