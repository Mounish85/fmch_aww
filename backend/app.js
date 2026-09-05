const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();


// ==================== CONTROLLERS ====================

const {
    getUser,
    updateUser,
    updateLanguagePreference,
} = require("./controllers/userController");

const {
    createBeneficiary,
    getBeneficiaries,
    getBeneficiaryById,
    updateBeneficiary,
    deleteBeneficiary,
} = require("./controllers/beneficiaryController");

const {
    createCounselling,
    getCounsellings,
    getCounsellingById,
    updateCounselling,
} = require("./controllers/counsellingController");


// ==================== AUTH ====================

const authRoutes = require("./routes/authRoutes");

const {
    requireAuth,
} = require("./middleware/authMiddleware");


// ==================== MIDDLEWARE ====================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000"
        ],
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


// ==================== HOME ROUTE ====================

app.get("/", (req, res) => {
    res.send("Welcome to FMCH!");
});


// ==================== AUTH ROUTES ====================

// Signup
app.use("/api/auth", authRoutes);


// ==================== USER ROUTES ====================

// Every user route below requires authentication

app.get(
    "/api/users/:id",
    requireAuth,
    getUser
);

app.put(
    "/api/users/:id",
    requireAuth,
    updateUser
);

app.patch(
    "/api/users/:id/language",
    requireAuth,
    updateLanguagePreference
);


// ==================== BENEFICIARY ROUTES ====================

// Every beneficiary route requires authentication

app.post(
    "/api/beneficiaries",
    requireAuth,
    createBeneficiary
);

app.get(
    "/api/beneficiaries",
    requireAuth,
    getBeneficiaries
);

app.get(
    "/api/beneficiaries/:id",
    requireAuth,
    getBeneficiaryById
);

app.put(
    "/api/beneficiaries/:id",
    requireAuth,
    updateBeneficiary
);

app.delete(
    "/api/beneficiaries/:id",
    requireAuth,
    deleteBeneficiary
);


// ==================== COUNSELLING ROUTES ====================

// Every counselling route requires authentication

app.post(
    "/api/counselling",
    requireAuth,
    createCounselling
);

app.get(
    "/api/counselling",
    requireAuth,
    getCounsellings
);

app.get(
    "/api/counselling/:id",
    requireAuth,
    getCounsellingById
);

app.put(
    "/api/counselling/:id",
    requireAuth,
    updateCounselling
);


// ==================== TRANSLATION ROUTE ====================

app.post(
    "/api/translate",
    requireAuth,
    async (req, res) => {
        try {
            const { text, recommendation, source_language, target_language } = req.body;
            const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

            const mlResponse = await fetch(`${ML_SERVICE_URL}/api/ml/translate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text,
                    recommendation,
                    source_language: source_language || "en",
                    target_language: target_language || "en",
                }),
            });

            if (!mlResponse.ok) {
                const errText = await mlResponse.text();
                return res.status(500).json({
                    success: false,
                    message: "ML translation service failed",
                    error: errText,
                });
            }

            const data = await mlResponse.json();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to translate recommendation",
                error: error.message,
            });
        }
    }
);


// ==================== TTS AUDIO STREAM ROUTE ====================

app.get("/api/tts", async (req, res) => {
    try {
        const { text, lang } = req.query;
        if (!text || !text.trim()) {
            return res.status(400).send("Text parameter is required");
        }

        const cleanText = text.replace(/[*_~`#[\]"']/g, "").trim().slice(0, 500);
        const tl = lang || "en-IN";
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${tl}&client=tw-ob`;

        const audioResponse = await fetch(ttsUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        if (!audioResponse.ok) {
            return res.status(502).send("TTS audio fetch failed");
        }

        res.set("Content-Type", "audio/mpeg");
        res.set("Cache-Control", "public, max-age=86400");
        const buffer = await audioResponse.arrayBuffer();
        return res.send(Buffer.from(buffer));
    } catch (err) {
        return res.status(500).send(err.message);
    }
});


// ==================== DATABASE CONNECTION ====================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB!");

        app.listen(
            process.env.PORT || 3000,
            () => {
                console.log(
                    `Server running on port ${
                        process.env.PORT || 3000
                    }`
                );
            }
        );
    })
    .catch((err) => {
        console.log(err);
    });