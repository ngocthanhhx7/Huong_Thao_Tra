const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: "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"
});

async function main() {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Hello" }],
            model: "gpt-4o-mini",
        });
        console.log("Success:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
