// backend/server.js - COMPLETE VERSION WITH HISTORY & CONTEXT
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ========== SUPABASE CLIENT ==========
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL yoki Key topilmadi!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase client yaratildi');

// ========== GEMINI AI ==========
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI, model;

if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.85,           // ✅ Ko'proq ijodiy va har xil
        topP: 0.95,                  // ✅ Kengroq tanlov
        topK: 60,                    // ✅ Ko'proq variant
        maxOutputTokens: 350,        // ✅ Biraz uzunroq javob
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    });
    console.log('🤖 Google Gemini 1.5 Flash initialized!');
  } catch (error) {
    console.error('❌ Gemini init xatosi:', error);
  }
} else {
  console.warn('⚠️  Gemini API key topilmadi. AI funksiyasi ishlamaydi.');
}

// ========== CHAT HISTORY STORAGE ==========
// Memory storage for chat histories (productionda Redis yoki database ishlatish kerak)
const chatHistories = new Map(); // userId -> conversation array

// ========== EMAIL TRANSPORTER ==========
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('📧 Email service configured');
} else {
  console.warn('⚠️  Email service not configured (optional)');
}

// ========== HELPER FUNCTIONS ==========
function getOrCreateHistory(userId) {
  if (!chatHistories.has(userId)) {
    // ✅ TRAIN QILDIRILGAN BOSHLANG'ICH SUHBAT
    chatHistories.set(userId, [
      {
        role: 'system',
        content: `Siz Sherik Top (StartHub) platformasining AI yordamchisisiz. 
        Platforma startapchilar, tadbirkorlar va mutaxassislar uchun sherik topishga yordam beradi.
        O'zbek tilida tabiiy, do'stona va professional suhbat qiling.
        Har bir savolga mos javob bering, shablon bo'lmasin.`
      },
      {
        role: 'assistant', 
        content: 'Assalomu alaykum! Sherik Top platformasiga xush kelibsiz. Men sizga sherik topish va loyiha yaratishda yordam beraman. 😊'
      }
    ]);
  }
  return chatHistories.get(userId);
}

function formatHistoryForPrompt(history, maxMessages = 8) {
  // Faqat user va assistant xabarlarini olamiz
  const relevantHistory = history.filter(msg => 
    msg.role === 'user' || msg.role === 'assistant'
  ).slice(-maxMessages);
  
  return relevantHistory.map(msg => {
    const prefix = msg.role === 'user' ? 'Foydalanuvchi' : 'Yordamchi';
    return `${prefix}: ${msg.content}`;
  }).join('\n');
}

// ========== ROUTES ==========

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sherik Top Backend ishlamoqda! 🚀',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET  / - Server status',
      'POST /api/send-otp - Send OTP code',
      'POST /api/verify-otp - Verify OTP code',
      'POST /api/chat - Gemini AI chat with history',
      'POST /api/chat/clear - Clear chat history',
      'GET  /api/projects - Get all projects',
      'GET  /api/debug/otps - Debug OTP codes'
    ]
  });
});

// ========== OTP ENDPOINTS (same as before) ==========
app.post('/api/send-otp', async (req, res) => {
  console.log('📨 OTP yuborish so\'rovi:', req.body);
  
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email kerak' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
    
    const { data: insertData, error: dbError } = await supabase
      .from('otp_codes')
      .insert([{ 
        email: email.toLowerCase().trim(), 
        code: otp,
        expires_at: expiresAt.toISOString()
      }])
      .select();

    if (dbError) throw dbError;

    if (transporter) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Tasdiqlash kodi - Sherik Top',
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Sherik Top Tasdiqlash Kodi</h2>
            <p>Sizning OTP kodingiz:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #2563eb;">${otp}</h1>
            <p>Bu kod 10 daqiqa ichida amal qiladi.</p>
          </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email yuborildi: ${email}`);
      } catch (emailError) {
        console.error('❌ Email yuborishda xato:', emailError);
      }
    } else {
      console.log(`🧪 Test OTP for ${email}: ${otp}`);
    }
    
    res.json({ 
      success: true, 
      message: 'OTP yuborildi',
      data: { email, expires_at: expiresAt.toISOString() }
    });
  } catch (error) {
    console.error('❌ OTP yuborishda xato:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  console.log('🔍 OTP tekshirish:', req.body);
  
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ 
      success: false, 
      error: 'Email va OTP kod kerak' 
    });

    const now = new Date();
    const nowUTC = now.toISOString();
    
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('code', code.toString().trim())
      .eq('used', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'NO_OTP_FOUND',
        message: 'Noto\'g\'ri OTP kod' 
      });
    }
    
    const latestOTP = data[0];
    const expiresAt = new Date(latestOTP.expires_at);
    const currentTime = new Date(nowUTC);
    
    if (expiresAt < currentTime) {
      return res.status(400).json({ 
        success: false, 
        error: 'OTP_EXPIRED',
        message: 'OTP kod muddati tugagan'
      });
    }

    await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('id', latestOTP.id);

    res.json({ 
      success: true, 
      message: 'OTP tasdiqlandi',
      data: { email, verified_at: nowUTC, id: latestOTP.id }
    });
  } catch (error) {
    console.error('❌ OTP tekshirishda xato:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== GEMINI AI CHAT WITH HISTORY ========== 
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId = 'anonymous' } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.json({ 
        text: "Assalomu alaykum! Savolingizni yozing." 
      });
    }

    const userMessage = message.trim();
    console.log(`💬 User ${userId}: ${userMessage}`);

    // Agar Gemini mavjud bo'lmasa
    if (!model) {
      return res.json({ 
        text: "Assalomu alaykum! Sherik Top platformasiga xush kelibsiz." 
      });
    }

    // Chat tarixini olish
    const history = getOrCreateHistory(userId);
    
    // Yangi foydalanuvchi xabarini qo'shish
    history.push({ role: 'user', content: userMessage });
    
    // Tarixni cheklash (oxirgi 10 ta xabar + system prompt)
    while (history.length > 12) {
      // System prompt va birinchi assistant xabarini saqlab qolamiz
      if (history.length > 2 && history[1].role === 'assistant') {
        // System prompt (0-index) va birinchi salom (1-index) ni saqlaymiz
        const systemMsg = history[0];
        const firstAssistantMsg = history[1];
        history.splice(2, 1); // 3-elementdan boshqa hammasini o'chiramiz
        history[0] = systemMsg;
        history[1] = firstAssistantMsg;
      } else {
        history.splice(2, 1);
      }
    }

    // ✅ KUCHLI TRAIN QILDIRILGAN PROMPT
    const prompt = `Siz Sherik Top (StartHub) platformasining AI yordamchisisiz. 
    Foydalanuvchi bilan O'zbek tilida tabiiy suhbat qiling.
    
    **Sizning maqsadingiz:**
    1. Foydalanuvchiga sherik topishda yordam berish
    2. Loyiha yaratish bo'yicha maslahat berish
    3. Platformaning imkoniyatlari haqida ma'lumot berish
    4. Do'stona va professional munosabatda bo'lish
    
    **Suhbat tarixi:**
    ${formatHistoryForPrompt(history)}
    
    **Oxirgi foydalanuvchi savoli:** "${userMessage}"
    
    **Javob berish tamoyillari:**
    - Har bir savolga mos javob bering (shablon bo'lmasin)
    - O'zbek tilida gapiring
    - Qisqa va tushunarli bo'ling (1-4 jumla)
    - Foydalanuvchi bilan "siz" deb gaplashing
    - Platforma haqida ma'lumot bering (agar mos kelsa)
    - Tabiiy va insoniy munosabatda bo'ling
    
    **Misol (lekin aynan shunday emas, har xil bo'lsin):**
    - "Salom" → "Assalomu alaykum! Sherik Topga xush kelibsiz. Loyihangiz bormi?"
    - "Yaxshimisan?" → "Yaxshi, rahmat! 😊 Sizga qanday yordam bera olaman?"
    - "Loyiha qanday yarataman?" → "Loyiha yaratish uchun 'Yangi loyiha' tugmasini bosing. Nom, tavsif va kategoriyani kiriting."
    
    Endi "${userMessage}" savoliga mos va tabiiy javob bering:`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let aiResponse = response.text().trim();
      
      // Javobni tozalash
      if (!aiResponse) {
        aiResponse = "Kechirasiz, tushunmadim. Qayta savol bering.";
      }
      
      // Agar javob tili noto'g'ri bo'lsa
      if (aiResponse.toLowerCase().includes("i'm sorry") || 
          aiResponse.toLowerCase().includes("i cannot") ||
          aiResponse.toLowerCase().includes("as an ai")) {
        aiResponse = "Kechirasiz, men faqat Sherik Top platformasi haqida gaplasha olaman. Qanday yordam kerak?";
      }
      
      // AI javobini tarixga qo'shish
      history.push({ role: 'assistant', content: aiResponse });
      
      console.log(`🤖 AI to ${userId}: ${aiResponse.substring(0, 60)}...`);
      
      // ✅ FRONTEND GA HISTORY HAM YUBORISH (agar kerak bo'lsa)
      res.json({ 
        text: aiResponse,
        historyId: userId,
        timestamp: new Date().toISOString()
      });
      
    } catch (geminiError) {
      console.error('❌ Gemini API xatosi:', geminiError);
      
      // Context-aware fallback javob
      let fallbackResponse = "";
      const lowerMsg = userMessage.toLowerCase();
      
      if (lowerMsg.includes('salom') || lowerMsg.includes('assalom') || lowerMsg.includes('hi')) {
        fallbackResponse = "Assalomu alaykum! Sherik Top platformasiga xush kelibsiz. Qanday yordam bera olaman?";
      }
      else if (lowerMsg.includes('yaxshi') || lowerMsg.includes('hol') || lowerMsg.includes('ahvol')) {
        fallbackResponse = "Yaxshi, rahmat! 😊 Men AI yordamchiman, charchamayman. Sizga qanday yordam bera olaman?";
      }
      else if (lowerMsg.includes('loyiha') || lowerMsg.includes('project') || lowerMsg.includes('idea')) {
        fallbackResponse = "Loyiha yaratish uchun platformamizda 'Yangi loyiha' tugmasini bosing. Qaysi sohada loyihangiz bor?";
      }
      else if (lowerMsg.includes('sherik') || lowerMsg.includes('partner') || lowerMsg.includes('hamkor')) {
        fallbackResponse = "Sherik topish uchun loyihalar ro'yxatiga qarang yoki o'z loyihangizni yarating. Qaysi sohada sherik qidiryapsiz?";
      }
      else if (lowerMsg.includes('kim') || lowerMsg.includes('sen') || lowerMsg.includes('who')) {
        fallbackResponse = "Men Sherik Top platformasining AI yordamchisiman. Startapchilar va tadbirkorlarga sherik topishda yordam beraman.";
      }
      else if (lowerMsg.includes('nima') || lowerMsg.includes('what') || lowerMsg.includes('qanday')) {
        fallbackResponse = "Sherik Top - bu O'zbekistonlik startapchilar va tadbirkorlar uchun sherik topish platformasi. Loyiha yaratish yoki sherik qidirish uchun foydalanishingiz mumkin.";
      }
      else {
        fallbackResponse = "Savolingizni tushundim. Sherik Top platformasi haqida yordam kerak bo'lsa, so'rang.";
      }
      
      // Fallback javobni tarixga qo'shish
      history.push({ role: 'assistant', content: fallbackResponse });
      
      res.json({ 
        text: fallbackResponse,
        historyId: userId,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Chat endpoint xatosi:', error);
    res.status(500).json({ 
      text: "Kechirasiz, texnik muammo yuz berdi. Iltimos, keyinroq qayta urinib ko'ring." 
    });
  }
});

// Clear chat history
app.post('/api/chat/clear', (req, res) => {
  const { userId = 'anonymous' } = req.body;
  
  if (chatHistories.has(userId)) {
    chatHistories.delete(userId);
    console.log(`🗑️  Chat history cleared for user: ${userId}`);
  }
  
  res.json({ 
    success: true, 
    message: 'Chat tarixi tozalandi',
    userId 
  });
});

// ========== PROJECTS ENDPOINT ==========
app.get('/api/projects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('votes', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.error('❌ Projects xatosi:', err);
    res.status(500).json({ error: err.message });
  }
});

// Debug: Barcha OTP larni ko'rish
app.get('/api/debug/otps', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    res.json({
      success: true,
      count: data.length,
      data: data.map(item => ({
        ...item,
        is_expired: new Date(item.expires_at) < new Date(),
        time_left_ms: new Date(item.expires_at) - new Date()
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== SERVER START ==========
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`⏰ Vaqt: ${new Date().toISOString()}`);
  console.log(`💾 Database: Supabase`);
  console.log(`🤖 AI: ${model ? 'Google Gemini 1.5 Flash (with History)' : 'NOT CONFIGURED'}`);
  console.log(`💬 Chat History: Memory Storage`);
  console.log(`📧 Email: ${transporter ? 'Configured' : 'Not configured'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});