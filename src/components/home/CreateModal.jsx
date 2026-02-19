// src/components/home/CreateModal.jsx
import { Plus, Image as ImageIcon } from "lucide-react";

const CreateModal = ({ theme, newProject, setNewProject, profile, user, onClose, onCreate, onImageChange }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${
        theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
        
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Yangi Loyiha
            </h2>
          </div>

          {/* Rasm */}
          <div>
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Loyiha Rasmi (ixtiyoriy)
            </label>
            <input type="file" accept="image/*" onChange={onImageChange} className="hidden" id="project-image" />
            <label htmlFor="project-image" className={`cursor-pointer block ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            } border-2 border-dashed rounded-xl transition h-32 flex items-center justify-center overflow-hidden`}>
              {newProject.imagePreview ? (
                <img src={newProject.imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon className={`w-8 h-8 mx-auto ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Rasm yuklash uchun bosing
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Nom */}
          <div>
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Loyiha Nomi *
            </label>
            <input
              type="text"
              placeholder="Loyiha nomini kiriting"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className={`w-full px-4 py-3 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
            />
          </div>

          {/* Tavsif */}
          <div>
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Tavsif *
            </label>
            <textarea
              placeholder="Loyihangiz haqida batafsil yozing"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
            />
          </div>

          {/* Kategoriya + Bosqich */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Kategoriya
              </label>
              <select
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                className={`w-full px-4 py-3 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                } border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
              >
                <option>Texnologiya</option>
                <option>Ta'lim</option>
                <option>Sog'liq</option>
                <option>Moliya</option>
                <option>Ijtimoiy</option>
                <option>Boshqa</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Bosqich
              </label>
              <select
                value={newProject.stage}
                onChange={(e) => setNewProject({ ...newProject, stage: e.target.value })}
                className={`w-full px-4 py-3 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                } border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
              >
                <option>G'oya</option>
                <option>MVP</option>
                <option>Rivojlantirish</option>
                <option>Tayyor</option>
              </select>
            </div>
          </div>

          {/* Kimlarni izlayapsiz */}
          <div>
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Kimlarni Izlayapsiz?
            </label>
            <input
              type="text"
              placeholder="Masalan: Dasturchi, Dizayner, Marketing"
              value={newProject.looking_for}
              onChange={(e) => setNewProject({ ...newProject, looking_for: e.target.value })}
              className={`w-full px-4 py-3 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } border rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
            />
          </div>

          {/* Profil info */}
          {profile && (
            <div className={`${
              theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
            } border rounded-xl p-4`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                <strong>Muallif:</strong> {profile.full_name || user?.email}
              </p>
              {profile.telegram && (
                <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'} mt-1`}>
                  <strong>Telegram:</strong> @{profile.telegram}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tugmalar */}
        <div className={`flex gap-4 p-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} border-t`}>
          <button
            onClick={onClose}
            className={`flex-1 px-6 py-4 ${
              theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } border-2 rounded-xl font-bold transition`}
          >
            Bekor qilish
          </button>
          <button
            onClick={onCreate}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition"
          >
            Yaratish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;