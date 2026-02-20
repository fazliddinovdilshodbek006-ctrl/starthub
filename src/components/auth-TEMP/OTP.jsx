// src/components/Auth/OTP.jsx
import React, { useState } from 'react';

const OTP = ({ email, onVerify, onResend, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Iltimos, 6 raqamli kodni kiriting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/verify-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          code: otpCode 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onVerify();
      } else {
        setError(data.message || 'Tasdiqlash muvaffaqiyatsiz');
        
        // Debug ma'lumotlarni ko'rsatish
        if (data.debug) {
          console.error('OTP Verification Debug:', data.debug);
        }
      }
    } catch (err) {
      console.error('Verify error:', err);
      setError('Server bilan bog\'lanishda xatolik. Iltimos, qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-blue-600"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Emailni tasdiqlash</h2>
      </div>

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-gray-600">
          6 raqamli tasdiqlash kodi <span className="font-semibold text-blue-600">{email}</span> manziliga yuborildi
        </p>
        <p className="text-sm text-gray-500 mt-2">Kod 10 daqiqa amal qiladi</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Tasdiqlash kodini kiriting
          </label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            ))}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center font-medium">{error}</p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Kodni emaildan ko'chirib joylashtirishingiz mumkin
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Tasdiqlanmoqda...
            </span>
          ) : 'Tasdiqlash'}
        </button>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onResend}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Kodni qayta yuborish
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800"
          >
            Emailni o'zgartirish
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTP;

