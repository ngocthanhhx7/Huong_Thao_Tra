const { GoogleGenerativeAI } = require('@google/generative-ai');

const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';

const readEnv = (name) => (process.env[name] || '').trim();

const getGeminiApiKey = () => {
    return readEnv('GEMINI_API_KEY') || readEnv('GEMINI_API_KEY_1');
};

const getGeminiModelName = () => {
    return readEnv('GEMINI_MODEL') || DEFAULT_GEMINI_MODEL;
};

const createGeminiClient = () => {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
        throw new Error('Missing GEMINI_API_KEY in server/.env');
    }

    return new GoogleGenerativeAI(apiKey);
};

const getGeminiModel = (options = {}) => {
    return createGeminiClient().getGenerativeModel({
        ...options,
        model: getGeminiModelName(),
    });
};

module.exports = {
    getGeminiModel,
    getGeminiModelName,
};
