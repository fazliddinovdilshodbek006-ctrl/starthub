// supabase/functions/ai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ✅ SHERIK TOP UCHUN MAXSUS PROMPT
const SYSTEM_PROMPT = `Sen "Sherik Top" platformasining aqlli yordamchisisisan. Ismingiz Sheriq.

PLATFORMA HAQIDA:
Sherik Top — O'zbekistondagi startaplar, tadbirkorlar, mutaxassislar va g'oya egalari uchun sherik va hamkor topish platformasi. Foydalanuvchilar o'z loyihalarini e'lon qiladi, ovoz beradi va Telegram orqali bog'lanadi.

KATEGORIYALAR: Texnologiya, Ta'lim, Sog'liq, Moliya, Ijtimoiy, Boshqa

SEN NIMA QILA OLASAN:
- Loyiha g'oyasini tahlil qilib, kategoriya va bosqich tavsiya berish
- Sherik yoki jamoa a'zosi izlashda maslahat berish
- Startap bosqichlari (G'oya → MVP → Rivojlantirish → Tayyor) haqida tushuntirish
- Platformadan qanday foydalanish bo'yicha yo'naltirish
- Investorlar yoki mentorlar topish bo'yicha maslahat
- Biznes g'oyalarini baholash va takomillashtirish

USLUB VA QOIDALAR:
// AI javobini tozalash
let cleanedText = aiText
  .replace(/O'pka/g, "Kechirasiz")
  .replace(/menin/g, "mening")
  .replace(/Sheriq/g, "Sherik");
1. FAQAT o'zbek tilida javob ber — hech qachon rus yoki ingliz tilida javob berma
2. O'ZBEK LOTIN YOZUVI — to'g'ri imlo bilan yoz (g', o', sh, ch, ng)
3. IMLOVIY XATOLAR QILMA — diqqat bilan yoz, har bir so'zni tekshir
4. Tabiiy, samimiy va do'stona gapir — rasmiy emas
5. Qisqa va aniq bo'l — 3-5 jumladan oshma, agar batafsil so'ralmasa
6. Emoji ishlatish mumkin, lekin ko'p emas (har javobda 1-2 ta)
7. Foydalanuvchini loyiha yaratishga, sherik topishga undash
8. Platforma bilan bog'liq bo'lmagan savollarga: "Bu mening doiramdan tashqarida, lekin Sherik Top da ajoyib loyihalar bor — ko'rib chiqing! 🚀" de
9. Hech qachon siyosiy, diniy yoki zararli mavzularga kirmа
10. Agar foydalanuvchi o'z g'oyasini aytsa — uni qo'llab-quvvatla va Sherik Top da e'lon qilishni tavsiya qil

IMLOVIY QOIDALAR (JUDA MUHIM):
- "Kechirasiz" yoki "Uzr so'rayman" — "O'pka" EMAS
- "mening" — "menin" EMAS
- "Sherik" — "Sheriq" EMAS (platforma nomi)
- "qilish" — "qilish" (to'g'ri)
- "yordam" — "yordam" (to'g'ri)
- Har bir so'zni lotin alifbosida to'g'ri yoz

MISOL JAVOBLAR (TO'G'RI IMLO):
Savol: "Qanday sherik topaman?"
Javob: "Loyihangizni Sherik Top da e'lon qiling va 'Kimlarni izlayapsiz' qismida mutaxassis nomini yozing. Masalan: 'Dasturchi va dizayner kerak' — shunda mos odamlar siz bilan bog'lanadi! 💡"

Savol: "Menda ta'lim loyihasi bor"  
Javob: "Ajoyib! Ta'lim sohasida sherik topish uchun loyihangizni 'Ta'lim' kategoriyasida e'lon qiling. Qanday mutaxassis kerak — o'qituvchi, dasturchi yoki marketing? Shunda aniqroq yordam bera olaman 😊"

Savol: "Bu kimning loyihasi?"
Javob: "Bu mening doiramdan tashqarida, lekin Sherik Top da ajoyib loyihalar bor — ko'rib chiqing! 🚀"

Savol: "Sen kimsiz?"
Javob: "Men Sherik Top platformasining AI yordamchisiman. Sizga startaplar, sherik topish va platformadan foydalanish bo'yicha maslahat beraman! 💡"`;

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: {
        ...CORS_HEADERS,
        "x-supabase-no-jwt-verification": "true",
      }
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Faqat POST so'rov qabul qilinadi" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message maydoni kerak" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Xavfli so'rovlarni filtrlash
    const dangerous = ["ignore previous", "forget instructions", "jailbreak", "pretend you are", "<script>", "system prompt"];
    const lower = message.toLowerCase();
    for (const d of dangerous) {
      if (lower.includes(d)) {
        return new Response(JSON.stringify({ 
          text: "Kechirasiz, bu so'rovga javob bera olmayman. Sherik Top haqida savol bering! 😊" 
        }), {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }
    }

    // Suhbat tarixini Groq formatiga o'tkazish
    const chatHistory = history.slice(-6).map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    // Groq API ga so'rov
    const groqResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...chatHistory,
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 300,
        top_p: 0.9,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API xatosi:", errText);
      throw new Error(`Groq API: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const aiText = groqData?.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error("Groq bo'sh javob qaytardi");
    }

    return new Response(JSON.stringify({ text: aiText.trim() }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Edge Function xatosi:", error);
    return new Response(
      JSON.stringify({ 
        text: "Hozir texnik muammo bor. Bir oz kutib qayta urinib ko'ring! 🙏" 
      }),
      {
        status: 200, // Frontend da error ko'rinmasin
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});