import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AuthModal from "./AuthModal";
import { Menu, X, Sun, Moon, User, Plus, Rocket, Mail, CheckCircle } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [otpVerifiedEmail, setOtpVerifiedEmail] = useState("");
  const [showEmailNotification, setShowEmailNotification] = useState(false);

  useEffect(() => {
    // 1. URL parametrlarini tekshirish
    const urlParams = new URLSearchParams(location.search);
    const emailFromUrl = urlParams.get("email");
    const verifiedFromUrl = urlParams.get("verified");
    const sourceFromUrl = urlParams.get("source");
    
    console.log("📧 URL Parameters:", {
      email: emailFromUrl,
      verified: verifiedFromUrl,
      source: sourceFromUrl
    });
    
    if (emailFromUrl && verifiedFromUrl === "true") {
      console.log("✅ OTP tizimidan email qabul qilindi:", emailFromUrl);
      
      // 2. Emailni saqlash
      setOtpVerifiedEmail(emailFromUrl);
      setShowEmailNotification(true);
      
      // 3. LocalStorage ga saqlash
      localStorage.setItem("sherik_top_otp_email", emailFromUrl);
      localStorage.setItem("sherik_top_otp_verified", "true");
      localStorage.setItem("sherik_top_otp_time", new Date().toISOString());
      
      console.log("💾 Email localStorage ga saqlandi");
      
      // 4. Profile sahifasiga yo'naltirish
      setTimeout(() => {
        console.log("🔄 Profile sahifasiga yo'naltirish...");
        navigate(`/profile?email=${encodeURIComponent(emailFromUrl)}&verified=true`, { replace: true });
      }, 1000);
    } else {
      // LocalStorage dan yuklash
      const savedEmail = localStorage.getItem("sherik_top_otp_email");
      const savedVerified = localStorage.getItem("sherik_top_otp_verified");
      
      if (savedEmail && savedVerified === "true") {
        setOtpVerifiedEmail(savedEmail);
        console.log("✅ LocalStorage dan email yuklandi:", savedEmail);
      }
    }
  }, [location.search, navigate]);

  const navItems = [
    { name: "Bosh Sahifa", path: "/" },
    { name: "Loyihalar", path: "/projects" },
    { name: "Biz haqimizda", path: "/about" },
    { name: "AI Yordamchi", path: "/ai-assistant" },
  ];

  const closeEmailNotification = () => {
    setShowEmailNotification(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 dark:from-gray-800/95 dark:via-gray-900/95 dark:to-black/95 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Email Notification Banner */}
          {showEmailNotification && otpVerifiedEmail && (
            <div className="w-full py-3 px-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-green-400/30 flex items-center justify-between animate-slideDown">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-300 animate-pulse" />
                <div>
                  <p className="text-sm text-green-100 font-bold">
                    ✅ Email muvaffaqiyatli tasdiqlandi!
                  </p>
                  <p className="text-xs text-green-200">
                    <Mail className="w-3 h-3 inline mr-1" />
                    {otpVerifiedEmail}
                  </p>
                </div>
              </div>
              <button
                onClick={closeEmailNotification}
                className="text-green-200 hover:text-white text-2xl font-bold px-2"
              >
                &times;
              </button>
            </div>
          )}

          <div className="flex items-center justify-between h-24">
            {/* LOGO */}
            <Link to="/" className="flex items-center space-x-3 z-10 transform hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg rotate-45 transform">
                <Rocket className="text-white rotate-[-45deg]" size={28} />
              </div>
              
              <div className="flex flex-col items-start">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white drop-shadow-lg">
                    Sherik
                  </span>
                  <span className="text-4xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                    Top
                  </span>
                </div>
                <div className="text-xs text-white/90 font-semibold whitespace-nowrap tracking-wide">
                  {otpVerifiedEmail ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-green-300" />
                      Tasdiqlangan foydalanuvchi
                    </span>
                  ) : (
                    "O'zbekistonning eng yirik sheriklar platformasi"
                  )}
                </div>
              </div>
            </Link>

            {/* Email Badge Desktop */}
            {otpVerifiedEmail && (
              <div className="hidden lg:flex items-center space-x-2 mr-4 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30 backdrop-blur-sm">
                <Mail className="w-4 h-4 text-green-300" />
                <span className="text-sm text-green-100 font-bold truncate max-w-xs">
                  {otpVerifiedEmail}
                </span>
                <CheckCircle className="w-4 h-4 text-green-300" />
              </div>
            )}

            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-5 py-2.5 text-white/95 hover:text-white font-bold rounded-xl hover:bg-white/20 transition-all text-base backdrop-blur-sm border border-transparent hover:border-white/30"
                >
                  {item.name}
                </Link>
              ))}
              
              {(user || otpVerifiedEmail) && (
                <Link
                  to="/profile"
                  className="px-5 py-2.5 text-white/95 hover:text-white font-bold rounded-xl hover:bg-white/20 transition-all text-base backdrop-blur-sm border border-transparent hover:border-white/30 flex items-center gap-2"
                >
                  <User size={18} />
                  Profil
                </Link>
              )}

              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-gray-900 rounded-xl font-black hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 text-base border-2 border-yellow-300/50"
              >
                <Plus size={20} strokeWidth={3} />
                Loyiha Yaratish
              </button>

              {user ? (
                <button
                  onClick={() => {/* chiqish */}}
                  className="px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2 text-base border border-white/30"
                >
                  <User size={18} />
                  Chiqish
                </button>
              ) : otpVerifiedEmail ? (
                <div className="px-5 py-3 bg-green-500/20 backdrop-blur-sm text-white rounded-xl font-bold flex items-center gap-2 text-base border border-green-400/30">
                  <CheckCircle size={18} />
                  Tasdiqlangan
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2 text-base border border-white/30"
                >
                  <User size={18} />
                  Kirish
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all border border-white/30"
              >
                {theme === "dark" ? (
                  <Sun className="text-yellow-300" size={22} />
                ) : (
                  <Moon className="text-indigo-200" size={22} />
                )}
              </button>
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="flex lg:hidden items-center space-x-3">
              {otpVerifiedEmail && (
                <div className="flex items-center px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30">
                  <CheckCircle className="w-4 h-4 text-green-300 mr-1" />
                  <span className="text-xs text-green-100 font-bold truncate max-w-[100px]">
                    {otpVerifiedEmail.split("@")[0]}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl font-bold text-sm flex items-center gap-1"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30"
              >
                {theme === "dark" ? (
                  <Sun className="text-yellow-300" size={20} />
                ) : (
                  <Moon className="text-indigo-200" size={20} />
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30"
              >
                {isMenuOpen ? (
                  <X className="text-white" size={24} />
                ) : (
                  <Menu className="text-white" size={24} />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white/10 dark:bg-black/20 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/50 shadow-2xl rounded-b-2xl mb-2">
              <div className="px-4 py-4 space-y-2">
                {otpVerifiedEmail && (
                  <div className="px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30 mb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <div>
                        <p className="text-xs text-green-200 font-medium">✅ Tasdiqlangan</p>
                        <p className="text-sm text-white font-bold truncate">{otpVerifiedEmail}</p>
                      </div>
                    </div>
                  </div>
                )}

                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block px-4 py-3 text-white hover:text-white font-bold rounded-xl hover:bg-white/20 backdrop-blur-sm border border-transparent hover:border-white/30 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {(user || otpVerifiedEmail) && (
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-white hover:text-white font-bold rounded-xl hover:bg-white/20 backdrop-blur-sm border border-transparent hover:border-white/30 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;

