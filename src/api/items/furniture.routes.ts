import { Router } from 'express';
import { provideFurniture, listFurnitureForReceptor, updateFurnitureReceiver, listMyFurnitureCollections, listMyFurnitureDonations } from './furniture.controller';
import { upload } from '../../middlewares/multer.middleware';
import { authorize } from '../../middlewares/verifyUser';
const router = Router();

router.post('/collect', authorize, updateFurnitureReceiver);
router.post('/provide', authorize, upload.single('image'), provideFurniture);
router.get('/receptor', authorize, listFurnitureForReceptor);
router.get('/donations', authorize, listMyFurnitureDonations);
router.get('/collections', authorize, listMyFurnitureCollections);

export default router;
