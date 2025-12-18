import React from 'react';
import { Target, Users, Globe, Lightbulb } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600">
            Sherik top — bu startap asoschilari, tadbirkorlar, mutaxassislar va g'oya egalari uchun
            yaratilgan sherik topish va hamkorlik platformasi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <Target className="text-blue-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-3">Bizning Maqsad</h3>
            <p className="text-gray-600">
              Bir xil maqsadga ega bo'lgan insonlarni bir joyga jamlash, ularni o'zaro bog'lash va
              yangi loyihalarning rivojlanishiga yordam berish.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <Users className="text-green-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-3">Platforma Imkoniyatlari</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Startapingiz uchun co-founder yoki jamoa a'zosi topish</li>
              <li>• G'oyangizni rivojlantirishga tayyor hamkorlar bilan tanishish</li>
              <li>• Tajribali mentorlar va investorlar bilan aloqa o'rnatish</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center mb-6">
            <Globe className="text-blue-600 mr-3" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Ochiq Hamjamiyat Tamoyili</h2>
          </div>
          <p className="text-gray-700 text-lg mb-6">
            Platforma ochiq hamjamiyat tamoyiliga asoslangan bo'lib, bu yerda har bir foydalanuvchi
            o'z loyihasini taqdim etishi, bilim va tajribasini ulashishi hamda yangi imkoniyatlarga
            ega bo'lishi mumkin.
          </p>
          <div className="flex items-center bg-white p-4 rounded-xl">
            <Lightbulb className="text-yellow-500 mr-4" size={24} />
            <p className="text-gray-800 font-medium">
              Sherik top — bu faqat platforma emas, balki g'oyalar uchrashadigan va loyihalar jamoaga
              aylanadigan makon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;