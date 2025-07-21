import { Request, Response } from 'express';
import User from '../../models/User';

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Helper for messages in English and Arabic
const messages = {
  allFields: {
    en: 'All fields are required.',
    ar: 'جميع الحقول مطلوبة.'
  },
  userExists: {
    en: 'User already exists.',
    ar: 'المستخدم موجود بالفعل.'
  },
  registered: {
    en: 'User registered successfully.',
    ar: 'تم تسجيل المستخدم بنجاح.'
  },
  invalid: {
    en: 'Invalid credentials.',
    ar: 'بيانات الاعتماد غير صحيحة.'
  },
  login: {
    en: 'Login successful.',
    ar: 'تم تسجيل الدخول بنجاح.'
  },
  notFound: {
    en: 'User not found.',
    ar: 'المستخدم غير موجود.'
  },
  updated: {
    en: 'Settings updated.',
    ar: 'تم تحديث الإعدادات.'
  },
  error: {
    en: 'Server error.',
    ar: 'خطأ في الخادم.'
  }
};

function getMsg(key: keyof typeof messages, lang: 'en' | 'ar' = 'en') {
  const msg = messages[key];
  return lang === 'ar' ? msg.ar : msg.en;
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: getMsg('allFields',  'en') });
    return;
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: getMsg('userExists',  'en') });
      return;
    }
        // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({  email, password: hashedPassword , language:  'en' });
    await newUser.save();
    console.log("New user registered:", newUser);
  const secret = process.env.JWT_SECRET!;
    // Generate token
    const token = jwt.sign(
      { userId: newUser._id, user: newUser.email },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: getMsg('error',  'en') });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
   // const { email, password, language } = req.body;
  //const lang = language === 'ar' ? 'ar' : 'en';
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: getMsg('invalid','en') });
      return;
    }
    const lang = user.language === 'ar' ? 'ar' : 'en';
    //res.json({ message: getMsg('login', lang), user: { name: user.name, email: user.email, type: user.type } });
     // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
          return;
      }
      const secret = process.env.JWT_SECRET!;
      // Generate token
      const token = jwt.sign(
        { userId: user._id, username: user.email },
        secret,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token ,user:{email: user.email, _id: user.id, language: user.language} });
  } catch (err) {
    res.status(500).json({ message: getMsg('error', 'en') });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  //const { email, language } = req.query;
  //const lang = language === 'ar' ? 'ar' : 'en';
  try {
    const user = await User.findOne({ _id:(req as any).user?.userId });
    if (!user) {
      res.status(404).json({ message: getMsg('notFound', 'en') });
      return;
    }
    res.json({  email: user.email, type: user.type,image: user.image, language: user.language });
  } catch (err) {
    res.status(500).json({ message: getMsg('error', 'en') });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const {  language } = req.body;
  const lang = language === 'ar' ? 'ar' : 'en';
  try {
    const user = await User.findOne({ _id:(req as any).user?.userId });
    if (!user) {
      res.status(404).json({ message: getMsg('notFound', lang) });
      return;
    }
    if (language) user.language = lang;
    await user.save();
    res.json({ message: getMsg('updated', lang), language: user.language });
  } catch (err) {
    res.status(500).json({ message: getMsg('error', lang) });
  }
};
