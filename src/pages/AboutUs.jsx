import { Target, Users, Lightbulb, TrendingUp, MessageCircle, Award } from 'lucide-react';

const AboutUs = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)'
        }}>
            {/* HERO SECTION */}
            <section style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '5rem 2rem',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem',
                        lineHeight: '1.2'
                    }}>
                        Sherik Top Haqida
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        lineHeight: '1.8',
                        opacity: 0.95
                    }}>
                        Sherik Top — bu startap asoschilari, tadbirkorlar, mutaxassislar va g'oya egalari uchun yaratilgan <strong>sherik topish va hamkorlik platformasi</strong>.
                    </p>
                </div>
            </section>

            {/* BIZNING MAQSAD */}
            <section style={{
                maxWidth: '1200px',
                margin: '5rem auto',
                padding: '0 2rem'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '3rem',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <Target size={40} color="#667eea" />
                        <h2 style={{
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#1f2937'
                        }}>
                            Bizning Maqsadimiz
                        </h2>
                    </div>
                    <p style={{
                        fontSize: '20px',
                        lineHeight: '1.8',
                        color: '#4b5563',
                        marginBottom: '2rem'
                    }}>
                        Bir xil maqsadga ega bo'lgan insonlarni bir joyga jamlash, ularni o'zaro bog'lash va yangi loyihalarning rivojlanishiga yordam berish.
                    </p>
                    <p style={{
                        fontSize: '18px',
                        lineHeight: '1.8',
                        color: '#6b7280',
                        fontStyle: 'italic'
                    }}>
                        "Har bir buyuk g'oya to'g'ri jamoa bilan amalga oshadi. Biz bu jamoalarni yaratishga yordam beramiz."
                    </p>
                </div>
            </section>

            {/* PLATFORMA IMKONIYATLARI */}
            <section style={{
                maxWidth: '1200px',
                margin: '5rem auto',
                padding: '0 2rem'
            }}>
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '3rem',
                    color: '#1f2937'
                }}>
                    Platforma Imkoniyatlari
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem'
                }}>
                    <FeatureCard 
                        icon={<Users size={36} color="#667eea" />}
                        title="Co-Founder Topish"
                        description="Startapingiz uchun co-founder yoki jamoa a'zosi toping. Ko'nikmalar, tajriba va maqsadlar bo'yicha filterlang."
                    />
                    <FeatureCard 
                        icon={<Lightbulb size={36} color="#f59e0b" />}
                        title="Hamkorlar Bilan Tanishish"
                        description="G'oyangizni rivojlantirishga tayyor hamkorlar bilan tanishing. Networking imkoniyatlari cheksiz."
                    />
                    <FeatureCard 
                        icon={<TrendingUp size={36} color="#10b981" />}
                        title="Mentorlar va Investorlar"
                        description="Tajribali mentorlar va investorlar bilan aloqa o'rnating. Loyihangizni keyingi bosqichga olib chiqing."
                    />
                </div>
            </section>

            {/* OCHIQ HAMJAMIYAT */}
            <section style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
                padding: '5rem 2rem',
                marginTop: '5rem'
            }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <MessageCircle size={48} color="#667eea" style={{ margin: '0 auto 2rem' }} />
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        marginBottom: '2rem',
                        color: '#1f2937'
                    }}>
                        Ochiq Hamjamiyat Tamoyili
                    </h2>
                    <p style={{
                        fontSize: '20px',
                        lineHeight: '1.8',
                        color: '#4b5563',
                        marginBottom: '2rem'
                    }}>
                        Platforma <strong>ochiq hamjamiyat tamoyili</strong>ga asoslangan bo'lib, bu yerda har bir foydalanuvchi o'z loyihasini taqdim etishi, bilim va tajribasini ulashishi hamda yangi imkoniyatlarga ega bo'lishi mumkin.
                    </p>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        marginTop: '3rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        <Award size={40} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            marginBottom: '1rem'
                        }}>
                            Sherik Top — Bu Nima?
                        </h3>
                        <p style={{
                            fontSize: '18px',
                            lineHeight: '1.8',
                            color: '#6b7280'
                        }}>
                            Bu faqat platforma emas, balki <strong>g'oyalar uchrashadigan va loyihalar jamoaga aylanadigan makon</strong>.
                        </p>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section style={{
                maxWidth: '1200px',
                margin: '5rem auto 5rem',
                padding: '0 2rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    textAlign: 'center'
                }}>
                    <StatCard number="500+" label="Faol Foydalanuvchi" />
                    <StatCard number="100+" label="Muvaffaqiyatli Match" />
                    <StatCard number="50+" label="Boshlangan Loyiha" />
                    <StatCard number="24/7" label="Platforma Mavjudligi" />
                </div>
            </section>
        </div>
    );
};

// FEATURE CARD COMPONENT
const FeatureCard = ({ icon, title, description }) => (
    <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    }}>
        <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
        <h3 style={{
            fontSize: '22px',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
        }}>
            {title}
        </h3>
        <p style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#6b7280'
        }}>
            {description}
        </p>
    </div>
);

// STAT CARD COMPONENT
const StatCard = ({ number, label }) => (
    <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: 'white'
    }}>
        <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
        }}>
            {number}
        </div>
        <div style={{
            fontSize: '18px',
            opacity: 0.9
        }}>
            {label}
        </div>
    </div>
);

export default AboutUs;