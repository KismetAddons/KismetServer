require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Allow requests from your mod

// Load the webhook URL from environment variables (DO NOT hardcode it!)
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

// Handle POST requests to /send
app.post("/send", async (req, res) => {
    const { username, message } = req.body;

    // Validate input
    if (!username || !message) {
        return res.status(400).json({ error: "Missing username or message" });
    }

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: `**User:** \`${username}\`\n**IGN:** \`${message}\``,
                username: "Minecraft Bot",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send message to Discord");
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server on port 3000
app.listen(3000, () => console.log("Proxy running on http://localhost:3000"));