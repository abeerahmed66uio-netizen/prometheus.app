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

export default function WriterDashboard() {
  // حالات المصادقة وتسجيل الدخول
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [writerNameInput, setWriterNameInput] = useState('');

  // حالات كتابة المقال
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // قائمة مقالات الكاتب الخاصة به (لإظهار الملاحظات وتعديلها وحذفها)
  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // جلب المقالات عند فتح الصفحة
  useEffect(() => {
    const saved = localStorage.getItem('prometheus_articles');
    if (saved) {
      try {
        const allArticles: Article[] = JSON.parse(saved);
        setMyArticles(allArticles);
      } catch (e) {
        setMyArticles([]);
      }
    }
  }, []);

  // تسجيل الدخول باستخدام الاسم وكلمة المرور المسجلة لدى الأدمن
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedAdminPassword = localStorage.getItem('prometheus_admin_password') || 'admin123';

    if (!writerNameInput.trim()) {
      alert('يرجى كتابة الاسم الصريح!');
      return;
    }

    if (passwordInput === savedAdminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('كلمة المرور غير صحيحة! يرجى مراجعة الأدمن.');
    }
  };

  // إرسال مقال جديد
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category || !writerNameInput) return;

    const newArticle: Article = {
      id: Date.now(),
      title,
      writer: writerNameInput,
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

  // حذف مقالة من قائمة الكاتب والمخزن الرئيسي
  const handleDeleteArticle = (id: number) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذه المقالة؟')) {
      const updated = myArticles.filter(art => art.id !== id);
      setMyArticles(updated);
      localStorage.setItem('prometheus_articles', JSON.stringify(updated));
      
      // تحديث المقالات المنشورة في حال كانت المقالة منشورة
      const publishedArticles = localStorage.getItem('prometheus_published_articles');
      if (publishedArticles) {
        try {
          const parsedPublished: Article[] = JSON.parse(publishedArticles);
          const updatedPublished = parsedPublished.filter(art => art.id !== id);
          localStorage.setItem('prometheus_published_articles', JSON.stringify(updatedPublished));
        } catch (e) {}
      }
    }
  };

  // إعادة إرسال المقال بعد تعديله بناءً على ملاحظات رئيس التحرير
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

  // شاشة إدخال الاسم وكلمة المرور
  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl max-w-md w-full p-8 shadow-2xl flex flex-col gap-6 text-center">
          <div>
            <h1 className="text-xl font-bold text-amber-400 mb-2">تسجيل دخول الكاتب ✍️</h1>
            <p className="text-xs text-gray-400">يرجى كتابة اسمك الصريح وكلمة المرور الخاصة بلوحة الكتاب.</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="اسم الكاتب الصريح..." 
              value={writerNameInput} 
              onChange={(e) => setWriterNameInput(e.target.value)} 
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
          </form>
          <Link href="/" className="text-xs text-gray-400 hover:underline">العودة إلى الصفحة الرئيسية 🏠</Link>
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
        <Link href="/" className="text-xs text-rose-400 hover:underline">
          الرئيسية 🏠
        </Link>
      </nav>

      <section className="max-w-3xl mx-auto px-4 py-10 w-full flex-1 flex flex-col gap-10">
        
        {/* قسم متابعة المقالات وإدارتها (الملاحظات والحذف) */}
        {myArticles.length > 0 && (
          <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold text-amber-400">حالة مقالاتك المرسلة 📋</h2>
            <div className="flex flex-col gap-3">
              {myArticles.map(art => (
                <div key={art.id} className="bg-slate-950/60 p-4 rounded-xl border border-blue-950 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{art.title}</span>
                    <div className="flex gap-2 items-center">
                      {art.status === 'pending' && (
                        <span className="text-xs bg-amber-950/50 text-amber-400 px-2.5 py-1 rounded-full border border-amber-900">
                          قيد المراجعة ⏳
                        </span>
                      )}
                      {art.status === 'published' && (
                        <span className="text-xs bg-emerald-950/50 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-900">
                          منشور ✅
                        </span>
                      )}
                      {art.status === 'rejected' && (
                        <span className="text-xs bg-rose-950/50 text-rose-400 px-2.5 py-1 rounded-full border border-rose-900">
                          يحتاج تعديل ✍️
                        </span>
                      )}

                      {/* زر حذف المقالة */}
                      <button 
                        onClick={() => handleDeleteArticle(art.id)}
                        className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 px-2.5 py-1 rounded-lg text-xs border border-rose-900 cursor-pointer transition-all"
                      >
                        حذف 🗑️
                      </button>
                    </div>
                  </div>

                  {/* إظهار ملاحظات رئيس التحرير إن وجدت */}
                  {art.status === 'rejected' && art.feedback && (
                    <div className="bg-rose-950/30 border border-rose-900/50 p-3 rounded-lg text-xs text-rose-200 mt-2 flex flex-col gap-2">
                      <p><strong>⚠️ ملاحظات رئيس التحرير:</strong> {art.feedback}</p>
                      
                      {editingId !== art.id ? (
                        <button 
                          onClick={() => { setEditingId(art.id); setEditContent(art.content); }}
                          className="self-start px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold cursor-pointer"
                        >
                          تعديل المقال وإعادة الإرسال 🛠
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2 mt-2">
                          <textarea 
                            rows={4}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 rounded-lg bg-slate-900 border border-rose-800 text-white text-xs resize-none focus:outline-none"
                          ></textarea>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleResubmit(art.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              حفظ وإعادة الإرسال للمحرر 🚀
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs cursor-pointer"
                            >
                              إلغاء
                            </button>
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

        {/* نموذج إنشاء مقال جديد */}
        <div>
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">إنشاء مقال جديد</h1>
            <p className="text-gray-400 text-sm">اكتب عنوان المقال والقسم والمحتوى بدقة، وسيتم إرساله لرئيس التحرير.</p>
          </div>

          {submitted && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-300 text-center text-sm animate-pulse">
              ✨ تم إرسال مقالك بنجاح إلى لوحة رئيس التحرير للمراجعة!
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">اسم الكاتب</label>
              <input 
                type="text" 
                value={writerNameInput}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-blue-950 text-sm text-gray-400 font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">عنوان المقال</label>
              <input 
                type="text" 
                placeholder="عنوان المقال..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">القسم (فيزياء، هندسة، طب...)</label>
              <input 
                type="text" 
                placeholder="أدخل القسم..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">محتوى المقال</label>
              <textarea 
                rows={8}
                placeholder="اكتب المحتوى هنا..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg"
            >
              إرسال المقال لرئيس التحرير 🚀
            </button>
          </form>
        </div>

      </section>
    </main>
  );
}
