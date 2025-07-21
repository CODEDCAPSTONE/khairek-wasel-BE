import { Request, Response } from 'express';
import Food from '../../models/Food';

// Helper for messages in English and Arabic
const messages = {
  allFields: {
    en: 'All fields are required.',
    ar: 'جميع الحقول مطلوبة.'
  },
  provided: {
    en: 'Item provided successfully.',
    ar: 'تم إضافة العنصر بنجاح.'
  },
  server: {
    en: 'Server error.',
    ar: 'خطأ في الخادم.'
  }
};
function getMsg(key: keyof typeof messages, lang: 'en' | 'ar' = 'en') {
  const msg = messages[key];
  return lang === 'ar' ? msg.ar : msg.en;
}

// Food item controller: provide, receptor, CRUD, image upload, location
export const provideFood = async (req: Request, res: Response): Promise<void> => {
  const { details, quantity, address, location,contact } = req.body;
     const status='available';
     const provider=(req as any).user?.userId;
  console.log( req.body);
  console.log("req.file : ",req.file);
  console.log("provider : ",provider);
  //const lang = language === 'ar' ? 'ar' : 'en';
  if (!details || !quantity || !address|| !location|| !contact|| !provider ) {
    res.status(400).json({ message: getMsg('allFields', 'en') });
    return;
  }
  try {
    const image =req.file? req.file.filename: null; // Handle optional image
    const newItem = new Food({ details, quantity, address, location,contact,provider,status  ,image});
    await newItem.save();
    res.status(201).json({ message: getMsg('provided', 'en'), item: newItem });
  } catch (err) {
    res.status(500).json({ message: getMsg('server', 'en') });
  }
};

export const listFoodForReceptor = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Food.find()
      .sort({ createdAt: -1 })
      .populate('provider', 'name email')   // populate only name & email
      .populate('receiver', 'name email');  // if receiver is assigned

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: getMsg('server') });
  }
};
 export const updateFoodReceiver = async (req: Request, res: Response): Promise<void> => {
  const { itemId, receiver } = req.body;

  if (!itemId || !receiver) {
    res.status(400).json({ message: getMsg('allFields', 'en') });
    return;
  }

  try {
    const updatedItem = await Food.findByIdAndUpdate(
      itemId,
      {
        receiver: receiver,
        status: 'unavailable'
      },
      { new: true } // Return the updated document
    ).populate('provider', 'name email').populate('receiver', 'name email');

    if (!updatedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.status(200).json({ message: 'Receiver updated successfully', item: updatedItem });
  } catch (err) {
    res.status(500).json({ message: getMsg('server') });
  }
};

export const listMyFoodCollections = async (req: Request, res: Response): Promise<void> => {
  try {
     const { itemType } = req.body;
     const receiver=(req as any).user?.userId;
    const items = await Food.find({ receiver })
      .sort({ createdAt: -1 })
      .populate('provider', 'name email')   // populate only name & email
      .populate('receiver', 'name email');  // if receiver is assigned

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: getMsg('server') });
  }
};
export const listMyFoodDonations = async (req: Request, res: Response): Promise<void> => {
  try {
     const { itemType } = req.body;
     const provider=(req as any).user?.userId;
    const items = await Food.find({ provider })
      .sort({ createdAt: -1 })
      .populate('provider', 'name email')   // populate only name & email
      .populate('receiver', 'name email');  // if receiver is assigned

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: getMsg('server') });
  }
};