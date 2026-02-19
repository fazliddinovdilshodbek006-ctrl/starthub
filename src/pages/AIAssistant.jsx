import React, { useState } from 'react';
import { Bot, Sparkles, Zap, Target, Clock, TrendingUp } from 'lucide-react';

const AIAssistant = () => {
    const [email, setEmail] = useState('');

    const handleNotify = () => {
        if (!email) {
            alert('Iltimos, emailingizni kiriting!');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('To\'g\'ri email kiriting!');
            return;
        }
        alert(`✅ Rahmat! ${email} manziliga xabar yuboramiz.`);
        setEmail('');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)',
            color: 'white'
        }}>
            {/* HERO SECTION */}
            <section style={{
                padding: '5rem 2rem',
                textAlign: 'center',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '50px',
                    padding: '0.75rem 1.5rem',
                    marginBottom: '2rem'
                }}>
                    <Sparkles size={20} style={{ display: 'inline', marginRight: '8px' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                        Tez Kunda Ishga Tushadi
                    </span>
                </div>

                <h1 style={{
                    fontSize: '56px',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: '1.2'
                }}>
                    Sherik Top AI Assistant
                </h1>

                <p style={{
                    fontSize: '24px',
                    lineHeight: '1.8',
                    color: '#94a3b8',
                    maxWidth: '800px',
                    margin: '0 auto 3rem'
                }}>
                    Sun'iy intellekt yordamida eng mos sheriklarni toping va loyihangizni keyingi bosqichga olib chiqing
                </p>

                <div style={{
                    display: 'inline-block',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '-20px',
                        width: '120px',
                        height: '120px',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                    }}></div>
                    <Bot size={100} color="#6366f1" />
                </div>
            </section>

            {/* FEATURES */}
            <section style={{
                maxWidth: '1200px',
                margin: '5rem auto',
                padding: '0 2rem'
            }}>
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '3rem'
                }}>
                    AI Assistant Imkoniyatlari
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    <AIFeatureCard 
                        icon={<Target size={32} color="#6366f1" />}
                        title="Aqlli Moslashtirish"
                        description="AI algoritmlari sizning ehtiyojlaringiz asosida eng mos sheriklarni taklif qiladi"
                    />
                    <AIFeatureCard 
                        icon={<Zap size={32} color="#f59e0b" />}
                        title="Tez Natijalar"
                        description="Aniqlangan mezonlar bo'yicha darhol mos keladigan sheriklar ro'yxati"
                    />
                    <AIFeatureCard 
                        icon={<TrendingUp size={32} color="#10b981" />}
                        title="Rivojlanish Tahlili"
                        description="Loyihangiz rivojlanishini kuzatib boring va AI tavsiyalariga amal qiling"
                    />
                </div>
            </section>

            {/* COMING SOON */}
            <section style={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '4rem 2rem',
                margin: '5rem auto',
                maxWidth: '900px',
                textAlign: 'center'
            }}>
                <Clock size={48} color="#6366f1" style={{ margin: '0 auto 2rem' }} />
                <h2 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '2rem'
                }}>
                    AI Assistant yangiliklari uchun kuting!
                </h2>
                <p style={{
                    fontSize: '18px',
                    lineHeight: '1.8',
                    color: '#94a3b8',
                    marginBottom: '2rem'
                }}>
                    Biz hozirda AI Assistant tizimini ishlab chiqmoqdamiz. Tez orada sizga quyidagi imkoniyatlar taqdim etiladi:
                </p>

                <div style={{
                    textAlign: 'left',
                    maxWidth: '600px',
                    margin: '0 auto 3rem',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '16px',
                    padding: '2rem'
                }}>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        fontSize: '16px',
                        lineHeight: '2'
                    }}>
                        <li style={{ marginBottom: '1rem' }}>
                            ✨ Loyihangizga mos sheriklar tavsiyasi
                        </li>
                        <li style={{ marginBottom: '1rem' }}>
                            💼 Investorlar bilan aqlli matchmaking
                        </li>
                        <li style={{ marginBottom: '1rem' }}>
                            📊 Loyiha rivojlanishi bo'yicha maslahatlar
                        </li>
                        <li>
                            👥 Jamoani boshqarish bo'yicha tavsiyalar
                        </li>
                    </ul>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        Ishga Tushish Sanasi
                    </h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold' }}>
                        Yaqin orada
                    </p>
                </div>

                <div style={{
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    <p style={{
                        fontSize: '16px',
                        marginBottom: '1rem',
                        color: '#94a3b8'
                    }}>
                        Yangiliklar haqida birinchilardan bo'lib xabardor bo'lish uchun emailingizni qoldiring:
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email manzilingiz"
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(148, 163, 184, 0.3)',
                                background: 'rgba(15, 23, 42, 0.5)',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        />
                        <button 
                            onClick={handleNotify}
                            style={{
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Xabar Olish
                        </button>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.5;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.1);
                    }
                }
            `}</style>
        </div>
    );
};

// AI FEATURE CARD
const AIFeatureCard = ({ icon, title, description }) => (
    <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '16px',
        padding: '2rem',
        transition: 'all 0.3s'
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.1)';
    }}>
        <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
        <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '1rem'
        }}>
            {title}
        </h3>
        <p style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#94a3b8'
        }}>
            {description}
        </p>
    </div>
);

export default AIAssistant;