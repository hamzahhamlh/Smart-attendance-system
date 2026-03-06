
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    major VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول المحاضرين
CREATE TABLE instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول المقررات
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول تسجيل الطلاب في المقررات (enrollments)
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- 5. جدول جلسات الحضور
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    qr_token TEXT UNIQUE NOT NULL,   -- يجب أن يكون فريداً
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. جدول سجلات الحضور (تصحيح التكرار)
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    lat FLOAT8 NOT NULL,
    lng FLOAT8 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);




-- 1. إدراج محاضرين
INSERT INTO instructors (id, email, password, name, department) VALUES 
  (uuid_generate_v4(), 'dr.ahmed@psau.edu.sa', '123456', 'د. أحمد عبدالله', 'علوم الحاسب'),
  (uuid_generate_v4(), 'dr.nora@psau.edu.sa', '123456', 'د. نورة محمد', 'نظم المعلومات');

-- 2. إدراج طلاب
INSERT INTO students (id, university_id, email, password, name, major) VALUES 
  (uuid_generate_v4(), '2021001', 's123@student.psau.edu.sa', '123456', 'سارة خالد', 'علوم الحاسب'),
  (uuid_generate_v4(), '2021002', 'ahmed.ali@student.psau.edu.sa', '123456', 'أحمد علي', 'نظم المعلومات'),
  (uuid_generate_v4(), '2021003', 'maha.nasser@student.psau.edu.sa', '123456', 'مها ناصر', 'علوم الحاسب');

-- 3. إدراج مقررات مع ربطها بالمحاضرين (سنفترض أن المحاضرين أضيفوا أولاً ونستخدم استعلاماً فرعياً للحصول على معرفاتهم)
-- الطريقة: استخدام CTEs لالتقاط المعرفات.
WITH 
  instructor_ahmed AS (SELECT id FROM instructors WHERE email = 'dr.ahmed@psau.edu.sa' LIMIT 1),
  instructor_nora AS (SELECT id FROM instructors WHERE email = 'dr.nora@psau.edu.sa' LIMIT 1)
INSERT INTO courses (id, code, name, instructor_id) VALUES 
  (uuid_generate_v4(), 'CS201', 'برمجة حاسوب 2', (SELECT id FROM instructor_ahmed)),
  (uuid_generate_v4(), 'CS301', 'هياكل بيانات', (SELECT id FROM instructor_ahmed)),
  (uuid_generate_v4(), 'IS310', 'تحليل وتصميم نظم', (SELECT id FROM instructor_nora));

-- 4. تسجيل الطلاب في المقررات
-- سارة مسجلة في CS201 و CS301
-- أحمد مسجل في CS201 و IS310
-- مها مسجلة في CS301 و IS310
WITH
  student_sara AS (SELECT id FROM students WHERE university_id = '2021001'),
  student_ahmed AS (SELECT id FROM students WHERE university_id = '2021002'),
  student_maha AS (SELECT id FROM students WHERE university_id = '2021003'),
  course_cs201 AS (SELECT id FROM courses WHERE code = 'CS201'),
  course_cs301 AS (SELECT id FROM courses WHERE code = 'CS301'),
  course_is310 AS (SELECT id FROM courses WHERE code = 'IS310')
INSERT INTO enrollments (id, student_id, course_id) VALUES 
  (uuid_generate_v4(), (SELECT id FROM student_sara), (SELECT id FROM course_cs201)),
  (uuid_generate_v4(), (SELECT id FROM student_sara), (SELECT id FROM course_cs301)),
  (uuid_generate_v4(), (SELECT id FROM student_ahmed), (SELECT id FROM course_cs201)),
  (uuid_generate_v4(), (SELECT id FROM student_ahmed), (SELECT id FROM course_is310)),
  (uuid_generate_v4(), (SELECT id FROM student_maha), (SELECT id FROM course_cs301)),
  (uuid_generate_v4(), (SELECT id FROM student_maha), (SELECT id FROM course_is310));

-- 5. إضافة جلسات حضور (sessions) لكل مقرر: 4 جلسات لكل مقرر
-- سنقوم بإنشاء جلسات على مدى الأسبوعين القادمين
WITH
  course_cs201 AS (SELECT id FROM courses WHERE code = 'CS201'),
  course_cs301 AS (SELECT id FROM courses WHERE code = 'CS301'),
  course_is310 AS (SELECT id FROM courses WHERE code = 'IS310')
INSERT INTO sessions (id, course_id, qr_token, start_time, end_time) VALUES 
  -- CS201
  (uuid_generate_v4(), (SELECT id FROM course_cs201), 'qr_cs201_1', '2025-03-10 08:00:00+03', '2025-03-10 09:30:00+03'),
  (uuid_generate_v4(), (SELECT id FROM course_cs201), 'qr_cs201_2', '2025-03-12 08:00:00+03', '2025-03-12 09:30:00+03'),
  (uuid_generate_v4(), (SELECT id FROM course_cs201), 'qr_cs201_3', '2025-03-17 08:00:00+03', '2025-03-17 09:30:00+03'),
  (uuid_generate_v4(), (SELECT id FROM course_cs201), 'qr_cs201_4', '2025-03-19 08:00:00+03', '2025-03-19 09:30:00+03'),
  -- CS301
  (uuid_generate_v4(), (SELECT id FROM course_cs301), 'qr_cs301_1', '2025-03-11 10:00:00+03', '2025-03-11 11:30:00+03'),
  (uuid_generate_v4(), (SELECT id FROM course_cs301), 'qr_cs301_2', '2025-03-13 10:00:00+03', '2025-03-13 11:30:00+03'),
  (uuid_generate_v4(), (SELECT id FROM course_cs301), 'qr_cs301_3', '2025-03-18 10:00:00+03', '2025-03-18 11:30:00+03'),
  (uuid_generate_v4(), (SELECT id FROM course_cs301), 'qr_cs301_4', '2025-03-20 10:00:00+03', '2025-03-20 11:30:00+03'),
  -- IS310
  (uuid_generate_v4(), (SELECT id FROM course_is310), 'qr_is310_1', '2025-03-10 12:00:00+03', '2025-03-10 13:30:00+03'),
  (uuid_generate_v4(), (SELECT id FROM course_is310), 'qr_is310_2', '2025-03-12 12:00:00+03', '2025-03-12 13:30:00+03'),
  (uuid_generate_v4(), (SELECT id FROM course_is310), 'qr_is310_3', '2025-03-17 12:00:00+03', '2025-03-17 13:30:00+03'),
  (uuid_generate_v4(), (SELECT id FROM course_is310), 'qr_is310_4', '2025-03-19 12:00:00+03', '2025-03-19 13:30:00+03');

-- 6. إضافة سجلات حضور للطلاب (بافتراض أن كل طالب حضر بعض الجلسات)
-- سنستخدم استعلامات فرعية للحصول على معرفات الطلاب والجلسات.
-- سارة: حضرت جميع جلسات CS201 (4) وجلستين من CS301
-- أحمد: حضر 3 جلسات من CS201 وجميع جلسات IS310 (4)
-- مها: حضرت 2 من CS301 و 3 من IS310
WITH
  -- تعريف معرفات الطلاب
  sara AS (SELECT id FROM students WHERE university_id = '2021001'),
  ahmed AS (SELECT id FROM students WHERE university_id = '2021002'),
  maha AS (SELECT id FROM students WHERE university_id = '2021003'),
  -- تعريف معرفات الجلسات لكل مقرر (سنحصل عليها بالترتيب)
  cs201_sessions AS (SELECT id FROM sessions WHERE qr_token LIKE 'qr_cs201_%' ORDER BY start_time),
  cs301_sessions AS (SELECT id FROM sessions WHERE qr_token LIKE 'qr_cs301_%' ORDER BY start_time),
  is310_sessions AS (SELECT id FROM sessions WHERE qr_token LIKE 'qr_is310_%' ORDER BY start_time)
INSERT INTO attendance (id, session_id, student_id, lat, lng) 
SELECT 
  uuid_generate_v4(),
  s.id,
  (SELECT id FROM sara),
  24.7136, 46.6753  -- إحداثيات جامعة الأمير سطام (تقريبية)
FROM (SELECT id FROM cs201_sessions) s
UNION ALL
SELECT 
  uuid_generate_v4(),
  s.id,
  (SELECT id FROM sara),
  24.7136, 46.6753
FROM (SELECT id FROM cs301_sessions LIMIT 2) s   -- سارة حضرت أول جلستين فقط من CS301
UNION ALL
SELECT 
  uuid_generate_v4(),
  s.id,
  (SELECT id FROM ahmed),
  24.7136, 46.6753
FROM (SELECT id FROM cs201_sessions LIMIT 3) s   -- أحمد حضر 3 من CS201
UNION ALL
SELECT 
  uuid_generate_v4(),
  s.id,
  (SELECT id FROM ahmed),
  24.7136, 46.6753
FROM (SELECT id FROM is310_sessions) s          -- أحمد حضر جميع جلسات IS310
UNION ALL
SELECT 
  uuid_generate_v4(),
  s.id,
  (SELECT id FROM maha),
  24.7136, 46.6753
FROM (SELECT id FROM cs301_sessions OFFSET 1 LIMIT 2) s   -- مها حضرت الجلستين الثانية والثالثة من CS301
UNION ALL
SELECT 
  uuid_generate_v4(),
  s.id,
  (SELECT id FROM maha),
  24.7136, 46.6753
FROM (SELECT id FROM is310_sessions LIMIT 3) s;           -- مها حضرت 3 من IS310