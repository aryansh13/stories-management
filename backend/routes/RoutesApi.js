import express from 'express';
import { getStoriesList, getStoryById, createStory, updateStory, deleteStory } from '../controllers/StoriesListController.js';
import { getChapterById, createChapter, updateChapter, deleteChapter } from '../controllers/ChapterController.js';
import { getCategory } from '../controllers/CategoryController.js';
import { getStatus } from '../controllers/StatusController.js';
import { getTags } from '../controllers/TagsController.js';

const router = express.Router();

//Routes for stories
router.get('/stories', getStoriesList);
router.get('/stories/:id', getStoryById);
router.post('/stories', createStory);
router.put('/stories/:id', updateStory);
router.delete('/stories/:id', deleteStory);

//Routes for chapters
router.get('/chapters/:id', getChapterById);
router.post('/chapters', createChapter);
router.put('/chapters/:id', updateChapter);
router.delete('/chapters/:id', deleteChapter);

//Routes for category
router.get('/category', getCategory);

//Routes for Status
router.get('/status', getStatus);

//Routes for tags
router.get('/tags', getTags);

export default router;
