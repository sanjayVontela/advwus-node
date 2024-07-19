import User from "../models/user.js";
import multer from "multer";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileNameWithoutExt = path.basename(file.originalname, ext);
        // let newFileName = file.originalname;

        const filePath = path.join(__dirname, 'images/', file.originalname);
        let newFileName = `${fileNameWithoutExt}_${Date.now()}${ext}`;
        cb(null, newFileName);
    }
});

export const upload = multer({ storage: storage });

export const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const imgURL = `http://localhost:4444/images/${req.file.filename}`;
    await User.findOneAndUpdate({ username: req.user.username }, { profilePic: imgURL });
    return res.json({ message: 'Image uploaded successfully', imgURL });
};
