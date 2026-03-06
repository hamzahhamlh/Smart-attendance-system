// src/auth.js
// دالة للتحقق من تسجيل الدخول وإعادة التوجيه إذا لزم الأمر
function checkAuth(requiredType = null) {
    const userData = sessionStorage.getItem('user');
    const userType = sessionStorage.getItem('userType');

    // إذا لم توجد بيانات جلسة، أعد التوجيه إلى صفحة تسجيل الدخول
    if (!userData || !userType) {
        window.location.href = '../index.html'; // نفترض أن index.html في المجلد الرئيسي
        return null;
    }

    try {
        const user = JSON.parse(userData);
        
        // إذا كان هناك نوع مطلوب و لم يتطابق
        if (requiredType && userType !== requiredType) {
            // إذا كان النوع خطأ، نوجه حسب نوعه أو إلى الصفحة الرئيسية المناسبة
            if (userType === 'student') {
                window.location.href = 'home.html'; // صفحة الطالب الرئيسية
            } else if (userType === 'instructor') {
                window.location.href = '../instructor/home.html'; // مثال
            } else {
                window.location.href = '../index.html';
            }
            return null;
        }

        return { user, userType };
    } catch (e) {
        sessionStorage.clear();
        window.location.href = '../index.html';
        return null;
    }
}

// دالة للحصول على المستخدم الحالي (بدون إعادة توجيه)
function getCurrentUser() {
    const userData = sessionStorage.getItem('user');
    if (!userData) return null;
    try {
        return JSON.parse(userData);
    } catch {
        return null;
    }
}

// دالة للحصول على نوع المستخدم الحالي
function getCurrentUserType() {
    return sessionStorage.getItem('userType');
}

// دالة لتسجيل الخروج
function logout() {
    sessionStorage.clear();
    window.location.href = '../index.html';
}
