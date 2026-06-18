const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const path = require('path');
const { randomUUID } = require('crypto');

const REQUIRED_ENV = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET'];

const getMissingAwsEnv = () => REQUIRED_ENV.filter((key) => !process.env[key]);

const createS3Client = () =>
    new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

const extensionByMimeType = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
};

const sanitizeFolder = (folder) => {
    if (['teas', 'ingredients', 'posts'].includes(folder)) {
        return folder;
    }

    return 'misc';
};

const buildObjectKey = (folder, file) => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const fallbackExt = extensionByMimeType[file.mimetype] || '.jpg';
    const originalExt = path.extname(file.originalname || '').toLowerCase();
    const ext = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(originalExt)
        ? originalExt.replace('.jpeg', '.jpg')
        : fallbackExt;

    return `uploads/${sanitizeFolder(folder)}/${year}/${month}/${randomUUID()}${ext}`;
};

const buildPublicUrl = (key) => {
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;

    if (region === 'us-east-1') {
        return `https://${bucket}.s3.amazonaws.com/${key}`;
    }

    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

const uploadImageToS3 = async ({ file, folder }) => {
    const missingEnv = getMissingAwsEnv();

    if (missingEnv.length) {
        const error = new Error(`Missing AWS S3 configuration: ${missingEnv.join(', ')}`);
        error.statusCode = 500;
        throw error;
    }

    const key = buildObjectKey(folder, file);
    const bucket = process.env.AWS_S3_BUCKET;
    const acl = process.env.S3_OBJECT_ACL || 'public-read';
    const client = createS3Client();

    const commandInput = {
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    if (acl) {
        commandInput.ACL = acl;
    }

    try {
        await client.send(new PutObjectCommand(commandInput));
    } catch (error) {
        if (commandInput.ACL && ['AccessControlListNotSupported', 'InvalidRequest'].includes(error.name)) {
            delete commandInput.ACL;
            await client.send(new PutObjectCommand(commandInput));
        } else {
            throw error;
        }
    }

    return {
        bucket,
        key,
        url: buildPublicUrl(key),
    };
};

module.exports = {
    uploadImageToS3,
};
