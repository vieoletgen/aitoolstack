const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "tools-data.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const initialData = {
    tools: [
        { id: 1, name: "ChatGPT Plus", category: "writing", pricing: "Freemium", priceVal: 20, desc: "Advanced reasoning, custom GPTs, and multi-modal capabilities.", link: "https://openai.com", badge: "Most Popular", clicks: 0 },
        { id: 2, name: "Claude 3.5 Sonnet", category: "writing", pricing: "Freemium", priceVal: 20, desc: "Industry-leading coding assistant with Artifacts and deep nuance.", link: "https://anthropic.com", badge: "Best for Coding", clicks: 0 },
        { id: 3, name: "Midjourney v6", category: "productivity", pricing: "Paid", priceVal: 30, desc: "The premier AI image generator for hyper-realistic and artistic visuals.", link: "https://midjourney.com", badge: "Top Visuals", clicks: 0 },
        { id: 4, name: "Zapier Central", category: "automation", pricing: "Freemium", priceVal: 29, desc: "Automate complex workflows and connect thousands of web apps using AI.", link: "https://zapier.com", badge: "Best Automation", clicks: 0 }
    ],
    reviews: [
        { name: "Alex M.", comment: "The AI Stack cost calculator saved me over \$50/month on unnecessary subscriptions!", rating: 5 },
        { name: "Sarah K.", comment: "Super clean interface and the AI Matcher Quiz recommended the exact tool I needed.", rating: 5 }
    ]
};

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/data", (req, res) => {
    const data = readData();
    res.json(data);
});

app.post("/api/tools", (req, res) => {
    const { name, category, pricing, priceVal, desc, link, badge } = req.body;
    const data = readData();
    const newTool = {
        id: Date.now(),
        name,
        category,
        pricing,
        priceVal: parseFloat(priceVal) || 0,
        desc,
        link,
        badge: badge || "New",
        clicks: 0
    };
    data.tools.push(newTool);
    saveData(data);
    res.json({ success: true, tool: newTool });
});

app.post("/api/track/:id", (req, res) => {
    const toolId = parseInt(req.params.id);
    const data = readData();
    const tool = data.tools.find(t => t.id === toolId);
    if (tool) {
        tool.clicks = (tool.clicks || 0) + 1;
        saveData(data);
        res.json({ success: true, clicks: tool.clicks });
    } else {
        res.status(404).json({ success: false, message: "Tool not found" });
    }
});

app.post("/api/reviews", (req, res) => {
    const { name, comment, rating } = req.body;
    const data = readData();
    data.reviews.unshift({ name, comment, rating: parseInt(rating) || 5 });
    saveData(data);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`AIToolstack Ultimate Server is running on http://localhost:${PORT}`);
});
