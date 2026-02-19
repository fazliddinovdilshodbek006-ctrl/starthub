// src/pages/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('⏳ Tasdiqlash...');

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            console.log('🔄 Auth callback qayta ishlanmoqda...');
            
            // URL'dan hash parametrlarini olish
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            
            if (accessToken) {
                console.log('✅ Token topildi, session o\'rnatilmoqda...');
                
                // Session o'rnatish
                const { data: { session }, error: sessionError } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });

                if (sessionError) {
                    console.error('❌ Session xatosi:', sessionError);
                    setStatus('❌ Xatolik yuz berdi');
                    setTimeout(() => navigate('/'), 2000);
                    return;
                }

                console.log('✅ Session o\'rnatildi:', session.user.id);
                
                // Profil tekshirish va yaratish
                const { data: existingProfile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError && profileError.code === 'PGRST116') {
                    // Profil yo'q - yangi profil yaratish
                    console.log('📝 Profil yaratilmoqda...');
                    setStatus('📝 Profil yaratilmoqda...');

                    const userData = session.user.user_metadata;
                    
                    const { data: newProfile, error: createError } = await supabase
                        .from('profiles')
                        .insert({
                            id: session.user.id,
                            email: session.user.email,
                            first_name: userData.first_name || '',
                            last_name: userData.last_name || '',
                            user_type: userData.user_type || '',
                            telegram_username: userData.telegram_username || '',
                            github_username: userData.github_username || '',
                            university: userData.university || '',
                            course: userData.course || null,
                            major: userData.major || '',
                            student_project: userData.student_project || '',
                            skills: userData.skills || [],
                            experience: userData.experience || 'junior',
                            technologies: userData.technologies || [],
                            investment_interests: userData.investment_interests || [],
                            min_investment: userData.min_investment || 0,
                            preferred_sectors: userData.preferred_sectors || [],
                            email_verified: true,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        })
                        .select()
                        .single();

                    if (createError) {
                        console.error('❌ Profil yaratishda xato:', createError);
                        setStatus('⚠️ Profil yaratishda muammo');
                    } else {
                        console.log('✅ Profil muvaffaqiyatli yaratildi');
                        localStorage.setItem('userProfile', JSON.stringify(newProfile));
                        setStatus('✅ Tasdiqlandi!');
                    }
                } else if (existingProfile) {
                    console.log('✅ Profil allaqachon mavjud');
                    localStorage.setItem('userProfile', JSON.stringify(existingProfile));
                    setStatus('✅ Tasdiqlandi!');
                }

                // Home sahifaga yo'naltirish
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 1500);

            } else {
                console.log('❌ Token topilmadi');
                setStatus('❌ Xatolik yuz berdi');
                setTimeout(() => navigate('/'), 2000);
            }

        } catch (error) {
            console.error('❌ Callback xatosi:', error);
            setStatus('❌ Xatolik yuz berdi: ' + error.message);
            setTimeout(() => navigate('/'), 3000);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #4f46e5, #7c3aed)',
            color: 'white'
        }}>
            <div style={{
                textAlign: 'center',
                background: 'white',
                padding: '3rem',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                maxWidth: '400px'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '1rem'
                }}>
                    {status.includes('✅') ? '✅' : status.includes('❌') ? '❌' : '⏳'}
                </div>
                <h2 style={{ 
                    color: '#333', 
                    marginBottom: '1rem',
                    fontSize: '24px'
                }}>
                    {status}
                </h2>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '4px solid #e5e7eb',
                    borderTopColor: '#4f46e5',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '2rem auto'
                }}></div>
                <p style={{ color: '#666', fontSize: '14px' }}>
                    Iltimos kuting...
                </p>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default AuthCallback;