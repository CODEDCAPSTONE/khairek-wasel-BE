import { Request, Response } from 'express';
import Notification from '../../models/Notification'; // adjust the path

const messages = {
  allFields: {
    en: 'All fields are required.',
    ar: 'جميع الحقول مطلوبة.',
  },
  sent: {
    en: 'Notification sent.',
    ar: 'تم إرسال الإشعار.',
  },
  server: {
    en: 'Server error.',
    ar: 'خطأ في الخادم.',
  },
};

function getMsg(key: keyof typeof messages, lang: 'en' | 'ar' = 'en') {
  const msg = messages[key];
  return lang === 'ar' ? msg.ar : msg.en;
}

//  Send Notification
export const sendNotification = async (req: Request, res: Response): Promise<void> => {
  const { provider,receiver,itemType,itemId,message } = req.body;

  if (!provider||!receiver || !itemType || !itemId || !message) {
    res.status(400).json({ message: getMsg('allFields', 'en') });
    return;
  }

  try {
    const newNotification = new Notification({
provider,receiver,itemType,itemId,message
    });

    await newNotification.save();
    res.status(201).json({ message: getMsg('sent', 'en') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: getMsg('server', 'en') });
  }
};

//  Get Notifications
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
//   const { userId } =(req as any).user?.userId;
// console.log("userId : ",userId);
//   const { user } =(req as any).user;
// console.log("user : ",user);
  if (!(req as any).user?.userId) {
    res.status(400).json({ message: getMsg('allFields', 'en') });
    return;
  }

  try {
    const notifications = await Notification.find({ provider: (req as any).user?.userId });
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: getMsg('server', 'en') });
  }
};
