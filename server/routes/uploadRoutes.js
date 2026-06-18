const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');
const { uploadImageToS3 } = require('../utils/s3Upload');

const router = express.Router();

const folderPermissions = {
    teas: ['Admin'],
    ingredients: ['Admin'],
    posts: ['Admin', 'Staff'],
};

const canUploadToFolder = (user, folder) => {
    const allowedRoles = folderPermissions[folder];

    if (!allowedRoles) {
        return false;
    }

    return allowedRoles.includes(user?.role);
};

router.post('/image', protect, (req, res) => {
    uploadImage.single('image')(req, res, async (error) => {
        if (error) {
            const statusCode = error instanceof multer.MulterError ? 400 : 400;
            const message = error.code === 'LIMIT_FILE_SIZE'
                ? 'Image file must be 5MB or smaller'
                : error.message;

            return res.status(statusCode).json({ message });
        }

        try {
            const { folder } = req.body;

            if (!canUploadToFolder(req.user, folder)) {
                return res.status(403).json({ message: 'Not authorized to upload images to this folder' });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'Image file is required' });
            }

            const uploaded = await uploadImageToS3({
                file: req.file,
                folder,
            });

            return res.status(201).json(uploaded);
        } catch (uploadError) {
            const statusCode = uploadError.statusCode || 500;
            return res.status(statusCode).json({
                message: uploadError.statusCode
                    ? uploadError.message
                    : `Could not upload image to S3: ${uploadError.message}`,
            });
        }
    });
});

module.exports = router;
