'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  volunteerHours: number;
  bio?: string;
}

interface Article {
  id: number;
  title: string;
  author: string;
  category: string;
  content: string;
  date: string;
}

export default function Home() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showMagazineModal, setShowMagazineModal] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  
  // حالة لتخزين الكاتب الذي يتم عرض بروفايله حالياً عند النقر على اسمه
  const [selectedWriter, setSelectedWriter] = useState<TeamMember | null>(null);

  useEffect(() => {
    // جلب الأعضاء المخزنين
    const savedMembers = localStorage.getItem('prometheus_team_members');
    if (savedMembers) {
      try {
        setMembers(JSON.parse(savedMembers));
      } catch (e) {}
    }

    // جلب المقالات المنشورة في المجلة الرسمية
    const savedArticles = localStorage.getItem('prometheus_published_articles');
    if (savedArticles) {
      try {
        setArticles(JSON.parse(savedArticles));
      } catch (e) {}
    }
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-[#070b19] text-white p-6 md:p-10 font-sans flex flex-col justify-between">
      
      {/* شريط التنقل العلوي */}
      <nav className="max-w-6xl mx-auto w-full flex justify-between items-center border-b border-blue-950 pb-4 relative">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">PROMETHEUS</span>
          <span className="text-amber-500">🔥</span>
        </div>
        
        <div className="flex gap-6 text-sm items-center">
          <Link href="/" className="text-amber-400 font-bold">الرئيسية</Link>
          <Link href="/team" className="text-gray-300 hover:text-white">عن الفريق</Link>
          <Link href="/team" className="text-gray-300 hover:text-white">الأعضاء</Link>
          
          {/* زر تسجيل الدخول الموحد */}
          <div className="relative">
            <button 
              onClick={() => setShowLoginMenu(!showLoginMenu)}
              className="bg-slate-900 hover:bg-slate-800 text-gray-200 px-4 py-2 rounded-xl border border-blue-900/60 transition-all text-xs flex items-center gap-2 cursor-pointer"
            >
              <span>تسجيل الدخول 🔑</span>
              <span>▾</span>
            </button>

            {showLoginMenu && (
              <div className="absolute left-0 mt-2 bg-[#0e1630] border border-blue-900 rounded-xl p-2 shadow-2xl flex items-center gap-2 z-50 whitespace-nowrap">
                <Link href="/writer" onClick={() => setShowLoginMenu(false)} className="bg-blue-950/80 hover:bg-blue-900 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-900 text-xs transition-all">كاتب ✍️</Link>
                <Link href="/editor" onClick={() => setShowLoginMenu(false)} className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-900 text-xs transition-all">محرر 📝</Link>
                <Link href="/admin" onClick={() => setShowLoginMenu(false)} className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 px-3 py-1.5 rounded-lg border border-rose-900 text-xs transition-all">أدمن ⚙️</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-8 my-8">
        
        <div className="text-center py-10 flex flex-col items-center gap-4">
          <span className="text-xs bg-amber-950/60 text-amber-400 px-4 py-1.5 rounded-full border border-amber-900/50">
            المبادرة الشاملة في منصة بروميثوس
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            نصنع التغيير ونبني <span className="text-amber-500">الأثر المستدام</span>
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl leading-relaxed">
            مبادرة شبابية تهدف لردم الفجوة بين التعليم الأكاديمي ومتطلبات الواقع عبر تعزيز المهارات والتعليم المستمر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-3 text-amber-400">عن بروميثوس 🌟</h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                تولدت فكرة ودافع الفريق تبعاً لما لوحظ من مشاكل عديدة في النظام التعليمي عامة بدءاً من الأساليب القديمة غير المفيدة بعد اليوم إلى الفجوة بين سبل الدراسة والواقع ومتطلباته، ضعف مهارات البحث العلمي، قلة الاهتمام والتوعية بالمهارات التقنية والمهارات الناعمة، وصولاً إلى الاعتماد القاتل على التلقين والحفظ المنصوص بدل الفهم والتفكير النقدي فضلاً عن نقص المبادرات والفرص المقدمة للطلبة لإبراز المواهب والإمكانيات وتنميتها.
                <br/><br/>
                وبناءً على هذا الوضع، قررنا في بروميثوس أن نتخذ دور المصلح ونساهم في التغيير بدل اللوم وارتداء دور الضحية طوال الوقت، فنعزم على إيجاد الحلول وخلقها إن لم توجد، حلول قابلة للتطبيق ومدروسة لتصنع أثراً مستمراً عبر الأجيال وللمدى الطويل.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* كارت المجلة */}
            <div 
              onClick={() => {
                const savedArticles = localStorage.getItem('prometheus_published_articles');
                if (savedArticles) {
                  try {
                    setArticles(JSON.parse(savedArticles));
                  } catch (e) {}
                }
                setShowMagazineModal(true);
              }}
              className="bg-[#0e1630] border border-blue-900/40 hover:border-amber-500/60 transition-all rounded-2xl p-6 shadow-xl flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">Prometheus Post 📖</h2>
                <p className="text-xs text-gray-300">مجلتنا الرسمية: مقالات علمية وأدبية وتاريخية صادرة عن فريق كتابة المحتوى.</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>تصفح المقالات المنشورة ({articles.length})</span>
                <span>←</span>
              </div>
            </div>

            {/* كارت بروفايلات الأعضاء */}
            <div 
              onClick={() => setShowMembersModal(true)}
              className="bg-[#0e1630] border border-blue-900/40 hover:border-amber-500/60 transition-all rounded-2xl p-6 shadow-xl flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">بروفايلات الأعضاء 👥</h2>
                <p className="text-xs text-gray-300">استكشف نخبة الأعضاء ومتطوعين: أدوارهم، إنجازاتهم وساعات تطوعهم بداخل فريق بروميثوس.</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>انقر لعرض كروت الأعضاء ({members.length})</span>
                <span>←</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* نافذة المجلة */}
      {showMagazineModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-[#0e1630] border border-blue-900 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-6">
            
            <div className="flex justify-between items-center border-b border-blue-950 pb-4">
              <div>
                <h2 className="text-xl font-bold text-amber-400">Prometheus Post - المجلة الرسمية 📖</h2>
                <p className="text-xs text-gray-400">جميع المقالات التي تمت مراجعتها ونشرها من قِبل فريق التحرير.</p>
              </div>
              <button onClick={() => setShowMagazineModal(false)} className="px-3 py-1.5 bg-rose-950 text-rose-300 rounded-xl text-xs border border-rose-900 cursor-pointer">
                إغلاق ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {articles.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-10">لم يتم نشر أي مقالة في المجلة حتى الآن. بانتظار إبداعات الكُتّاب!</p>
              ) : (
                articles.map(art => (
                  <div key={art.id} className="bg-slate-950/60 border border-blue-950 rounded-xl p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-amber-950 text-amber-400 px-2.5 py-1 rounded-full border border-amber-900">{art.category}</span>
                      <span className="text-[10px] text-gray-400">{art.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{art.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{art.content}</p>
                    
                    {/* اسم الكاتب قابل للنقر لفتح بروفايله ومقالاته المنشورة */}
                    <div 
                      onClick={() => {
                        const matchedMember = members.find(m => m.name.trim() === art.author.trim());
                        if (matchedMember) {
                          setSelectedWriter(matchedMember);
                        } else {
                          setSelectedWriter({
                            id: 999,
                            name: art.author,
                            role: 'كاتب في بروميثوس',
                            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
                            volunteerHours: 10,
                            bio: 'كاتب مبدع يساهم في إثراء محتوى مجلة بروميثوس بمقالاته المميزة.'
                          });
                        }
                      }}
                      className="text-xs text-indigo-300 self-end font-bold cursor-pointer hover:text-amber-400 transition-colors flex items-center gap-1 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-900/60"
                    >
                      <span>الكاتب: {art.author} ✍️</span>
                      <span className="text-[10px] underline">عرض البروفايل 👤</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* نافذة الأعضاء العامة */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-[#0e1630] border border-blue-900 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-6">
            
            <div className="flex justify-between items-center border-b border-blue-950 pb-4">
              <div>
                <h2 className="text-xl font-bold text-amber-400">كروت الأعضاء والمتطوعين 🌟</h2>
                <p className="text-xs text-gray-400">استعراض كافة الأعضاء المسجلين في المنصة.</p>
              </div>
              <button onClick={() => setShowMembersModal(false)} className="px-3 py-1.5 bg-rose-950 text-rose-300 rounded-xl text-xs border border-rose-900 cursor-pointer">
                إغلاق ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {members.length === 0 ? (
                <p className="text-xs text-gray-400 col-span-full text-center py-8">لم يتم إضافة أي عضو حتى الآن.</p>
              ) : (
                members.map(member => (
                  <div 
                    key={member.id} 
                    onClick={() => setSelectedWriter(member)}
                    className="bg-slate-950/60 border border-blue-950 rounded-xl p-4 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-amber-500/60 transition-all"
                  >
                    <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-amber-500" />
                    <div>
                      <h3 className="font-bold text-sm text-white">{member.name}</h3>
                      <span className="text-xs text-indigo-300">{member.role}</span>
                    </div>
                    {member.bio && (
                      <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">{member.bio}</p>
                    )}
                    <span className="text-[10px] bg-amber-950/80 text-amber-400 px-3 py-1 rounded-full border border-amber-900 mt-auto">
                      ⏱️ {member.volunteerHours} ساعة تطوع
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* نافذة بروفايل الكاتب المحددة */}
      {selectedWriter && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex justify-center items-center p-4">
          <div className="bg-[#0e1630] border border-amber-500/50 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-6 relative">
            
            <button 
              onClick={() => setSelectedWriter(null)}
              className="absolute top-4 left-4 px-3 py-1 bg-rose-950 text-rose-300 rounded-xl text-xs border border-rose-900 cursor-pointer"
            >
              إغلاق ✕
            </button>

            {/* معلومات الكاتب الشخصية */}
            <div className="flex flex-col items-center text-center gap-3 pt-2">
              <img src={selectedWriter.image} alt={selectedWriter.name} className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 shadow-xl" />
              <div>
                <h3 className="font-bold text-xl text-white">{selectedWriter.name}</h3>
                <span className="text-xs text-indigo-300 mt-1 block font-bold">{selectedWriter.role}</span>
              </div>
              {selectedWriter.bio && (
                <p className="text-xs text-gray-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-blue-950 w-full text-right">
                  {selectedWriter.bio}
                </p>
              )}
              <span className="text-xs bg-amber-950/80 text-amber-400 px-4 py-1.5 rounded-full border border-amber-900">
                ⏱️ {selectedWriter.volunteerHours} ساعة تطوع داخل الفريق
              </span>
            </div>

            {/* مقالات الكاتب المنشورة */}
            <div className="border-t border-blue-950 pt-4 flex flex-col gap-3">
              <h4 className="text-sm font-bold text-amber-400">مقالات الكاتب المنشورة في المجلة 📝:</h4>
              
              {articles.filter(a => a.author.trim() === selectedWriter.name.trim()).length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4 bg-slate-950/40 rounded-xl">لم ينشر هذا الكاتب أي مقال حتى الآن.</p>
              ) : (
                articles
                  .filter(a => a.author.trim() === selectedWriter.name.trim())
                  .map(art => (
                    <div key={art.id} className="bg-slate-950/80 border border-blue-950 p-3.5 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-900">{art.category}</span>
                        <span className="text-gray-400">{art.date}</span>
                      </div>
                      <h5 className="font-bold text-sm text-white">{art.title}</h5>
                      <p className="text-xs text-gray-300 line-clamp-2">{art.content}</p>
                    </div>
                  ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* التذييل (Footer) */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-gray-500 border-t border-blue-950 pt-6 mt-12">
        <p>© {new Date().getFullYear()} مبادرة بروميثوس. جميع الحقوق محفوظة.</p>
      </footer>

    </main>
  );
}