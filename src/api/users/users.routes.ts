import { Router } from 'express';
import { registerUser, loginUser, getProfile, updateSettings } from './users.controller';
import { upload } from '../../middlewares/multer.middleware';
import { authorize } from '../../middlewares/verifyUser';
const router = Router();

router.post('/register', upload.single('image'), registerUser);
router.post('/login', loginUser);
router.get('/profile', authorize, upload.single('image'), getProfile);
router.put('/settings', authorize, updateSettings);

export default router;
