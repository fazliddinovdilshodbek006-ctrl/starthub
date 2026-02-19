import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import OTPVerification from './OTPVerification';
import UserTypeForms from './UserTypeForms';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, mode = 'signup' }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('regular');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (!isOpen) return null;

  const handleSendOTP = async () => {
    // Email formatini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Iltimos, to\'g\'ri email kiriting');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    } else {
      setStep(2);
    }
  };

  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  const handleAdditionalInfoSubmit = async (additionalData) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Foydalanuvchi topilmadi');
      return;
    }

    try {
      // Asosiy profil yaratish
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
        });

      if (profileError) throw profileError;

      // User type ga qarab qo'shimcha ma'lumotlar
      if (userType === 'student') {
        const { error } = await supabase
          .from('students')
          .insert({
            user_id: user.id,
            ...additionalData,
          });
        if (error) throw error;
      } else if (userType === 'developer') {
        const { error } = await supabase
          .from('developers')
          .insert({
            user_id: user.id,
            ...additionalData,
          });
        if (error) throw error;
      } else if (userType === 'investor') {
        const { error } = await supabase
          .from('investors')
          .insert({
            user_id: user.id,
            ...additionalData,
          });
        if (error) throw error;
      }

      alert('Profil muvaffaqiyatli yaratildi!');
      onClose();
      window.location.reload();

    } catch (error) {
      console.error('Error:', error);
      alert('Profil yaratishda xatolik: ' + error.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="auth-step">
            <h2>Ro'yxatdan o'tish</h2>
            
            {/* Email kirish */}
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
              />
            </div>

            {/* Foydalanuvchi turini tanlash */}
            <div className="input-group">
              <label>Men</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="user-type-select"
              >
                <option value="regular">Oddiy foydalanuvchi</option>
                <option value="student">Talaba</option>
                <option value="developer">Dasturchi</option>
                <option value="investor">Investor</option>
              </select>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleSendOTP}
              disabled={!email}
            >
              OTP kod olish
            </button>

            {/* Social login */}
            <div className="social-login">
              <p>Yoki</p>
              <div className="social-buttons">
                <button 
                  className="btn-google"
                  onClick={() => handleSocialLogin('google')}
                >
                  Google bilan
                </button>
                <button 
                  className="btn-github"
                  onClick={() => handleSocialLogin('github')}
                >
                  GitHub bilan
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <OTPVerification
            email={email}
            onSuccess={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );

      case 3:
        return (
          <div className="auth-step">
            <h2>Profilni to'ldiring</h2>
            
            <div className="input-group">
              <label>Ism</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ismingiz"
                required
              />
            </div>

            <div className="input-group">
              <label>Familya</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Familyangiz"
                required
              />
            </div>

            <UserTypeForms
              userType={userType}
              onSubmit={handleAdditionalInfoSubmit}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        {renderStep()}
      </div>
    </div>
  );
};

export default AuthModal;

