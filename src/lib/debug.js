console.log('🎯 ==== FINAL SUPABASE TEST ====')

// 1. To'g'ridan-to'g'ri ma'lumotlar
const CORRECT_URL = 'https://rtroshkaccjoxeqolcyf.supabase.co'
const CORRECT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0cm9zaGthY2Nqb3hlcW9sY3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1OTc4MzEsImV4cCI6MjA4MTE3MzgzMX0.vGe4z64_KHlnojBBSOi1A1Z0tciAJcwm3Y2XbEFpW6Q'

console.log('✅ To\'g\'ri URL:', CORRECT_URL)
console.log('✅ To\'g\'ri KEY:', CORRECT_KEY.substring(0, 50) + '...')

// 2. Environment bilan solishtirish
console.log('\n🔍 Environment solishtirish:')
console.log('From .env:', import.meta.env.VITE_SUPABASE_URL)
console.log('Correct:  ', CORRECT_URL)

// 3. To'g'ridan-to'g'ri test
async function directTest() {
    console.log('\n🚀 To\'g\'ridan test boshlanmoqda...')
    
    // Test 1: To'g'ri ma'lumotlar bilan
    console.log('\n1. To\'g\'ri URL va KEY bilan:')
    try {
        const response = await fetch(`${CORRECT_URL}/rest/v1/test?select=*`, {
            headers: {
                'apikey': CORRECT_KEY,
                'Authorization': `Bearer ${CORRECT_KEY}`
            }
        })
        
        console.log('   Status:', response.status, response.statusText)
        
        if (response.ok) {
            const data = await response.json()
            console.log(`   🎉 MUVAFFAQIYATLI! ${data.length} ta yozuv`)
            console.table(data)
            
            // Ekranda ko'rsatish
            showSuccess(`Supabase ULANDI! ${data.length} ta yozuv`)
        } else {
            const error = await response.text()
            console.log('   ❌ Xato:', error)
            showError(`Xato: ${response.status}`)
        }
    } catch (error) {
        console.log('   💥 Fetch xatosi:', error.message)
        showError(`Fetch xatosi: ${error.message}`)
    }
    
    // Test 2: Environment ma'lumotlari bilan
    console.log('\n2. Environment ma\'lumotlari bilan:')
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        try {
            const envResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/test?select=*`, {
                headers: {
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                }
            })
            console.log('   Status:', envResponse.status)
        } catch (e) {
            console.log('   Environment xatosi:', e.message)
        }
    } else {
        console.log('   ⚠️ Environment ma\'lumotlari yo\'q')
    }
}

// Ekranda ko'rsatish funksiyalari
function showSuccess(message) {
    const div = document.createElement('div')
    div.innerHTML = `
        <div style="
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #4CAF50; color: white; padding: 20px; border-radius: 10px;
            font-family: Arial; z-index: 10000; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            text-align: center; max-width: 90%; animation: fadeIn 0.5s;
        ">
            <div style="font-size: 24px; margin-bottom: 10px;">🎉 SUCCESS!</div>
            <div style="font-size: 18px;">${message}</div>
            <div style="margin-top: 10px; font-size: 14px; opacity: 0.9;">
                "test" jadvali mavjud va ma'lumotlar olinmoqda
            </div>
        </div>
    `
    document.body.appendChild(div)
    setTimeout(() => div.remove(), 5000)
}

function showError(message) {
    const div = document.createElement('div')
    div.innerHTML = `
        <div style="
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #f44336; color: white; padding: 20px; border-radius: 10px;
            font-family: Arial; z-index: 10000; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            text-align: center; max-width: 90%;
        ">
            <div style="font-size: 24px; margin-bottom: 10px;">❌ XATOLIK</div>
            <div style="font-size: 18px;">${message}</div>
            <div style="margin-top: 15px; font-size: 14px;">
                <strong>Yechim:</strong><br>
                1. .env faylini tekshiring<br>
                2. VITE_SUPABASE_URL to'g'riligiga ishonch hosil qiling<br>
                3. Serverni qayta ishga tushiring
            </div>
        </div>
    `
    document.body.appendChild(div)
    setTimeout(() => div.remove(), 8000)
}

// Testni ishga tushirish
directTest().then(() => {
    console.log('\n✅ ==== TEST TUGADI ====')
    console.log('Agar muvaffaqiyatli bo\'lsa, hamma narsa ishlaydi!')
})

// Qo'shimcha: Tugma
setTimeout(() => {
    const btn = document.createElement('button')
    btn.innerHTML = '🔄 Testni qayta ishga tushirish'
    btn.onclick = () => {
        console.clear()
        console.log('Test qayta ishga tushirilmoqda...')
        directTest()
    }
    btn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #2196F3; color: white; border: none;
        padding: 12px 20px; border-radius: 8px; cursor: pointer;
        font-family: Arial; font-size: 16px; z-index: 9999;
        box-shadow: 0 4px 12px rgba(33,150,243,0.4);
    `
    document.body.appendChild(btn)
}, 1000)