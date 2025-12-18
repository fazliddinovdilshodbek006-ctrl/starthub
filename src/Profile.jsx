import React from 'react';
import { User, Mail, Github, Send } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Profilim</h1>
          <p className="text-gray-600">Profil ma'lumotlaringizni bu yerdan boshqaring</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Profil tizimi tez orada ishga tushadi!</h2>
            <p className="text-gray-600 mb-4">
              Hozircha profil tizimi ishlab chiqilmoqda. Tez orada quyidagi imkoniyatlar qo'shiladi:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <User className="text-blue-600 mr-2" size={20} />
                <h3 className="font-bold text-gray-800">Shaxsiy ma'lumotlar</h3>
              </div>
              <p className="text-sm text-gray-600">
                Ism, familiya, roli (talaba, investor, dasturchi) va boshqa ma'lumotlar
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Github className="text-gray-800 mr-2" size={20} />
                <h3 className="font-bold text-gray-800">Ijtimoiy tarmoqlar</h3>
              </div>
              <p className="text-sm text-gray-600">
                GitHub, Telegram va boshqa ijtimoiy tarmoq profilingiz
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Mail className="text-green-600 mr-2" size={20} />
                <h3 className="font-bold text-gray-800">Loyihalarim</h3>
              </div>
              <p className="text-sm text-gray-600">
                Platformada qo'shgan loyihalaringiz ro'yxati
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Send className="text-purple-600 mr-2" size={20} />
                <h3 className="font-bold text-gray-800">Takliflar</h3>
              </div>
              <p className="text-sm text-gray-600">
                Sizga tegishli loyihalardan takliflar va habarlar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;