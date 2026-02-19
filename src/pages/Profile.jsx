import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Briefcase, Calendar, Edit, Save, X, Upload, Linkedin, Github, Instagram, Facebook, Globe, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    region: '',
    user_type: 'asoschi',
    profession: '',
    experience: '',
    telegram: '',
    linkedin: '',
    github: '',
    instagram: '',
    facebook: '',
    website: '',
    bio: '',
    cv_url: ''
  });

  const [cvFile, setCvFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      setUser(user);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          age: profileData.age || '',
          region: profileData.region || '',
          user_type: profileData.user_type || 'asoschi',
          profession: profileData.profession || '',
          experience: profileData.experience || '',
          telegram: profileData.telegram || '',
          linkedin: profileData.linkedin || '',
          github: profileData.github || '',
          instagram: profileData.instagram || '',
          facebook: profileData.facebook || '',
          website: profileData.website || '',
          bio: profileData.bio || '',
          cv_url: profileData.cv_url || ''
        });
        setProfileImagePreview(profileData.profile_image_url);
      }
    } catch (error) {
      console.error('Profil yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCVChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      alert('Faqat PDF formatdagi fayllar qabul qilinadi!');
    }
  };

  const uploadFile = async (file, bucket, folder) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Fayl yuklashda xatolik:', error);
      return null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let profileImageUrl = profileImagePreview;
      let cvUrl = formData.cv_url;

      // Profile rasmini yuklash
      if (profileImage) {
        profileImageUrl = await uploadFile(profileImage, 'profiles', 'profile-images');
      }

      // CV ni yuklash
      if (cvFile) {
        cvUrl = await uploadFile(cvFile, 'profiles', 'cvs');
      }

      const updates = {
        id: user.id,
        ...formData,
        profile_image_url: profileImageUrl,
        cv_url: cvUrl,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      alert('✅ Profil muvaffaqiyatli saqlandi!');
      setEditing(false);
      loadUserData();
    } catch (error) {
      console.error('Profilni saqlashda xatolik:', error);
      alert('❌ Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setSaving(false);
    }
  };

  const regions = [
    'Toshkent shahri', 'Toshkent viloyati', 'Andijon', 'Buxoro', 'Farg\'ona',
    'Jizzax', 'Xorazm', 'Namangan', 'Navoiy', 'Qashqadaryo', 'Qoraqalpog\'iston',
    'Samarqand', 'Sirdaryo', 'Surxondaryo'
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden mb-8`}>
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-6">
                <div className="relative">
                  {profileImagePreview ? (
                    <img 
                      src={profileImagePreview} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                      {formData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                      <Upload size={16} />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="mb-4">
                  <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formData.full_name || 'Foydalanuvchi'}
                  </h1>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {formData.profession || 'Kasb ko\'rsatilmagan'}
                  </p>
                </div>
              </div>
              
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <Edit size={20} />
                  Tahrirlash
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(false)}
                    className={`px-6 py-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} rounded-xl font-semibold hover:opacity-80 transition flex items-center gap-2`}
                  >
                    <X size={20} />
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={20} />
                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              )}
            </div>

            {/* Bio */}
            {(formData.bio || editing) && (
              <div className="mb-6">
                {editing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="O'zingiz haqingizda yozing..."
                    rows={3}
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                  />
                ) : (
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {formData.bio}
                  </p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 text-center`}>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formData.user_type === 'asoschi' ? '🚀' : formData.user_type === 'mutaxassis' ? '💼' : '💰'}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formData.user_type === 'asoschi' ? 'Asoschi' : 
                   formData.user_type === 'mutaxassis' ? 'Mutaxassis' : 'Investor'}
                </div>
              </div>
              {formData.experience && (
                <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 text-center`}>
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {formData.experience}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Tajriba</div>
                </div>
              )}
              {formData.region && (
                <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 text-center`}>
                  <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1 truncate`}>
                    {formData.region}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Hudud</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ma'lumotlar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asosiy Ma'lumotlar */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
                Asosiy Ma'lumotlar
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    To'liq Ism *
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                    />
                  ) : (
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{formData.full_name || '-'}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Yosh
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                      />
                    ) : (
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{formData.age || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Hudud
                    </label>
                    {editing ? (
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                      >
                        <option value="">Tanlang</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    ) : (
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{formData.region || '-'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Foydalanuvchi Turi
                  </label>
                  {editing ? (
                    <select
                      value={formData.user_type}
                      onChange={(e) => setFormData({...formData, user_type: e.target.value})}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                    >
                      <option value="asoschi">🚀 Asoschi</option>
                      <option value="mutaxassis">💼 Mutaxassis</option>
                      <option value="investor">💰 Investor</option>
                    </select>
                  ) : (
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {formData.user_type === 'asoschi' ? '🚀 Asoschi' : 
                       formData.user_type === 'mutaxassis' ? '💼 Mutaxassis' : '💰 Investor'}
                    </p>
                  )}
                </div>

                {formData.user_type === 'mutaxassis' && (
                  <>
                    <div>
                      <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Kasb
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.profession}
                          onChange={(e) => setFormData({...formData, profession: e.target.value})}
                          placeholder="Masalan: Frontend Developer"
                          className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                        />
                      ) : (
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{formData.profession || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Tajriba
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          placeholder="Masalan: 3 yil"
                          className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                        />
                      ) : (
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{formData.experience || '-'}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CV Upload */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
                CV / Rezyume
              </h2>
              
              {editing ? (
                <div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCVChange}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className={`flex items-center justify-center gap-3 px-6 py-4 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 transition`}
                  >
                    <FileText size={24} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {cvFile ? cvFile.name : 'CV yuklash (PDF)'}
                    </span>
                  </label>
                </div>
              ) : (
                formData.cv_url ? (
                  <a
                    href={formData.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition"
                  >
                    <FileText size={24} />
                    <span>CV ni ko'rish</span>
                  </a>
                ) : (
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>CV yuklanmagan</p>
                )
              )}
            </div>
          </div>

          {/* Right Column - Aloqa */}
          <div className="space-y-6">
            {/* Aloqa Ma'lumotlari */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
                Aloqa
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600" size={20} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                    {user?.email}
                  </span>
                </div>

                {editing ? (
                  <>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <MessageCircle className="text-blue-500" size={20} />
                        <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Telegram
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formData.telegram}
                        onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                        placeholder="@username"
                        className={`w-full px-4 py-2 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition text-sm`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Linkedin className="text-blue-700" size={20} />
                        <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          LinkedIn
                        </label>
                      </div>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/in/username"
                        className={`w-full px-4 py-2 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition text-sm`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Github className={theme === 'dark' ? 'text-white' : 'text-gray-900'} size={20} />
                        <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          GitHub
                        </label>
                      </div>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        placeholder="https://github.com/username"
                        className={`w-full px-4 py-2 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition text-sm`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Instagram className="text-pink-600" size={20} />
                        <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Instagram
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                        placeholder="@username"
                        className={`w-full px-4 py-2 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition text-sm`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="text-blue-600" size={20} />
                        <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Website
                        </label>
                      </div>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                        className={`w-full px-4 py-2 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 transition text-sm`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {formData.telegram && (
                      <a
                        href={`https://t.me/${formData.telegram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-500 hover:text-blue-600 transition"
                      >
                        <MessageCircle size={20} />
                        <span className="text-sm">@{formData.telegram.replace('@', '')}</span>
                      </a>
                    )}

                    {formData.linkedin && (
                      <a
                        href={formData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-700 hover:text-blue-800 transition"
                      >
                        <Linkedin size={20} />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}

                    {formData.github && (
                      <a
                        href={formData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 ${theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} transition`}
                      >
                        <Github size={20} />
                        <span className="text-sm">GitHub</span>
                      </a>
                    )}

                    {formData.instagram && (
                      <a
                        href={`https://instagram.com/${formData.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-pink-600 hover:text-pink-700 transition"
                      >
                        <Instagram size={20} />
                        <span className="text-sm">@{formData.instagram.replace('@', '')}</span>
                      </a>
                    )}

                    {formData.website && (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition"
                      >
                        <Globe size={20} />
                        <span className="text-sm truncate">{formData.website}</span>
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;