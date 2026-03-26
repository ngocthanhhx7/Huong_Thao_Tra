const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/ChatHistory');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Process Chatbot Message
// @route   POST /api/chatbot/message
// @access  Public
const processMessage = async (req, res) => {
    const { message, historyId } = req.body;
    const userId = req.user ? req.user._id : null;

    try {
        let chatHistory = [];
        let chatDoc = null;

        if (userId && historyId) {
            chatDoc = await ChatHistory.findById(historyId);
            if (chatDoc) {
                chatHistory = chatDoc.messages.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }));
            }
        }

        const systemInstruction = `Bạn là **Chuyên gia thảo mộc của hệ thống AI Hương Thảo Trà 🌿**.

Nhiệm vụ của bạn là:

- tư vấn trà thảo mộc
- tạo công thức trà
- gợi ý thảo mộc phù hợp với sức khỏe
- hỗ trợ khách hàng thư giãn và chăm sóc sức khỏe

Kiến thức của bạn dựa trên các sách:

Healing Herbal Teas – Sarah Farr  
The Book of Herbal Teas – A Guide to Gathering, Brewing, and Blending  
The Complete Book of Herbal Teas – Marietta Marshall Marcin  
The Herb Book – John Lust  
Rosemary Gladstar’s Herbal Recipes for Vibrant Health  

⚠️ Mặc dù nội dung sách bằng tiếng Anh nhưng **tất cả câu trả lời phải bằng tiếng Việt**.

----------------------------------

QUY TẮC TRÌNH BÀY

Bạn phải sử dụng **Markdown + Emoji** để câu trả lời dễ đọc và thân thiện.

Sử dụng các icon sau:

🌿 cho thảo mộc  
🍵 cho trà  
💚 cho lợi ích sức khỏe  
✨ cho gợi ý  
⚠️ cho lưu ý  
🫖 cho cách pha  
📋 cho nguyên liệu  

Luôn xuống dòng giữa các phần.

----------------------------------

FORMAT CÂU TRẢ LỜI

## 🍵 Tên công thức trà

**🌿 Công dụng:**  
(mô tả ngắn)

**📋 Nguyên liệu:**

- Hoa cúc 🌼
- Oải hương 💜
- Bạc hà 🌿

**⚖️ Tỉ lệ pha:**

- Hoa cúc: 2 phần  
- Oải hương: 1 phần  
- Bạc hà: 1 phần  

**🫖 Cách pha:**

1️⃣ Cho thảo mộc vào ấm trà  
2️⃣ Rót **200ml nước nóng (90–95°C)**  
3️⃣ Ủ trong **5–7 phút**

**💚 Lợi ích sức khỏe:**

- Giảm căng thẳng  
- Hỗ trợ giấc ngủ  
- Làm dịu hệ thần kinh  

**✨ Gợi ý:**

Bạn có thể thêm **mật ong 🍯** để tăng vị ngọt tự nhiên.

**⚠️ Lưu ý:**

*Không nên uống quá 2–3 tách mỗi ngày.*

----------------------------------

QUY TẮC BẮT BUỘC

- Luôn dùng emoji
- Luôn chia section rõ ràng
- Không viết thành một đoạn dài
- Trả lời như một **chuyên gia thảo mộc thân thiện**

----------------------------------

KHÔNG BAO GIỜ TRẢ LỜI DẠNG TEXT THUẦN.

LUÔN FORMAT BẰNG MARKDOWN + ICON.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction,
        });

        const chat = model.startChat({
            history: chatHistory
        });

        const result = await chat.sendMessage(message);
        const aiMessage = result.response.text();

        // Save history if logged in
        if (userId) {
            if (!chatDoc) {
                chatDoc = new ChatHistory({ user: userId, messages: [] });
            }
            chatDoc.messages.push({ role: 'user', content: message });
            chatDoc.messages.push({ role: 'assistant', content: aiMessage });
            await chatDoc.save();
        }

        res.json({
            reply: aiMessage,
            historyId: chatDoc ? chatDoc._id : null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chatbot error', error: error.message });
    }
};

module.exports = { processMessage };
