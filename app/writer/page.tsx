'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  writer: string;
  category: string;
  content: string;
  fontStyle?: string;
  status: 'pending' | 'published' | 'rejected';
  feedback?: string;
}

interface ApprovedLogin {
  id: number;
  name: string;
  role: string;
}

interface PendingRequest {
  id: number;
  name: string;
  role: string;
  date: string;
}

export default function WriterDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [writerNameInput, setWriterNameInput] = useState('');
  const [regName, setRegName] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // المقالات
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [myArticles, setMyArticles] = useState<Article[]>([]);

  // حالات أدوات التنسيق والخطوط للكاتب
  const [selectedFont, setSelectedFont] = useState('font-tajawal');
  const [selectedSize, setSelectedSize] = useState('text-base');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'text-right' | 'text-center' | 'text-left'>('text-right');

  useEffect(() => {
    // جلب المقالات
    const saved = localStorage.getItem('prometheus_articles');
    if (saved) {
      try { setMyArticles(JSON.parse(saved)); } catch (e) {}
    }

    // استرجاع الجلسة المحفوظة سابقاً
    const savedWriter = localStorage.getItem('prometheus_active_writer');
    if (savedWriter) {
      setWriterNameInput(savedWriter);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const approvedLogins: ApprovedLogin[] = JSON.parse(
      localStorage.getItem('prometheus_approved_logins') || '[]'
    );
    
    const cleanName = writerNameInput.trim().toLowerCase();

    if (!cleanName) {
      alert('يرجى إدخال الاسم!');
      return;
    }

    const isApproved = approvedLogins.some(
      u => u.name.trim().toLowerCase() === cleanName && (u.role === 'كاتب' || u.role === 'أدمن')
    );

    if (isApproved) {
      setIsAuthenticated(true);
      localStorage.setItem('prometheus_active_writer', writerNameInput.trim());
    } else {
      alert('عذراً، هذا الاسم غير مقبول من قبل الأدمن بعد! أو أنك لم تقدم طلب انضمام ككاتب.');
    }
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const newRequest: PendingRequest = {
      id: Date.now(),
      name: regName.trim(),
      role: 'كاتب',
      date: new Date().toLocaleDateString('ar-EG'),
    };

    const pending: PendingRequest[] = JSON.parse(
      localStorage.getItem('prometheus_pending_requests') || '[]'
    );
    localStorage.setItem('prometheus_pending_requests', JSON.stringify([newRequest, ...pending]));

    setWriterNameInput(regName.trim());
    setRequestSent(true);
    setRegName('');
  };

  const handleLogout = () => {
    localStorage.removeItem('prometheus_active_writer');
    setIsAuthenticated(false);
    setWriterNameInput('');
  };

  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category || !writerNameInput) return;

    const fontStyleClass = `${selectedFont} ${selectedSize} ${isBold ? 'font-bold' : 'font-normal'} ${isItalic ? 'italic' : ''} ${textAlign}`;

    const newArticle: Article = {
      id: Date.now(),
      title,
      writer: writerNameInput,
      category,
      content,
      fontStyle: fontStyleClass,
      status: 'pending',
    };

    const updated = [newArticle, ...myArticles];
    setMyArticles(updated);
    localStorage.setItem('prometheus_articles', JSON.stringify(updated));

    setSubmitted(true);
    setTimeout(() => {
      setTitle('');
      setCategory('');
      setContent('');
      setSubmitted(false);
    }, 3000);
  };

  const handleDeleteArticle = (id: number) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذه المقالة؟')) {
      const updated = myArticles.filter(art => art.id !== id);
      setMyArticles(updated);
      localStorage.setItem('prometheus_articles', JSON.stringify(updated));
    }
  };

  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl max-w-md w-full p-8 shadow-2xl flex flex-col gap-6 text-center">
          
          {requestSent ? (
            <div className="flex flex-col gap-4">
              <span className="text-4xl">⏳</span>
              <h1 className="text-lg font-bold text-amber-400">تم إرسال طلبك بنجاح!</h1>
              <p className="text-xs text-gray-300">
                طلبك بانتظار موافقة الأدمن. بعد موافقة الأدمن، عد واكتب اسمك (<span className="text-amber-400 font-bold">{writerNameInput}</span>) وسيفتح لك السيستم فوراً.
              </p>
              <button 
                onClick={() => { setRequestSent(false); setIsRegistering(false); }}
                className="mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
              >
                جرب تسجيل الدخول 🔑
              </button>
            </div>
          ) : isRegistering ? (
            <form onSubmit={handleSendRequest} className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-bold text-amber-400 mb-1">تقديم طلب كاتب جديد ✍️</h1>
                <p className="text-xs text-gray-400">اكتب اسمك وسيتم تحويل طلبك للوحة الأدمن للموافقة عليه.</p>
              </div>
              <input 
                type="text" 
                placeholder="اسمك الثلاثي..." 
                value={regName} 
                onChange={(e) => setRegName(e.target.value)} 
                required 
                className="px-4 py-3 rounded-xl bg-slate-950 border border-blue-950 text-sm text-white focus:outline-none text-center"
              />
              <button type="submit" className="py-3 bg-amber-500 hover:bg-amber-400 font-bold text-sm rounded-xl text-slate-950 cursor-pointer">
                إرسال الطلب للأدمن 🚀
              </button>
              <button type="button" onClick={() => setIsRegistering(false)} className="text-xs text-gray-400 hover:text-white cursor-pointer">
                قدّمت طلباً سابقاً؟ تسجيل الدخول باسمك
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-bold text-amber-400 mb-1">تسجيل دخول الكاتب ✍️</h1>
                <p className="text-xs text-gray-400">اكتب اسمك المقبول لفتح النافذة الخاصة بك.</p>
              </div>
              <input 
                type="text" 
                placeholder="أدخل اسمك المقبول..." 
                value={writerNameInput} 
                onChange={(e) => setWriterNameInput(e.target.value)} 
                required 
                className="px-4 py-3 rounded-xl bg-slate-950 border border-blue-950 text-sm text-white focus:outline-none text-center"
              />
              <button type="submit" className="py-3 bg-amber-500 hover:bg-amber-400 font-bold text-sm rounded-xl text-slate-950 cursor-pointer">
                دخول 🔓
              </button>
              <button type="button" onClick={() => setIsRegistering(true)} className="text-xs text-amber-400 hover:underline cursor-pointer">
                كاتب جديد؟ تقديم طلب انضمام للأدمن ➕
              </button>
            </form>
          )}

          <Link href="/" className="text-xs text-gray-400 hover:underline pt-2 border-t border-blue-950">العودة للرئيسية 🏠</Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex flex-col justify-between font-sans">
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-blue-950/40 bg-[#070b19]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold">
            PROMETHEUS <span className="text-amber-500">🔥</span>
          </Link>
          <span className="text-xs bg-blue-950 text-blue-400 px-3 py-1 rounded-full border border-blue-900 font-bold">
            أهلاً بك، {writerNameInput} ✍️
          </span>
        </div>
        <button onClick={handleLogout} className="text-xs text-rose-400 hover:underline cursor-pointer">
          تسجيل خروج 🔒
        </button>
      </nav>

      <section className="max-w-4xl mx-auto px-4 py-10 w-full flex-1 flex flex-col gap-10">
        {/* متابعة المقالات */}
        {myArticles.length > 0 && (
          <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold text-amber-400">حالة مقالاتك المرسلة 📋</h2>
            <div className="flex flex-col gap-3">
              {myArticles.map(art => (
                <div key={art.id} className="bg-slate-950/60 p-4 rounded-xl border border-blue-950 flex justify-between items-center flex-wrap gap-2">
                  <span className="font-bold text-sm">{art.title}</span>
                  <div className="flex gap-2 items-center">
                    {art.status === 'pending' && <span className="text-xs bg-amber-950/50 text-amber-400 px-2.5 py-1 rounded-full border border-amber-900">قيد المراجعة ⏳</span>}
                    {art.status === 'published' && <span className="text-xs bg-emerald-950/50 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-900">منشور ✅</span>}
                    {art.status === 'rejected' && <span className="text-xs bg-rose-950/50 text-rose-400 px-2.5 py-1 rounded-full border border-rose-900">يحتاج تعديل ✍️</span>}
                    <button onClick={() => handleDeleteArticle(art.id)} className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 px-2.5 py-1 rounded-lg text-xs border border-rose-900 cursor-pointer">حذف 🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نموذج إضافة مقال مع أداة التنسيق والخطوط */}
        <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <h1 className="text-xl font-bold text-white">إنشاء مقال جديد 🚀</h1>
          
          {submitted && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-300 text-xs text-center">
              ✨ تم إرسال مقالك بنجاح لرئيس التحرير!
            </div>
          )}

          <form onSubmit={handleSubmitArticle} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="عنوان المقال..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none" 
              />
              <input 
                type="text" 
                placeholder="القسم (فيزياء، طب، هندسة...)..." 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none" 
              />
            </div>

            {/* 🎛️ شريط أدوات التحكم بالخطوط والتنسيق (30 خطاً) */}
            <div className="bg-slate-950 border border-blue-900/80 rounded-xl p-3 flex flex-wrap items-center gap-3 shadow-inner">
              <span className="text-xs text-amber-400 font-bold border-l border-blue-900 pl-3">أدوات التنسيق:</span>

              {/* اختيار نوع الخط (30 خطاً) */}
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="bg-slate-900 text-xs text-gray-200 border border-blue-900 rounded-lg p-2 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <optgroup label="الخطوط العربية (15 خطاً)">
                  <option value="font-tajawal">Tajawal - تجوال (حديث ومريح)</option>
                  <option value="font-cairo">Cairo - القاهرة (العصري الشهير)</option>
                  <option value="font-almarai">Almarai - المراعي (واضح وأنيق)</option>
                  <option value="font-alexandria">Alexandria - الإسكندرية (هندسي تقني)</option>
                  <option value="font-ibm-arabic">IBM Plex Arabic - خط آي بي إم</option>
                  <option value="font-noto">Noto Kufi - كوفي كلاسيكي حديث</option>
                  <option value="font-changa">Changa - شانغا (عريض ومميز)</option>
                  <option value="font-amiri">Amiri - أميري (نسخي فخم)</option>
                  <option value="font-aref">Aref Ruqaa - رقعة كلاسيكي</option>
                  <option value="font-el-messiri">El Messiri - المسيري (فني راقي)</option>
                  <option value="font-marhey">Marhey - مرحي (إبداعي ومرح)</option>
                  <option value="font-lalezar">Lalezar - لاليزار (عريض عناوين)</option>
                  <option value="font-lemonada">Lemonada - ليمونادة (انسيابي)</option>
                  <option value="font-kufam">Kufam - كوفام (زخرفي مميز)</option>
                  <option value="font-lateef">Lateef - لطيف (نسخي دافئ)</option>
                </optgroup>

                <optgroup label="English Fonts (15 Fonts)">
                  <option value="font-inter">Inter (Clean & Modern UI)</option>
                  <option value="font-roboto">Roboto (Standard Android Font)</option>
                  <option value="font-poppins">Poppins (Geometric & Friendly)</option>
                  <option value="font-montserrat">Montserrat (Bold & Editorial)</option>
                  <option value="font-lato">Lato (Warm & Professional)</option>
                  <option value="font-oswald">Oswald (Condensed Titles)</option>
                  <option value="font-playfair">Playfair Display (Luxury Serif)</option>
                  <option value="font-merriweather">Merriweather (Classic Editorial)</option>
                  <option value="font-lora">Lora (Elegant Book Style)</option>
                  <option value="font-cinzel">Cinzel (Cinematic & Royal)</option>
                  <option value="font-space">Space Grotesk (Tech & Cyberpunk)</option>
                  <option value="font-syne">Syne (Artistic & Unique)</option>
                  <option value="font-fira">Fira Code (Developer / Monospace)</option>
                  <option value="font-pacifico">Pacifico (Handwritten Script)</option>
                </optgroup>
              </select>

              {/* اختيار الحجم */}
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-slate-900 text-xs text-gray-200 border border-blue-900 rounded-lg p-2 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="text-xs">حجم صغير جداً (XS)</option>
                <option value="text-sm">حجم صغير (SM)</option>
                <option value="text-base">حجم عادي (MD)</option>
                <option value="text-lg">حجم كبير (LG)</option>
                <option value="text-xl">عنوان فرعي (XL)</option>
                <option value="text-2xl">عنوان عريض (2XL)</option>
              </select>

              {/* سمك الخط (عريض Bold) */}
              <button
                type="button"
                onClick={() => setIsBold(!isBold)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isBold ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-gray-300 border-blue-900'
                }`}
              >
                عريض (B)
              </button>

              {/* مائل Italic */}
              <button
                type="button"
                onClick={() => setIsItalic(!isItalic)}
                className={`px-3 py-1.5 rounded-lg text-xs italic border transition-all cursor-pointer ${
                  isItalic ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-gray-300 border-blue-900'
                }`}
              >
                مائل (I)
              </button>

              {/* اتجاه المحاذاة */}
              <div className="flex gap-1 border-r border-blue-900 pr-3">
                <button
                  type="button"
                  onClick={() => setTextAlign('text-right')}
                  className={`p-1.5 rounded text-xs border cursor-pointer ${textAlign === 'text-right' ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-900 text-gray-400 border-blue-900'}`}
                  title="يمين"
                >
                  ➡️
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('text-center')}
                  className={`p-1.5 rounded text-xs border cursor-pointer ${textAlign === 'text-center' ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-900 text-gray-400 border-blue-900'}`}
                  title="وسط"
                >
                  ↔️
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('text-left')}
                  className={`p-1.5 rounded text-xs border cursor-pointer ${textAlign === 'text-left' ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-900 text-gray-400 border-blue-900'}`}
                  title="يسار"
                >
                  ⬅️
                </button>
              </div>
            </div>

            {/* مربع كتابة محتوى المقال (المعاينة الحية) */}
            <textarea 
              rows={8} 
              placeholder="اكتب محتوى المقال هنا مع معاينة حية للتنسيق والخط المختار..." 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
              className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-blue-950 text-white focus:outline-none resize-none leading-relaxed ${selectedFont} ${selectedSize} ${isBold ? 'font-bold' : 'font-normal'} ${isItalic ? 'italic' : ''} ${textAlign}`} 
            />

            <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg transition-all">
              إرسال لرئيس التحرير 📤
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
