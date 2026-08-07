'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  writer: string;
  category: string;
  content: string;
  status: 'pending' | 'published' | 'rejected';
  feedback?: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

interface UserRequest {
  id: number;
  name: string;
  role: 'كاتب' | 'محرر';
  bio?: string;
  date: string;
}

export default function WriterDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [writerName, setWriterName] = useState('');

  // حالات تسجيل طلب جديد
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regBio, setRegBio] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  // حالات المقالات
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // 1. استرجاع المقالات ورؤية ما إذا كان المستخدم سجل دخوله سابقاً
  useEffect(() => {
    // جلب المقالات
    const savedArticles = localStorage.getItem('prometheus_articles');
    if (savedArticles) {
      try {
        setMyArticles(JSON.parse(savedArticles));
      } catch (e) {}
    }

    // استرجاع جلسة الكاتب السابقة إن وجدت
    const savedWriterSession = localStorage.getItem('prometheus_active_writer');
    if (savedWriterSession) {
      setWriterName(savedWriterSession);
      setIsAuthenticated(true);
    }
  }, []);

  // 2. تسجيل الدخول والتحقق المباشر من موافقة الأدمن
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedAdminPassword = localStorage.getItem('prometheus_admin_password') || 'admin123';
    const approvedMembers: TeamMember[] = JSON.parse(localStorage.getItem('prometheus_team_members') || '[]');

    const cleanWriterName = writerName.trim().toLowerCase();

    if (!cleanWriterName) {
      alert('يرجى كتابة اسمك الصريح!');
      return;
    }

    // فحص كلمة المرور
    if (passwordInput !== savedAdminPassword) {
      alert('كلمة المرور غير صحيحة!');
      return;
    }

    // فحص هل الأدمن وافق على الاسم أم لا
    const isApproved = approvedMembers.some(
      m => m.name.trim().toLowerCase() === cleanWriterName
    );

    if (!isApproved) {
      alert('اسمك غير موجود في قائمة المقبولين لدى الأدمن! إما أن الأدمن لم يوافق بعد، أو أنك لم تقدم طلب انضمام.');
      return;
    }

    // دخول ناجح وحفظ الجلسة
    setIsAuthenticated(true);
    localStorage.setItem('prometheus_active_writer', writerName.trim());
  };

  // 3. تقديم طلب جديد للأدمن
  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const newRequest: UserRequest = {
      id: Date.now(),
      name: regName.trim(),
      role: 'كاتب',
      bio: regBio,
      date: new Date().toLocaleDateString('ar-EG'),
    };

    const existingRequests: UserRequest[] = JSON.parse(localStorage.getItem('prometheus_pending_requests') || '[]');
    localStorage.setItem('prometheus_pending_requests', JSON.stringify([newRequest, ...existingRequests]));

    // حفظ الاسم مؤقتاً ليسهل عليه الدخول فور موافقة الأدمن
    setWriterName(regName.trim());
    setRequestSent(true);
    setRegName('');
    setRegBio('');
  };

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('prometheus_active_writer');
    setIsAuthenticated(false);
    setWriterName('');
    setPasswordInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category || !writerName) return;

    const newArticle: Article = {
      id: Date.now(),
      title,
      writer: writerName,
      category,
      content,
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

  const handleResubmit = (id: number) => {
    if (!editContent) return;
    const updated = myArticles.map(art => 
      art.id === id ? { ...art, content: editContent, status: 'pending' as const, feedback: undefined } : art
    );
    setMyArticles(updated);
    localStorage.setItem('prometheus_articles', JSON.stringify(updated));
    setEditingId(null);
    setEditContent('');
  };

  // شاشة الدخول والتسجيل
  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl max-w-md w-full p-8 shadow-2xl flex flex-col gap-6 text-center">
          
          {requestSent ? (
            <div className="flex flex-col gap-4">
              <span className="text-4xl">⏳</span>
              <h1 className="text-lg font-bold text-amber-400">تم إرسال طلبك بنجاح!</h1>
              <p className="text-xs text-gray-300">
                طلبك الآن لدى الأدمن للموافقة. عند موافقة الأدمن، يمكنك تسجيل الدخول باسمك (<span className="text-amber-400 font-bold">{writerName}</span>) وكلمة المرور مباشرة دون الحاجة لطلب جديد!
              </p>
              <button 
                onClick={() => { setRequestSent(false); setIsRegistering(false); }}
                className="mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                الانتقال لتسجيل الدخول 🔑
              </button>
            </div>
          ) : isRegistering ? (
            <form onSubmit={handleSendRequest} className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-bold text-amber-400 mb-1">تقديم طلب انضمام ككاتب ✍️</h1>
                <p className="text-xs text-gray-400">أدخل اسمك وسيصل للوحة الأدمن فوراً للموافقة عليه.</p>
              </div>
              <input 
                type="text" 
                placeholder="اسمك الثلاثي الصريح..." 
                value={regName} 
                onChange={(e) => setRegName(e.target.value)} 
                required 
                className="px-4 py-3 rounded-xl bg-slate-950 border border-blue-950 text-sm text-white focus:outline-none text-center"
              />
              <textarea 
                placeholder="نبذة مختصرة عن كتاباتك..." 
                value={regBio} 
                onChange={(e) => setRegBio(e.target.value)} 
                rows={3}
                className="px-4 py-3 rounded-xl bg-slate-950 border border-blue-950 text-xs text-white focus:outline-none resize-none"
              />
              <button type="submit" className="py-3 bg-amber-500 hover:bg-amber-400 font-bold text-sm rounded-xl text-slate-950 cursor-pointer transition-all">
                إرسال الطلب للأدمن 🚀
              </button>
              <button 
                type="button" 
                onClick={() => setIsRegistering(false)} 
                className="text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                وافق الأدمن على طلبك؟ سجل دخولك من هنا
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-bold text-amber-400 mb-1">تسجيل دخول الكاتب ✍️</h1>
                <p className="text-xs text-gray-400">أدخل اسمك المقبول من الأدمن وكلمة المرور.</p>
              </div>
              <input 
                type="text" 
                placeholder="اسم الكاتب..." 
                value={writerName} 
                onChange={(e) => setWriterName(e.target.value)} 
                required 
                className="px-4 py-3 rounded-xl bg-slate-950 border border-blue-950 text-sm text-white focus:outline-none text-center"
              />
              <input 
                type="password" 
                placeholder="كلمة المرور..." 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                required 
                className="px-4 py-3 rounded-xl bg-slate-950 border border-blue-950 text-sm text-white focus:outline-none text-center"
              />
              <button type="submit" className="py-3 bg-amber-500 hover:bg-amber-400 font-bold text-sm rounded-xl text-slate-950 cursor-pointer transition-all">
                دخول 🔓
              </button>
              <button 
                type="button" 
                onClick={() => setIsRegistering(true)} 
                className="text-xs text-amber-400 hover:underline mt-1 cursor-pointer"
              >
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
            أهلاً بك، {writerName} ✍️
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="text-xs text-rose-400 hover:underline cursor-pointer">
            تسجيل خروج 🔒
          </button>
          <Link href="/" className="text-xs text-gray-300 hover:underline">
            الرئيسية 🏠
          </Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-4 py-10 w-full flex-1 flex flex-col gap-10">
        
        {/* متابعة المقالات */}
        {myArticles.length > 0 && (
          <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold text-amber-400">حالة مقالاتك المرسلة 📋</h2>
            <div className="flex flex-col gap-3">
              {myArticles.map(art => (
                <div key={art.id} className="bg-slate-950/60 p-4 rounded-xl border border-blue-950 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{art.title}</span>
                    <div className="flex gap-2 items-center">
                      {art.status === 'pending' && <span className="text-xs bg-amber-950/50 text-amber-400 px-2.5 py-1 rounded-full border border-amber-900">قيد المراجعة ⏳</span>}
                      {art.status === 'published' && <span className="text-xs bg-emerald-950/50 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-900">منشور ✅</span>}
                      {art.status === 'rejected' && <span className="text-xs bg-rose-950/50 text-rose-400 px-2.5 py-1 rounded-full border border-rose-900">يحتاج تعديل ✍️</span>}

                      <button onClick={() => handleDeleteArticle(art.id)} className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 px-2.5 py-1 rounded-lg text-xs border border-rose-900 cursor-pointer">
                        حذف 🗑️
                      </button>
                    </div>
                  </div>

                  {art.status === 'rejected' && art.feedback && (
                    <div className="bg-rose-950/30 border border-rose-900/50 p-3 rounded-lg text-xs text-rose-200 mt-2 flex flex-col gap-2">
                      <p><strong>⚠️ ملاحظات رئيس التحرير:</strong> {art.feedback}</p>
                      {editingId !== art.id ? (
                        <button onClick={() => { setEditingId(art.id); setEditContent(art.content); }} className="self-start px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold cursor-pointer">
                          تعديل المقال وإعادة الإرسال 🛠
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2 mt-2">
                          <textarea rows={4} value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 rounded-lg bg-slate-900 border border-rose-800 text-white text-xs resize-none focus:outline-none"></textarea>
                          <div className="flex gap-2">
                            <button onClick={() => handleResubmit(art.id)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer">حفظ وإعادة الإرسال 🚀</button>
                            <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs cursor-pointer">إلغاء</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نموذج كتابة المقال */}
        <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <h1 className="text-xl font-bold text-white">إنشاء مقال جديد 🚀</h1>
          {submitted && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-300 text-xs text-center">
              ✨ تم إرسال مقالك بنجاح لرئيس التحرير!
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">اسم الكاتب:</label>
              <input type="text" value={writerName} disabled className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-blue-950 text-sm text-gray-400 font-bold cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">عنوان المقال:</label>
              <input type="text" placeholder="عنوان المقال..." value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">القسم:</label>
              <input type="text" placeholder="القسم (فيزياء، طب، هندسة...)" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">المحتوى:</label>
              <textarea rows={8} placeholder="اكتب المحتوى هنا..." value={content} onChange={(e) => setContent(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none resize-none" />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg">
              إرسال لرئيس التحرير 🚀
            </button>
          </form>
        </div>

      </section>

      <footer className="text-center py-6 text-xs text-gray-500 border-t border-blue-950/40">
        جميع الحقوق محفوظة © {new Date().getFullYear()} Prometheus
      </footer>
    </main>
  );
}
