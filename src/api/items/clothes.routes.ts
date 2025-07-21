import { Router } from 'express';
import { provideClothes, listClothesForReceptor,updateClothesReceiver, listMyClothDonations, listMyClothCollections } from './clothes.controller';
import { upload } from '../../middlewares/multer.middleware';
import { authorize } from '../../middlewares/verifyUser';
const router = Router();

router.post('/collect', authorize, updateClothesReceiver);
router.post('/provide', authorize, upload.single('image'), provideClothes);
router.get('/receptor', authorize, listClothesForReceptor);
router.get('/donations', authorize, listMyClothDonations);
router.get('/collections', authorize, listMyClothCollections);

export default router;
