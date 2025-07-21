import { Router } from 'express';
import { provideFood, listFoodForReceptor, updateFoodReceiver, listMyFoodDonations, listMyFoodCollections } from './food.controller';
import { upload } from '../../middlewares/multer.middleware';
import { authorize } from '../../middlewares/verifyUser';
const router = Router();

router.post('/collect', authorize, updateFoodReceiver);
router.post('/provide', authorize, upload.single('image'), provideFood); // Provider adds food with image upload
router.get('/receptor', authorize, listFoodForReceptor); // Receptor views food
router.get('/donations', authorize, listMyFoodDonations);
router.get('/collections', authorize, listMyFoodCollections);

export default router;
