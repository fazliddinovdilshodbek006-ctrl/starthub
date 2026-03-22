import React, { useState, useEffect, createContext, useContext } from 'react';
import { Mail, Lock, User, Briefcase, TrendingUp, Eye, EyeOff, AlertCircle, CheckCircle, X, Phone, MapPin, Calendar, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const USER_TYPES = {
  FOUNDER: 'asoschi',
  SPECIALIST: 'mutaxassis',
  INVESTOR: 'investor'
};

const REGIONS = [
  'Toshkent shahri', 'Toshkent viloyati', 'Samarqand', 'Buxoro', 'Farg\'ona',
  'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo', 'Jizzax',
  'Sirdaryo', 'Navoiy', 'Xorazm', 'Qoraqalpog\'iston'
];

const PROFESSIONS = [
  'Frontend dasturchi', 'Backend dasturchi', 'Full-stack dasturchi', 'Mobile dasturchi',
  'Data Analyst', 'Data Scientist', 'Machine Learning muhandis', 'DevOps muhandis',
  'UI/UX dizayner', 'Grafik dizayner', 'Product Manager', 'Project Manager',
  'QA muhandis', 'System Administrator', 'Network muhandis', 'Cybersecurity mutaxassis',
  'Marketing mutaxassisi', 'SMM mutaxassisi', 'SEO mutaxassisi', 'Content menejeri',
  'Savdo menejeri', 'Biznes tahlilchi', 'Moliyaviy maslahatchi', 'Buxgalter',
  'HR menejeri', 'Tadbirkor', 'Konsultant', 'Biznes trener',
  'Video operator', 'Video montaj', 'Fotograf', 'Animatsiya mutaxassisi',
  'Kontent kreator', '3D dizayner', 'Illustrator', 'Copywriter',
  'Muhandis', 'Arxitektor', 'Qurilish muhandisi', 'Elektr muhandisi',
  'Mexanik muhandis', 'Kimyo muhandisi',
  'O\'qituvchi', 'Tarjimon', 'Yurist', 'Shifokor', 'Hamshira',
  'Psixolog', 'Tadbirchi', 'Restoran menejeri', 'Logistika mutaxassisi'
];

const PROJECT_CATEGORIES = [
  'Texnologiya', 'Ta\'lim', 'Sog\'liq', 'Moliya', 'Ijtimoiy',
  'E-commerce', 'Turizm', 'Qishloq xo\'jaligi', 'Transport', 'Boshqa'
];

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};

// Auth Modal
const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Email va parolni kiriting');
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { phone } }
        });
        if (error) throw error;
        setSuccess('Ro\'yxatdan o\'tdingiz!');
        setTimeout(() => onSuccess(data.user), 1500);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccess('Kirdingiz!');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4"><X size={24} /></button>
        <h2 className="text-3xl font-bold mb-2 text-center">{mode === 'signin' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}</h2>
        <p className="text-gray-600 text-center mb-6">Sherik Top</p>
        
        {error && <div className="mb-4 p-3 bg-red-50 rounded-lg flex gap-2"><AlertCircle className="text-red-500" size={20} /><p className="text-red-700 text-sm">{error}</p></div>}
        {success && <div className="mb-4 p-3 bg-green-50 rounded-lg flex gap-2"><CheckCircle className="text-green-500" size={20} /><p className="text-green-700 text-sm">{success}</p></div>}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sizning@email.com" className="w-full px-4 py-3 border rounded-lg" />
          </div>
          
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium mb-2">Telefon</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998901234567" className="w-full px-4 py-3 border rounded-lg" />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Parol</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border rounded-lg pr-12" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button onClick={handleAuth} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Kuting...' : mode === 'signin' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-blue-600 text-sm font-medium">
            {mode === 'signin' ? 'Ro\'yxatdan o\'tish' : 'Kirish'}
          </button>
        </div>
      </div>
    </div>
  );
};

// User Type Selection
const UserTypeSelection = ({ onSelect, onBack }) => {
  const types = [
    { id: USER_TYPES.FOUNDER, title: 'Asoschi', desc: 'Loyiha g\'oyasi bor', icon: User, color: 'blue' },
    { id: USER_TYPES.SPECIALIST, title: 'Mutaxassis', desc: 'O\'z kasbim bo\'yicha yordam beraman', icon: Briefcase, color: 'green' },
    { id: USER_TYPES.INVESTOR, title: 'Investor', desc: 'Loyihalarga sarmoya kiritaman', icon: TrendingUp, color: 'orange' }
  ];
  
  const colors = { blue: 'bg-blue-50 hover:bg-blue-100', green: 'bg-green-50 hover:bg-green-100', orange: 'bg-orange-50 hover:bg-orange-100' };
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
        <button onClick={onBack} className="absolute top-4 right-4"><X size={24} /></button>
        <h2 className="text-3xl font-bold mb-2 text-center">Siz kimsiz?</h2>
        <p className="text-gray-600 text-center mb-8">Profilingizni yaratish uchun turni tanlang</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {types.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => onSelect(t.id)} className={`p-6 border-2 rounded-xl transition ${colors[t.color]} text-center`}>
                <Icon size={40} className="mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-1">{t.title}</h3>
                <p className="text-sm text-gray-600">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ✅ ASOSCHI FORM - TELEGRAM BILAN
const FounderForm = ({ user, onComplete, onBack }) => {
  const [data, setData] = useState({ full_name: '', age: '', region: '', telegram: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!data.full_name || !data.age || !data.region || !data.telegram) {
      setError('Barcha maydonlarni to\'ldiring');
      return;
    }
    
    const telegramUsername = data.telegram.startsWith('@') ? data.telegram : '@' + data.telegram;
    
    setLoading(true);
    setError('');
    
    try {
      const { data: result, error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        phone: user.user_metadata?.phone,
        user_type: USER_TYPES.FOUNDER,
        full_name: data.full_name,
        age: data.age,
        region: data.region,
        telegram: telegramUsername
      });
      
      if (insertError) {
        console.error('❌ INSERT XATOSI:', insertError);
        setError(`Xato: ${insertError.message}`);
        return;
      }
      
      console.log('✅ Profil yaratildi!');
      onComplete();
    } catch (err) {
      console.error('❌ Xato:', err);
      setError(`Xato: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 my-8">
        <h2 className="text-2xl font-bold mb-6">Asoschi</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ism Familiya *</label>
            <input type="text" value={data.full_name} onChange={e => setData({...data, full_name: e.target.value})} placeholder="Ism Familiya" className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Yosh *</label>
            <input type="number" value={data.age} onChange={e => setData({...data, age: e.target.value})} placeholder="25" className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hudud *</label>
            <select value={data.region} onChange={e => setData({...data, region: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
              <option value="">Tanlang</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telegram *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">@</span>
              <input 
                type="text" 
                value={data.telegram} 
                onChange={e => setData({...data, telegram: e.target.value.replace('@', '')})} 
                placeholder="username"
                className="w-full pl-8 pr-4 py-3 border rounded-lg" 
              />
              <Send size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Telegram foydalanuvchi nomi (@ siz)</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onBack} className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition">Orqaga</button>
          <button onClick={save} disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ MUTAXASSIS FORM - TELEGRAM BILAN
const SpecialistForm = ({ user, onComplete, onBack }) => {
  const [data, setData] = useState({ full_name: '', age: '', region: '', profession: '', experience: '', telegram: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProfessionChange = (value) => {
    setData({...data, profession: value});
    if (value.length > 1) {
      const filtered = PROFESSIONS.filter(p => p.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const save = async () => {
    if (!data.full_name || !data.age || !data.region || !data.profession || !data.experience || !data.telegram) {
      setError('Barcha maydonlarni to\'ldiring');
      return;
    }
    
    const telegramUsername = data.telegram.startsWith('@') ? data.telegram : '@' + data.telegram;
    
    setLoading(true);
    setError('');
    
    try {
      const { data: result, error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        phone: user.user_metadata?.phone,
        user_type: USER_TYPES.SPECIALIST,
        full_name: data.full_name,
        age: data.age,
        region: data.region,
        profession: data.profession,
        experience: data.experience,
        telegram: telegramUsername
      });
      
      if (insertError) {
        console.error('❌ INSERT XATOSI:', insertError);
        setError(`Xato: ${insertError.message}`);
        return;
      }
      
      console.log('✅ Profil yaratildi!');
      onComplete();
    } catch (err) {
      console.error('❌ Xato:', err);
      setError(`Xato: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 my-8">
        <h2 className="text-2xl font-bold mb-6">Mutaxassis</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ism Familiya *</label>
            <input type="text" value={data.full_name} onChange={e => setData({...data, full_name: e.target.value})} placeholder="Ism Familiya" className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Yosh *</label>
            <input type="number" value={data.age} onChange={e => setData({...data, age: e.target.value})} placeholder="25" className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hudud *</label>
            <select value={data.region} onChange={e => setData({...data, region: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
              <option value="">Tanlang</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Kasbingiz *</label>
            <input 
              type="text" 
              value={data.profession} 
              onChange={e => handleProfessionChange(e.target.value)} 
              placeholder="Masalan: Frontend dasturchi" 
              className="w-full px-4 py-3 border rounded-lg" 
            />
            {suggestions.length > 0 && (
              <div className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setData({...data, profession: s}); setSuggestions([]); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tajriba *</label>
            <select value={data.experience} onChange={e => setData({...data, experience: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
              <option value="">Tanlang</option>
              <option>1 yildan kam</option>
              <option>1-2 yil</option>
              <option>2-3 yil</option>
              <option>3-5 yil</option>
              <option>5+ yil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telegram *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">@</span>
              <input 
                type="text" 
                value={data.telegram} 
                onChange={e => setData({...data, telegram: e.target.value.replace('@', '')})} 
                placeholder="username"
                className="w-full pl-8 pr-4 py-3 border rounded-lg" 
              />
              <Send size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Telegram foydalanuvchi nomi (@ siz)</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onBack} className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition">Orqaga</button>
          <button onClick={save} disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ INVESTOR FORM - TELEGRAM BILAN
const InvestorForm = ({ user, onComplete, onBack }) => {
  const [data, setData] = useState({ full_name: '', age: '', region: '', interests: [], telegram: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (cat) => {
    setData({...data, interests: data.interests.includes(cat) ? data.interests.filter(i => i !== cat) : [...data.interests, cat]});
  };

  const save = async () => {
    if (!data.full_name || !data.age || !data.region || data.interests.length === 0 || !data.telegram) {
      setError('Barcha maydonlarni to\'ldiring');
      return;
    }
    
    const telegramUsername = data.telegram.startsWith('@') ? data.telegram : '@' + data.telegram;
    
    setLoading(true);
    setError('');
    
    try {
      const { data: result, error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        phone: user.user_metadata?.phone,
        user_type: USER_TYPES.INVESTOR,
        full_name: data.full_name,
        age: data.age,
        region: data.region,
        interests: data.interests,
        telegram: telegramUsername
      });
      
      if (insertError) {
        console.error('❌ INSERT XATOSI:', insertError);
        setError(`Xato: ${insertError.message}`);
        return;
      }
      
      console.log('✅ Profil yaratildi!');
      onComplete();
    } catch (err) {
      console.error('❌ Xato:', err);
      setError(`Xato: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 my-8">
        <h2 className="text-2xl font-bold mb-6">Investor</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ism Familiya *</label>
            <input type="text" value={data.full_name} onChange={e => setData({...data, full_name: e.target.value})} placeholder="Ism Familiya" className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Yosh *</label>
            <input type="number" value={data.age} onChange={e => setData({...data, age: e.target.value})} placeholder="25" className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hudud *</label>
            <select value={data.region} onChange={e => setData({...data, region: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
              <option value="">Tanlang</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Qiziqtirgan loyihalar * (Kamida 1 ta)</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleInterest(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${data.interests.includes(cat) ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telegram *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">@</span>
              <input 
                type="text" 
                value={data.telegram} 
                onChange={e => setData({...data, telegram: e.target.value.replace('@', '')})} 
                placeholder="username"
                className="w-full pl-8 pr-4 py-3 border rounded-lg" 
              />
              <Send size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Telegram foydalanuvchi nomi (@ siz)</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onBack} className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition">Orqaga</button>
          <button onClick={save} disabled={loading} className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition disabled:opacity-50">
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App
const App = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showType, setShowType] = useState(false);
  const [type, setType] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (user && !done) checkProfile();
  }, [user]);

  const checkProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!data) setShowType(true);
    else { setDone(true); window.location.href = '/'; }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (done) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8"><div className="bg-white rounded-3xl p-8 text-center max-w-lg"><CheckCircle size={64} className="mx-auto mb-4 text-green-600" /><h1 className="text-3xl font-bold mb-2">Tayyor!</h1><p className="text-gray-600 mb-6">Profilingiz yaratildi</p><button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Bosh sahifa</button></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sherik Top</h1>
        <p className="text-2xl text-gray-700 mb-8">Loyihangiz uchun ideal sherik</p>
        {!user && <button onClick={() => setShowAuth(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition">Boshlash</button>}
      </div>
      {showAuth && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); setShowType(true); }} />}
      {showType && <UserTypeSelection onSelect={t => { setType(t); setShowType(false); }} onBack={() => setShowType(false)} />}
      {type === USER_TYPES.FOUNDER && <FounderForm user={user} onComplete={() => setDone(true)} onBack={() => { setType(null); setShowType(true); }} />}
      {type === USER_TYPES.SPECIALIST && <SpecialistForm user={user} onComplete={() => setDone(true)} onBack={() => { setType(null); setShowType(true); }} />}
      {type === USER_TYPES.INVESTOR && <InvestorForm user={user} onComplete={() => setDone(true)} onBack={() => { setType(null); setShowType(true); }} />}
    </div>
  );
};

export default function ProfileSystem() {
  return <AuthProvider><App /></AuthProvider>;
}