// your-project/api/send-otp.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Faqat POST request qabul qilish
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Faqat POST method qabul qilinadi' });
  }

  try {
    const { email, code } = req.body;
    
    // Email yuborish
    const data = await resend.emails.send({
      from: 'StartHub <onboarding@resend.dev>', // Test uchun
      to: email,
      subject: 'StartHub - Tasdiqlash kodingiz',
      html: `
        <h1>StartHub ga xush kelibsiz!</h1>
        <p>Sizning 6 raqamli tasdiqlash kodingiz:</p>
        <div style="font-size: 48px; font-weight: bold; letter-spacing: 15px; color: rgba(79, 70, 229, 1); margin: 30px 0; text-align: center;">
          ${code}
        </div>
        <p>Ushbu kodni platformadagi tasdiqlash oynasiga kiriting.</p>
        <p>Kod 1 soat davomida amal qiladi.</p>
      `
    });

    console.log('✅ Email yuborildi:', data);
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('❌ Email yuborishda xato:', error);
    res.status(500).json({ error: 'Email yuborishda xato' });
  }
}