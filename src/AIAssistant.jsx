import React from 'react';
import { Bot, Sparkles, Clock, Zap } from 'lucide-react';

const AIAssistant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
            <Bot size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sherik Top AI Assistant</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sun'iy intellekt yordamida eng mos sheriklarni toping va loyihangizni keyingi bosqichga olib chiqing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <Sparkles className="text-purple-600 mr-3" size={24} />
              <h3 className="text-lg font-bold">Aqlli moslashtirish</h3>
            </div>
            <p className="text-gray-600">
              AI algoritmlari sizning ehtiyojlaringiz asosida eng mos sheriklarni taklif qiladi
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <Zap className="text-yellow-600 mr-3" size={24} />
              <h3 className="text-lg font-bold">Tez natijalar</h3>
            </div>
            <p className="text-gray-600">
              Aniqlangan mezonlar bo'yicha darhol mos keladigan sheriklar ro'yxati
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <Clock className="text-blue-600 mr-3" size={24} />
              <h3 className="text-lg font-bold">Tez Kunda</h3>
            </div>
            <p className="text-gray-600">
              AI Assistant tez orada ishga tushadi. Yangiliklar uchun kuzatib boring
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                AI Assistant yangiliklari uchun kuting!
              </h2>
              <p className="text-gray-700">
                Biz hozirda AI Assistant tizimini ishlab chiqmoqdamiz.
                Tez orada sizga quyidagi imkoniyatlar taqdim etiladi:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Loyihangizga mos sheriklar tavsiyasi</li>
                <li>• Investorlar bilan aqlli matchmaking</li>
                <li>• Loyiha rivojlanishi bo'yicha maslahatlar</li>
                <li>• Jamoani boshqarish bo'yicha tavsiyalar</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Ishga tushish sanasi</div>
                <div className="text-2xl font-bold text-purple-600">Yaqin orada</div>
                <div className="text-sm text-gray-500 mt-2">Yangiliklar tez orada!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;