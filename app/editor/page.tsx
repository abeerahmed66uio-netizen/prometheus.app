'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  writer?: string;
  author?: string;
  category: string;
  content: string;
  status: 'pending' | 'published' | 'rejected';
  feedback?: string;
  date?: string;
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

export default function EditorDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editorNameInput, setEditorNameInput] = useState('');
  const [regName, setRegName] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [bookTitle, setBookTitle] = useState('');
  const [bookCategory, setBookCategory] = useState('');
  const [bookUploaded, setBookUploaded] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState<{ [key: number]: string }>({});
  const [activeFeedbackId, setActiveFeedbackId] = useState<number | null>(null);

  useEffect(() => {
    // جلب المقالات من المخزن
    const saved = localStorage.getItem('prometheus_articles');
    if (saved) {
      try {
        setArticles(JSON.parse(saved));
      } catch (e) {}
    }

    // استرجاع جلسة المحرر المحفوظة سابقاً
    const savedEditor = localStorage.getItem('prometheus_active_editor');
    if (savedEditor) {
      setEditorNameInput(savedEditor);
      setIsAuthenticated(true);
    }
  }, []);

  // 🔴 تصحيح الفحص: قراءة أسماء المقبولين من prometheus_approved_logins
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const approvedLogins: ApprovedLogin[] = JSON.parse(
      localStorage.getItem('prometheus_approved_logins') || '[]'
    );
    
    const cleanName = editorNameInput.trim().toLowerCase();

    if (!cleanName) {
      alert('يرجى إدخال الاسم!');
      return;
    }

    // مطابقة الاسم مع قائمة المفعّلين لدى الأدمن (سواء محرر أو أدمن)
    const isApproved = approvedLogins.some(
      u => u.name.trim().toLowerCase() === cleanName && (u.role === 'محرر' || u.role === 'أدمن' || u.role === 'رئيس تحرير')
    );

    if (isApproved) {
      setIsAuthenticated(true);
      localStorage.setItem('prometheus_active_editor', editorNameInput.trim());
    } else {
      alert('عذراً، هذا الاسم غير مقبول من قبل الأدمن بعد! أو أنك لم تقدم طلب انضمام كمحرر.');
    }
  };

  // إرسال طلب انضمام كمحرر للوحة الأدمن
  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const newRequest: PendingRequest = {
      id: Date.now(),
      name: regName.trim(),
      role: 'محرر',
      date: new Date().toLocaleDateString('ar-EG'),
    };

    const pending: PendingRequest[] = JSON.parse(
      localStorage.getItem('prometheus_pending_requests') || '[]'
    );
    localStorage.setItem('prometheus_pending_requests', JSON.stringify([newRequest, ...pending]));

    setEditorNameInput(regName.trim());
    setRequestSent(true);
    setRegName('');
  };

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('prometheus_active_editor');
    setIsAuthenticated(false);
    setEditorNameInput('');
  };

  const updateArticlesState = (updated: Article[]) => {
    setArticles(updated);
    localStorage.setItem('prometheus_articles', JSON.stringify(updated));

    const publishedOnly = updated
      .filter(art => art.status === 'published')
      .map(art => ({
        id: art.id,
        title: art.title,
        author: art.writer || art.author || 'كاتب بروميثوس',
        category: art.category,
        content: art.content,
        date: art.date || '2026/08/07'
      }));
    
    localStorage.setItem('prometheus_published_articles', JSON.stringify(publishedOnly));
  };

  const handleApprove = (id: number) => {
    const updated = articles.map(art => art.id === id ? { ...art, status: 'published' as const } : art);
    updateArticlesState(updated);
    alert('تمت الموافقة ونشر المقالة رسمياً في المجلة بالصفحة الرئيسية بنجاح! 📖🚀');
  };

  const handleRejectWithFeedback = (id: number) => {
    const note = feedbackInput[id];
    if (!note) return;
    const updated = articles.map(art => art.id === id ? { ...art, status: 'rejected' as const, feedback: note } : art);
    updateArticlesState(updated);
    setActiveFeedbackId(null);
  };

  const handleDeleteArticle = (id: number) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذه المقالة؟')) {
      const updated = articles.filter(art => art.id !== id);
      updateArticlesState(updated);
    }
  };

  const handleUploadBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookCategory) return;
    setBookUploaded(true);
    setTimeout(() => {
      setBookTitle('');
      setBookCategory('');
      setBookUploaded(false);
    }, 3000);
  };

  // الشاشة الأولى: تسجيل الدخول بالاسم أو طلب انضمام
  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl max-w-md w-full p-8 shadow-2xl flex flex-col gap-6 text-center">
          
          {requestSent ? (
            <div className="flex flex-col gap-4">
              <span className="text-4xl">⏳</span>
              <h1 className="text-lg font-bold text-amber-400">تم إرسال طلبك بنجاح!</h1>
              <p className="text-xs text-gray-300">
                طلبك كمحرر بانتظار موافقة الأدمن. بمجرد الموافقة، ادخل واكتب اسمك (<span className="text-amber-400 font-bold">{editorNameInput}</span>) وسيفتح السيستم لك فوراً!
              </p>
              <button 
                onClick={() => { setRequestSent(false); setIsRegistering(false); }}
                className="mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                جرب تسجيل الدخول 🔑
              </button>
            </div>
          ) : isRegistering ? (
            /* نموذج طلب جديد */
            <form onSubmit={handleSendRequest} className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-bold text-amber-400 mb-1">تقديم طلب انضمام كمحرر 📝</h1>
                <p className="text-xs text-gray-400">أدخل اسمك وسيتم إرسال الطلب للأدمن للموافقة عليه.</p>
              </div>
              <input 
                type="text" 
                placeholder="اسمك الثلاثي..." 
                value={regName} 
                onChange={(e) => setRegName(e.target.value)} 
                required 
                className="px-4 py-3 rounded-xl bg-slate-950 border border-blue-950 text-sm text-white focus:outline-none text-center"
              />
              <button type="submit" className="py-3 bg-amber-500 hover:bg-amber-400 font-bold text-sm rounded-xl text-slate-950 cursor-pointer transition-all">
                إرسال الطلب للأدمن 🚀
              </button>
              <button 
                type="button" 
                onClick={() => setIsRegistering(false)} 
                className="text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                قدمت طلباً سابقاً؟ تسجيل الدخول باسمك
              </button>
            </form>
          ) : (
            /* نموذج تسجيل الدخول بالاسم المقبول */
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-bold text-amber-400 mb-1">تسجيل دخول المحرر 📝</h1>
                <p className="text-xs text-gray-400">ادخل اسمك المقبول لفتح النافذة الخاصة بك.</p>
              </div>
              <input 
                type="text" 
                placeholder="أدخل اسمك المقبول..." 
                value={editorNameInput} 
                onChange={(e) => setEditorNameInput(e.target.value)} 
                required 
                className="px-4 py-3 rounded-xl bg-slate-950 border border-blue-950 text-sm text-white focus:outline-none text-center"
              />
              <button type="submit" className="py-3 bg-amber-500 hover:bg-amber-400 font-bold text-sm rounded-xl text-slate-950 cursor-pointer transition-all">
                دخول 🔓
              </button>
              <button 
                type="button" 
                onClick={() => setIsRegistering(true)} 
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                محرر جديد؟ تقديم طلب انضمام للأدمن ➕
              </button>
            </form>
          )}

          <Link href="/" className="text-xs text-gray-400 hover:underline pt-2 border-t border-blue-950">العودة إلى الصفحة الرئيسية 🏠</Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex flex-col justify-between font-sans">
      
      {/* شريط التنقل العلوي */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-blue-950/40 bg-[#070b19]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold">
            PROMETHEUS <span className="text-amber-500">🔥</span>
          </Link>
          <span className="text-xs bg-amber-950 text-amber-400 px-3 py-1 rounded-full border border-amber-900 font-bold">
            أهلاً بك، {editorNameInput} 📝
          </span>
        </div>
        <button onClick={handleLogout} className="text-xs text-rose-400 hover:underline cursor-pointer">
          تسجيل خروج 🔒
        </button>
      </nav>

      {/* قسم المراجعات والرفع */}
      <section className="max-w-5xl mx-auto px-4 py-10 w-full flex-1 flex flex-col gap-10">
        <div>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold mb-1">إدارة ومراجعة المقالات الواردة</h1>
              <p className="text-gray-400 text-sm">المقالات المرسلة من الكُتّاب ونشرها الفوري للمجلة</p>
            </div>
            <span className="bg-blue-950 text-blue-400 border border-blue-900 px-3 py-1 rounded-xl text-xs font-bold">
              {articles.filter(a => a.status === 'pending').length} معلق
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {articles.length === 0 ? (
              <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-8 text-center text-gray-400">
                <p className="text-sm">لا توجد مقالات معلقة حالياً.</p>
                <p className="text-xs text-gray-500 mt-2">اذهب إلى صفحة الكاتب، اكتب مقالاً وأرسله، ليظهر هنا فوراً!</p>
              </div>
            ) : (
              articles.map((art) => (
                <div key={art.id} className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-900 px-2.5 py-1 rounded-lg ml-2">
                        {art.category}
                      </span>
                      <h2 className="text-lg font-bold inline-block">{art.title}</h2>
                      <p className="text-xs text-gray-400 mt-1">
                        الكاتب: <span className="text-amber-400 font-bold">{art.writer || art.author || 'غير محدد'}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {art.status === 'pending' && <span className="bg-amber-950/50 text-amber-400 border border-amber-800/60 px-3 py-1 rounded-full text-xs">انتظار المراجعة ⏳</span>}
                      {art.status === 'published' && <span className="bg-emerald-950/50 text-emerald-400 border border-emerald-800/60 px-3 py-1 rounded-full text-xs">منشور بالمجلة ✅</span>}
                      {art.status === 'rejected' && <span className="bg-rose-950/50 text-rose-300 border border-rose-800/60 px-3 py-1 rounded-full text-xs">مرفوض مع ملاحظات ↩️</span>}
                      
                      <button 
                        onClick={() => handleDeleteArticle(art.id)}
                        className="bg-rose-950/40 hover:bg-rose-900 text-rose-300 p-1.5 rounded-lg border border-rose-900 text-xs cursor-pointer transition-all"
                        title="حذف المقال"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 bg-slate-950/40 p-3 rounded-xl border border-blue-950 whitespace-pre-wrap">
                    {art.content}
                  </p>

                  {art.feedback && (
                    <div className="text-xs bg-rose-950/20 text-rose-300 border border-rose-900/40 p-3 rounded-xl">
                      <strong>ملاحظات رئيس التحرير:</strong> {art.feedback}
                    </div>
                  )}

                  {art.status === 'pending' && (
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-blue-950">
                      <button onClick={() => handleApprove(art.id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all">
                        موافقة ونشر مباشر بالمجلة 🚀
                      </button>
                      <button onClick={() => setActiveFeedbackId(activeFeedbackId === art.id ? null : art.id)} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all">
                        رفض مع ملاحظات للتعديل ✍️
                      </button>
                    </div>
                  )}

                  {activeFeedbackId === art.id && (
                    <div className="flex flex-col gap-2 pt-3 border-t border-blue-950">
                      <textarea
                        placeholder="اكتب ملاحظاتك للكاتب..."
                        value={feedbackInput[art.id] || ''}
                        onChange={(e) => setFeedbackInput({ ...feedbackInput, [art.id]: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/50 text-xs text-white focus:outline-none resize-none"
                        rows={2}
                      ></textarea>
                      <button onClick={() => handleRejectWithFeedback(art.id)} className="self-start px-4 py-1.5 bg-rose-700 hover:bg-rose-600 text-white text-xs rounded-lg font-bold cursor-pointer">
                        إرسال الملاحظات
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* نموذج رفع الكتب */}
        <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-2">رفع كتاب جديد مباشرة 📚</h2>
          {bookUploaded && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs text-center">
              ✨ تمت إضافة الكتاب ونشره بنجاح!
            </div>
          )}
          <form onSubmit={handleUploadBook} className="flex flex-col md:flex-row gap-4 mt-4">
            <input type="text" placeholder="عنوان الكتاب..." value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} required className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none" />
            <input type="text" placeholder="القسم أو التصنيف..." value={bookCategory} onChange={(e) => setBookCategory(e.target.value)} required className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none" />
            <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl cursor-pointer transition-all">
              رفع الكتاب 📤
            </button>
          </form>
        </div>
      </section>

      {/* التذييل */}
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-blue-950/40">
        جميع الحقوق محفوظة © {new Date().getFullYear()} Prometheus
      </footer>

    </main>
  );
}
