// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  uz: {
    // MenuBar
    home: "Bosh sahifa",
    projects: "Loyihalar",
    about: "Biz haqimizda",
    profile: "Profil",
    settings: "Sozlamalar",
    logout: "Chiqish",
    createProject: "+ Loyiha Yaratish",
    
    // Home
    hero_title: "G'oyangiz bor?",
    hero_subtitle: "Sherik topamiz!",
    hero_desc: "Tadbirkorlik va hamkorlik uchun zamonaviy platforma",
    stats_projects: "Loyihalar",
    stats_votes: "Ovozlar",
    stats_users: "Foydalanuvchi",
    
    // Categories
    all: "Hammasi",
    technology: "Texnologiya",
    education: "Ta'lim",
    health: "Sog'liq",
    finance: "Moliya",
    social: "Ijtimoiy",
    other: "Boshqa",
    
    // Project
    stage: "Bosqich",
    lookingFor: "Qidirilmoqda",
    contact: "Bog'lanish",
    vote: "Ovoz berish",
    
    // Modal
    newProject: "Yangi Loyiha",
    projectImage: "Loyiha Rasmi (ixtiyoriy)",
    projectName: "Loyiha Nomi",
    description: "Tavsif",
    category: "Kategoriya",
    cancel: "Bekor qilish",
    create: "Yaratish",
    
    // Reels
    reelsView: "Reels Ko'rinishi"
  },
  
  en: {
    // MenuBar
    home: "Home",
    projects: "Projects",
    about: "About Us",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    createProject: "+ Create Project",
    
    // Home
    hero_title: "Have an idea?",
    hero_subtitle: "Find a partner!",
    hero_desc: "Modern platform for entrepreneurship and collaboration",
    stats_projects: "Projects",
    stats_votes: "Votes",
    stats_users: "Users",
    
    // Categories
    all: "All",
    technology: "Technology",
    education: "Education",
    health: "Health",
    finance: "Finance",
    social: "Social",
    other: "Other",
    
    // Project
    stage: "Stage",
    lookingFor: "Looking for",
    contact: "Contact",
    vote: "Vote",
    
    // Modal
    newProject: "New Project",
    projectImage: "Project Image (optional)",
    projectName: "Project Name",
    description: "Description",
    category: "Category",
    cancel: "Cancel",
    create: "Create",
    
    // Reels
    reelsView: "Reels View"
  },
  
  ru: {
    // MenuBar
    home: "Главная",
    projects: "Проекты",
    about: "О нас",
    profile: "Профиль",
    settings: "Настройки",
    logout: "Выход",
    createProject: "+ Создать проект",
    
    // Home
    hero_title: "Есть идея?",
    hero_subtitle: "Найдем партнера!",
    hero_desc: "Современная платформа для предпринимательства",
    stats_projects: "Проекты",
    stats_votes: "Голоса",
    stats_users: "Пользователи",
    
    // Categories
    all: "Все",
    technology: "Технологии",
    education: "Образование",
    health: "Здоровье",
    finance: "Финансы",
    social: "Социальные",
    other: "Другое",
    
    // Project
    stage: "Этап",
    lookingFor: "Ищем",
    contact: "Связаться",
    vote: "Голос",
    
    // Modal
    newProject: "Новый проект",
    projectImage: "Изображение (опционально)",
    projectName: "Название проекта",
    description: "Описание",
    category: "Категория",
    cancel: "Отмена",
    create: "Создать",
    
    // Reels
    reelsView: "Режим Reels"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('uz');
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};