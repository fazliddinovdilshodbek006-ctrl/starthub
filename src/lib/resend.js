import { Resend } from 'resend';

// Resend API kaliti .env faylida bo'lishi kerak
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY || 're_1234567890');

export const sendOTPEmail = async (email, otpCode) => {
  try {
    console.log(`📧 OTP yuborish: ${email}, kod: ${otpCode}`);

    // TEST MODE: Agar API kalit bo'lmasa yoki test rejimida bo'lsak
    if (!import.meta.env.VITE_RESEND_API_KEY || import.meta.env.VITE_TEST_MODE === 'true') {
      console.log(`✅ TEST: OTP kod ${email} ga yuborildi (test): ${otpCode}`);
      console.log(`🔢 Kod: ${otpCode}`);
      console.log(`⏰ Kod 1 soat davomida amal qiladi`);
      return { success: true, testMode: true };
    }

    // HAQIQIY EMAIL YUBORISH
    const { data, error } = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>',
      to: [email],
      subject: 'Tasdiqlash kodingiz',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Tasdiqlash kodingiz</h2>
          <p>Quyidagi kodni ilovangizga kiriting:</p>
          <h1 style="font-size: 32px; letter-spacing: 10px; color: #4f46e5;">${otpCode}</h1>
          <p>Bu kod 1 soat davomida amal qiladi.</p>
          <p>Agar siz bu kodni so'ramagan bo'lsangiz, iltimos, bu xabarni e'tiborsiz qoldiring.</p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Email yuborishda xato:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email yuborildi:', data);
    return { success: true, testMode: false };
    
  } catch (error) {
    console.error('❌ Xatolik:', error);
    return { success: false, error: error.message };
  }
};