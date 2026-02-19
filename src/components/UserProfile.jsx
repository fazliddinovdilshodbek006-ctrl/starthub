import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { profile, user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    telegram: '',
    linkedin: ''
  });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tags: []
  });
  const [otpVerifiedEmail, setOtpVerifiedEmail] = useState(''); // ✅ Yangi: OTP emaili
  const [showEmailNotification, setShowEmailNotification] = useState(false); // ✅ Yangi: Email bildirishnomasi

  useEffect(() => {
    // ✅ 1. URL dan OTP emailini olish
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    const verifiedFromUrl = urlParams.get('verified');
    
    if (emailFromUrl && verifiedFromUrl === 'true') {
      console.log('✅ OTP tizimidan email qabul qilindi:', emailFromUrl);
      setOtpVerifiedEmail(emailFromUrl);
      setShowEmailNotification(true);
      
      // LocalStorage ga saqlash
      localStorage.setItem('otp_verified_email', emailFromUrl);
      localStorage.setItem('otp_verification_time', new Date().toISOString());
      
      // 5 soniyadan keyin bildirishnomani yashirish
      setTimeout(() => {
        setShowEmailNotification(false);
      }, 5000);
    }
    
    // ✅ 2. LocalStorage dan OTP emailini yuklash
    const savedEmail = localStorage.getItem('otp_verified_email');
    if (savedEmail) {
      setOtpVerifiedEmail(savedEmail);
    }

    // ✅ 3. Agar profile mavjud bo'lsa, social links va projects larni yuklash
    if (profile) {
      loadSocialLinks();
      loadProjects();
    }
  }, [profile]);

  const loadSocialLinks = async () => {
    const { data } = await supabase
      .from('social_links')
      .select('*')
      .eq('user_id', profile.id);
    
    if (data) {
      const links = {};
      data.forEach(link => {
        links[link.platform] = link.username;
      });
      setSocialLinks(links);
    }
  };

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setProjects(data);
    }
  };

  const handleSaveProfile = async () => {
    // Social linklarni saqlash
    for (const [platform, username] of Object.entries(socialLinks)) {
      if (username) {
        await supabase
          .from('social_links')
          .upsert({
            user_id: profile.id,
            platform,
            username
          }, { onConflict: 'user_id,platform' });
      }
    }

    setEditMode(false);
    alert('Profil yangilandi!');
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim()) {
      alert('Loyiha nomini kiriting');
      return;
    }

    const { error } = await supabase
      .from('projects')
      .insert({
        user_id: profile.id,
        ...newProject
      });

    if (error) {
      alert('Xatolik: ' + error.message);
    } else {
      setNewProject({ title: '', description: '', tags: [] });
      loadProjects();
      alert('Loyiha qo\'shildi!');
    }
  };

  // ✅ Email bildirishnomasini yopish funksiyasi
  const closeEmailNotification = () => {
    setShowEmailNotification(false);
    // URL dan parametrlarni olib tashlash (agar kerak bo'lsa)
    if (window.history.replaceState) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  };

  // ✅ Agar profile yo'q bo'lsa, faqat OTP emailini ko'rsatish
  if (!profile) {
    return (
      <div className="profile-container">
        {showEmailNotification && (
          <div className="email-notification success">
            <div className="notification-content">
              <span className="notification-icon">✅</span>
              <div>
                <p className="notification-title">Email tasdiqlandi!</p>
                <p className="notification-message">
                  <strong>{otpVerifiedEmail}</strong> manzili muvaffaqiyatli tasdiqlandi.
                  Endi platformadan to'liq foydalanishingiz mumkin.
                </p>
              </div>
              <button 
                className="notification-close"
                onClick={closeEmailNotification}
              >
                &times;
              </button>
            </div>
          </div>
        )}
        
        <div className="profile-header">
          <div className="profile-info">
            <h1>Xush kelibsiz!</h1>
            <div className="email-verification-badge">
              <span className="verified-icon">✅</span>
              <p className="verified-email">
                <span className="email-text">{otpVerifiedEmail || 'Email mavjud emas'}</span>
                {otpVerifiedEmail && (
                  <span className="verified-badge">Tasdiqlangan</span>
                )}
              </p>
            </div>
            <p className="welcome-message">
              Profilingizni to'ldirish uchun ro'yxatdan o'ting yoki tizimga kiring.
            </p>
          </div>
        </div>

        <div className="info-section">
          <h3>Platforma imkoniyatlari</h3>
          <ul className="features-list">
            <li>👥 Sherik topish</li>
            <li>💡 Loyihalarni boshqarish</li>
            <li>📈 Investitsiyalarni jalb qilish</li>
            <li>🤝 Hamkorlik qilish</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* ✅ Email tasdiqlanganlik bildirishnomasi */}
      {showEmailNotification && (
        <div className="email-notification success">
          <div className="notification-content">
            <span className="notification-icon">✅</span>
            <div>
              <p className="notification-title">Email tasdiqlandi!</p>
              <p className="notification-message">
                <strong>{otpVerifiedEmail}</strong> manzili muvaffaqiyatli tasdiqlandi.
              </p>
            </div>
            <button 
              className="notification-close"
              onClick={closeEmailNotification}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ✅ Profil header qismi */}
      <div className="profile-header">
        <div className="profile-info">
          <h1>{profile.first_name} {profile.last_name}</h1>
          
          {/* ✅ OTP orqali kelgan emailni ko'rsatish */}
          {(otpVerifiedEmail || profile.email) && (
            <div className="email-display">
              <p className="email">
                {profile.email && (
                  <>
                    <span className="email-label">Asosiy email:</span>
                    <span className="email-value">{profile.email}</span>
                  </>
                )}
              </p>
              
              {otpVerifiedEmail && otpVerifiedEmail !== profile.email && (
                <p className="otp-email">
                  <span className="email-label">✅ Tasdiqlangan email:</span>
                  <span className="email-value verified">{otpVerifiedEmail}</span>
                  <span className="verification-source">(OTP tizimi orqali)</span>
                </p>
              )}
            </div>
          )}
          
          <span className={`user-type ${profile.user_type}`}>
            {profile.user_type === 'student' && '👨🎓 Talaba'}
            {profile.user_type === 'developer' && '👨💻 Dasturchi'}
            {profile.user_type === 'investor' && '💼 Investor'}
            {profile.user_type === 'regular' && '👤 Foydalanuvchi'}
          </span>
        </div>
        <button 
          className="edit-btn"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Bekor qilish' : 'Tahrirlash'}
        </button>
      </div>

      {/* User type ga qarab ma'lumotlar */}
      {profile.user_type === 'student' && profile.university && (
        <div className="info-section">
          <h3>Talaba ma'lumotlari</h3>
          <p>🎓 {profile.university}</p>
          <p>📚 {profile.degree === 'bachelor' ? 'Bakalavr' : 'Magistr'}, {profile.year}-kurs</p>
          <p>📖 Yo'nalish: {profile.major}</p>
        </div>
      )}

      {profile.user_type === 'developer' && (
        <div className="info-section">
          <h3>Dasturchi ma'lumotlari</h3>
          {profile.stack && (
            <div className="tech-stack">
              <p><strong>Texnologiyalar:</strong></p>
              <div className="tech-chips">
                {profile.stack.map((tech, index) => (
                  <span key={index} className="tech-chip">{tech}</span>
                ))}
              </div>
            </div>
          )}
          {profile.years_of_experience && (
            <p>💼 Tajriba: {profile.years_of_experience} yil</p>
          )}
        </div>
      )}

      {profile.user_type === 'investor' && profile.interested_fields && (
        <div className="info-section">
          <h3>Investor ma'lumotlari</h3>
          <p><strong>Qiziqish sohalari:</strong></p>
          <div className="interest-chips">
            {profile.interested_fields.map((field, index) => (
              <span key={index} className="interest-chip">{field}</span>
            ))}
          </div>
        </div>
      )}

      {/* Social linklar */}
      <div className="info-section">
        <h3>Aloqa uchun</h3>
        {editMode ? (
          <div className="social-links-edit">
            <div className="input-group">
              <label>GitHub</label>
              <input
                type="text"
                value={socialLinks.github}
                onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
                placeholder="username"
              />
            </div>
            <div className="input-group">
              <label>Telegram</label>
              <input
                type="text"
                value={socialLinks.telegram}
                onChange={(e) => setSocialLinks({...socialLinks, telegram: e.target.value})}
                placeholder="@username"
              />
            </div>
            <div className="input-group">
              <label>LinkedIn</label>
              <input
                type="text"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                placeholder="username"
              />
            </div>
          </div>
        ) : (
          <div className="social-links">
            {socialLinks.github && (
              <a href={`https://github.com/${socialLinks.github}`} target="_blank" rel="noreferrer">
                <i className="fab fa-github"></i> GitHub: {socialLinks.github}
              </a>
            )}
            {socialLinks.telegram && (
              <a href={`https://t.me/${socialLinks.telegram.replace('@', '')}`} target="_blank" rel="noreferrer">
                <i className="fab fa-telegram"></i> Telegram: {socialLinks.telegram}
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={`https://linkedin.com/in/${socialLinks.linkedin}`} target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin"></i> LinkedIn: {socialLinks.linkedin}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Loyihalar qo'shish */}
      <div className="info-section">
        <h3>Loyihalarim</h3>
        
        {/* Yangi loyiha qo'shish */}
        <div className="add-project">
          <h4>Yangi loyiha qo'shish</h4>
          <div className="input-group">
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              placeholder="Loyiha nomi"
            />
          </div>
          <div className="input-group">
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Loyiha haqida"
              rows="3"
            />
          </div>
          <button 
            className="btn-primary"
            onClick={handleAddProject}
            disabled={!newProject.title.trim()}
          >
            Loyiha qo'shish
          </button>
        </div>

        {/* Mavjud loyihalar */}
        <div className="projects-list">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              {project.tags && project.tags.length > 0 && (
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <small>{new Date(project.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Saqlash tugmasi */}
      {editMode && (
        <div className="save-section">
          <button className="btn-primary" onClick={handleSaveProfile}>
            Saqlash
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

