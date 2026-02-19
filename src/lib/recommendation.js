// src/lib/recommendation.js
import { supabase } from './supabase';

export const getRecommendations = async (userId, userType) => {
    // 1. Foydalanuvchi ma'lumotlarini olish
    const { data: user } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    let recommendations = [];

    switch (userType) {
        case 'student':
            // Talabaga dasturchilar tavsiya qilish
            recommendations = await getDevelopersForStudent(user);
            break;
        case 'developer':
            // Dasturchiga loyihalar tavsiya qilish
            recommendations = await getProjectsForDeveloper(user);
            break;
        case 'investor':
            // Investorga loyihalar tavsiya qilish
            recommendations = await getProjectsForInvestor(user);
            break;
    }

    return recommendations;
};

const getDevelopersForStudent = async (student) => {
    // Talabaning loyiha g'oyasidan kalit so'zlarni olish
    const keywords = extractKeywords(student.student_project);
    
    // Kalit so'zlarga mos dasturchilarni topish
    const { data: developers } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'developer')
        .or(keywords.map(keyword => `skills.cs.{${keyword}}`).join(','));

    return developers || [];
};

const getProjectsForDeveloper = async (developer) => {
    // Dasturchining ko'nikmalariga mos loyihalarni topish
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .overlaps('required_skills', developer.skills || []);

    return projects || [];
};

const getProjectsForInvestor = async (investor) => {
    // Investor qiziqish sohalariga mos loyihalarni topish
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .overlaps('category', investor.investment_interests || []);

    return projects || [];
};

const extractKeywords = (text) => {
    if (!text) return [];
    // Oddiy kalit so'z ajratish
    const commonKeywords = ['web', 'mobile', 'app', 'ai', 'ml', 'startup', 'business'];
    return commonKeywords.filter(keyword => 
        text.toLowerCase().includes(keyword)
    );
};