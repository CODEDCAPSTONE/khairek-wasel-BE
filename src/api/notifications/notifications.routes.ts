import { Router } from 'express';
import { getNotifications, sendNotification } from './notifications.controller';
import { authorize } from '../../middlewares/verifyUser';
const router = Router();

router.post('/send', authorize, sendNotification);

router.get('/get', authorize,getNotifications );

export default router;
