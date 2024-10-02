const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const app = express();
const port = 3000;

dotenv.config();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/exchange-rate/:selectFrom", async (req, res) => {
    const apiKey = process.env.API_KEY;
    const selectFrom = req.params.selectFrom;
    
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${selectFrom}`);
        const data = await response.json();
        res.json(data);
    }
    catch(error) {
        res.send(error.message);
    }
});

app.get("/flag/:flagCode", (req, res) => {
    const flagCode = req.params.flagCode;
    
    const flagURL = `https://flagsapi.com/${flagCode}/flat/64.png`;
    res.json({flagURL});
});

app.listen(port, () => console.log(`Server running on port ${port}`));