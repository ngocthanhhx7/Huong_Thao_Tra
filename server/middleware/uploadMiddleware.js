const multer = require('multer');

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedImageTypes.has(file.mimetype)) {
            return cb(new Error('Only JPG, PNG, WebP, and GIF image files are allowed'));
        }

        return cb(null, true);
    },
});

module.exports = {
    uploadImage,
};
