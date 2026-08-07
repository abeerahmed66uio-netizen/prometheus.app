
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

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function Home() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showMagazineModal, setShowMagazineModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedWriter, setSelectedWriter] = useState<TeamMember | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    const savedMembers = localStorage.getItem('prometheus_team_members');
    if (savedMembers) {
      try {
        setMembers(JSON.parse(savedMembers));
      } catch (e) {}
    }

    const savedArticles = localStorage.getItem('prometheus_published_articles');
    if (savedArticles) {
      try {
        setArticles(JSON.parse(savedArticles));
      } catch (e) {}
    }

    const savedAchievements = localStorage.getItem('prometheus_achievements');
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (e) {}
    }
  }, []);

  const openMagazine = () => {
    const savedArticles = localStorage.getItem('prometheus_published_articles');
    if (savedArticles) {
      try {
        setArticles(JSON.parse(savedArticles));
      } catch (e) {}
    }
    setShowMagazineModal(true);
    setShowMenu(false);
  };

  const openMembers = () => {
    setShowMembersModal(true);
    setShowMenu(false);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#070b19] text-white p-4 sm:p-6 md:p-10 font-sans flex flex-col justify-between font-bold">
      
      {/* شريط التنقل العلوي */}
      <nav className="max-w-6xl mx-auto w-full flex justify-between items-center border-b border-blue-950 pb-4 relative">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-black tracking-wider">PROMETHEUS</span>
          <span className="text-amber-500 text-xl">🔥</span>
        </div>
        
        <div className="flex gap-4 sm:gap-6 text-base items-center">
          <Link href="/" className="text-amber-400 font-black text-sm sm:text-base">الرئيسية</Link>
          
          {/* قائمة الثلاث شخطات الشاملة */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="bg-slate-900 hover:bg-slate-800 text-gray-200 p-2 sm:px-3 sm:py-2 rounded-xl border border-blue-900/60 transition-all flex flex-col justify-between w-10 h-10 items-center cursor-pointer"
              aria-label="القائمة"
            >
              <div className="w-6 h-1 bg-amber-400 rounded-full"></div>
              <div className="w-6 h-1 bg-amber-400 rounded-full"></div>
              <div className="w-6 h-1 bg-amber-400 rounded-full"></div>
            </button>

            {showMenu && (
              <div className="absolute left-0 mt-2 bg-[#0e1630] border border-blue-900 rounded-xl p-2 shadow-2xl flex flex-col gap-2 z-50 min-w-[170px]">
                <button 
                  onClick={openMagazine}
                  className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 px-3 py-2 rounded-lg border border-amber-900/80 text-sm font-black transition-all text-center flex items-center justify-between cursor-pointer"
                >
                  <span>المجلة الرسمية</span>
                  <span>📖</span>
                </button>
                <button 
                  onClick={openMembers}
                  className="bg-purple-950/80 hover:bg-purple-900 text-purple-300 px-3 py-2 rounded-lg border border-purple-900/80 text-sm font-black transition-all text-center flex items-center justify-between cursor-pointer"
                >
                  <span>الأعضاء</span>
                  <span>👥</span>
                </button>
                <div className="border-t border-blue-950 my-1"></div>

                <Link href="/writer" onClick={() => setShowMenu(false)} className="bg-blue-950/80 hover:bg-blue-900 text-blue-300 px-3 py-2 rounded-lg border border-blue-900 text-sm font-black transition-all text-center flex items-center justify-between">
                  <span>كاتب</span>
                  <span>✍️</span>
                </Link>
                <Link href="/editor" onClick={() => setShowMenu(false)} className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 px-3 py-2 rounded-lg border border-indigo-900 text-sm font-black transition-all text-center flex items-center justify-between">
                  <span>محرر</span>
                  <span>📝</span>
                </Link>
                <Link href="/admin" onClick={() => setShowMenu(false)} className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 px-3 py-2 rounded-lg border border-rose-900 text-sm font-black transition-all text-center flex items-center justify-between">
                  <span>أدمن</span>
                  <span>⚙️</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-10 my-8">
        
        <div className="text-center py-6 sm:py-10 flex flex-col items-center gap-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-snug">
            نصنع التغيير ونبني <span className="text-amber-500">الأثر المستدام</span>
          </h1>
          <p className="text-gray-200 text-base sm:text-lg max-w-2xl leading-relaxed px-2 font-bold">
            مبادرة شبابية تهدف لردم الفجوة بين التعليم الأكاديمي ومتطلبات الواقع عبر تعزيز المهارات والتعليم المستمر.
          </p>
        </div>

        {/* قسم شعار واسم الفريق والصورة */}
        <div className="bg-[#0e1630] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col items-center text-center gap-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-slate-950 border-2 border-amber-500/60 flex items-center justify-center p-3 shadow-2xl">
            {/* مكان صورة شعار الفريق */}
            <span className="text-4xl">🔥</span>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400">شعار واسم الفريق</h2>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-bold max-w-3xl">
              بروميثيوس، أسمٌ من قلب الأساطير والميثولوجيا الاغريقية، بروميثيوس الذي أعطى للبشر نار المعرفة، ومن هذا الرمزية نؤمن بنشر شعلة المعرفة بين الشباب والمجتمع لتغيير الواقع نحو أبهى صوره.
              <br/><br/>
              اما عن شعار الفريق، نرى بوضوح حرفي P و T، ففي الحرف الاول نرى تجسيد لعلامة فاي-Phi، رمز النسبة الذهبية والتوازن في علوم الرياضيات، اما عن الحرف الثاني ففيه تتجسد شعلة بروميثيوس، مما نراه نحن شعلة المعرفة التي نسعى جاهدين لنشرها وتمكين الشباب العراقي وتسليحه بالعلم والثقافة.
            </p>
          </div>
        </div>

        {/* شبكة الأقسام والتعريفات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* من نحن */}
          <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 shadow-xl flex flex-col gap-3">
            <h3 className="text-xl font-black text-amber-400 border-b border-blue-950 pb-2">من نحن؟</h3>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-bold">
              مجموعة شبابية طموحة وهادفة إلى تطوير أساليب وبيئات التعليم والتعلم وتمكين الشباب والمواهب من خلال المبادرات التعليمية، الفرق والتطوعات البحثية والتقنية، مؤمنين بأن المعرفة والإتقان للمهارة هي الأساس الفعال لبناء مستقبل أجمل وأجيال أرقى.
            </p>
          </div>

          {/* رؤية الفريق */}
          <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 shadow-xl flex flex-col gap-3">
            <h3 className="text-xl font-black text-amber-400 border-b border-blue-950 pb-2">رؤية الفريق</h3>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-bold">
              ان نكون فريق متكامل او منظمة جاهزة وقادرة على ان تكون الجهة الأبرز في البلد والمنطقة العربية في مجالات التعليم والبحث العلمي والتمكين الشبابي.
            </p>
          </div>

          {/* رسالة الفريق */}
          <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 shadow-xl flex flex-col gap-3">
            <h3 className="text-xl font-black text-amber-400 border-b border-blue-950 pb-2">رسالة الفريق</h3>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-bold">
              نسعى إلى تقديم برامج، مبادرات و مشاريع تعليمية و بحثية مبتكرة، وبناء مجتمع شاب يمتلك المعرفة والمهارة اللازمة لصناعة التغيير.
            </p>
          </div>

          {/* أهداف الفريق */}
          <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 shadow-xl flex flex-col gap-3">
            <h3 className="text-xl font-black text-amber-400 border-b border-blue-950 pb-2">أهداف الفريق</h3>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-bold">
              نشر المعرفة التقنية والعلمية، دعم وتطوير اساليب البحث العلمي للشباب، تطوير المهارات عند الطلبة، تعزيز العمل التطوعي ونشر قيمته الحقيقية في تطوير المجتمع، بناء مجتمع تعليمي متعاون ومستدام، توفير فرص تعلم، تدريب وتطوير المهارات الفنية، ربط الشباب العراقي بكافة أنواع الفرص المحلية والعالمية، تغيير صورة التعليم والتعلم في البلاد إلى القيمة الحقيقية والصورة الأمثل لما تحتاجه الأجيال القادمة.
            </p>
          </div>

        </div>

        {/* قيم الفريق */}
        <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-3">
          <h3 className="text-xl font-black text-amber-400 border-b border-blue-950 pb-2">قيم الفريق</h3>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-bold">
            نحرص في مجموعتنا على الالتزام بـ الإبداع، الشفافية، التعاون، الاحترام المتبادل، الالتزام بالمسؤولية، التعلم المستمر، الجودة العالية والابتكار، التوجه نحو تطوير العلم والمعرفة فقط دون النظر إلى اي توجه سياسي، قومي او ديني.
          </p>
        </div>

        {/* ماذا نقدم ومجالات عملنا */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 shadow-xl flex flex-col gap-3">
            <h3 className="text-xl font-black text-amber-400 border-b border-blue-950 pb-2">ماذا نقدم؟</h3>
            <ul className="text-sm sm:text-base text-gray-200 leading-relaxed font-bold flex flex-col gap-2 list-disc list-inside">
              <li>ورش تدريبية، توعوية وتعليمية بمجالات مختلفة.</li>
              <li>دورات تعليمية.</li>
              <li>مسابقات.</li>
              <li>مشاريع بحثية تعاونية.</li>
              <li>مبادرات مجتمعية.</li>
              <li>فعاليات تقنية.</li>
              <li>محتوى تعليمي توعوي عالي الجودة بمختلف المواضيع.</li>
            </ul>
          </div>

          <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 shadow-xl flex flex-col gap-3">
            <h3 className="text-xl font-black text-amber-400 border-b border-blue-950 pb-2">مجالات عملنا</h3>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-bold">
              التعليم، التكنولوجيا والتقنية، الذكاء الاصطناعي واستخداماته، البحث العلمي، تطوير المهارات، التطوع والمساهمة المجتمعية.
            </p>
          </div>
        </div>

        {/* خانة آخر المقالات المنشورة على المجلة */}
        <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-blue-950 pb-3">
            <h3 className="text-xl font-black text-amber-400">آخر المقالات المنشورة 📖</h3>
            <button onClick={openMagazine} className="text-xs sm:text-sm text-indigo-300 font-black hover:text-amber-400 transition-colors">
              عرض كل المجلة ←
            </button>
          </div>

          {articles.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6 font-bold">لا توجد مقالات منشورة حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {articles.slice(-3).reverse().map(art => (
                <div key={art.id} className="bg-slate-950/60 border border-blue-950 rounded-xl p-4 flex flex-col justify-between gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-amber-950 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-900 font-black">{art.category}</span>
                    <span className="text-gray-400 font-bold">{art.date}</span>
                  </div>
                  <h4 className="font-black text-base text-white">{art.title}</h4>
                  <p className="text-xs text-gray-300 line-clamp-2 font-bold">{art.content}</p>
                  <span className="text-xs text-indigo-300 font-black mt-2">الكاتب: {art.author}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* إنجازاتنا */}
        <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-4">
          <h3 className="text-xl font-black text-amber-400 border-b border-blue-950 pb-3">إنجازاتنا 🏆</h3>
          {achievements.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-blue-950">
              <p className="text-base text-amber-400 font-black">قريباً</p>
              <p className="text-xs text-gray-400 mt-1 font-bold">سيتم إدراج إنجازات الفريق وفعالياته قريباً من قِبل الإدارة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map(ach => (
                <div key={ach.id} className="bg-slate-950/60 border border-blue-950 p-4 rounded-xl flex flex-col gap-2">
                  <span className="text-xs text-amber-400 font-black">{ach.date}</span>
                  <h4 className="font-black text-base text-white">{ach.title}</h4>
                  <p className="text-xs text-gray-200 font-bold">{ach.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* شركاؤنا */}
        <div className="bg-[#0e1630] border border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col items-center text-center gap-3">
          <h3 className="text-xl font-black text-amber-400">شركاؤنا 🤝</h3>
          <p className="text-base text-gray-300 font-black py-4">قريباً...</p>
        </div>

        {/* روابط التواصل الاجتماعي والـ Footer */}
        <div className="flex flex-col items-center gap-6 pt-6 border-t border-blue-950">
          <div className="flex items-center gap-6">
            {/* انستغرام */}
            <a 
              href="https://www.instagram.com/p78team?igsh=MXRzdWFjc2lld3J1bQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-pink-950/80 border border-pink-900 flex items-center justify-center text-pink-400 hover:scale-110 transition-transform shadow-lg"
              title="انستغرام"
            >
              📷
            </a>

            {/* تليجرام */}
            <a 
              href="https://t.me/PrometheusTeam1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-sky-950/80 border border-sky-900 flex items-center justify-center text-sky-400 hover:scale-110 transition-transform shadow-lg"
              title="تليجرام"
            >
              ✈️
            </a>

            {/* فيسبوك */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert('رابط الفيسبوك سيتم إضافته قريباً من قِبل الإدارة.'); }}
              className="w-12 h-12 rounded-full bg-blue-950/80 border border-blue-900 flex items-center justify-center text-blue-400 hover:scale-110 transition-transform shadow-lg cursor-pointer"
              title="فيسبوك (قريباً)"
            >
              📘
            </a>
          </div>

          <footer className="text-center text-xs sm:text-sm text-gray-400 font-bold">
            <p>© {currentYear ?? ''} مبادرة بروميثوس. جميع الحقوق محفوظة.</p>
          </footer>
        </div>

      </div>

      {/* نافذة المجلة */}
      {showMagazineModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-[#0e1630] border border-blue-900 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-8 shadow-2xl flex flex-col gap-6 font-bold">
            
            <div className="flex justify-between items-center border-b border-blue-950 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-amber-400">Prometheus Post - المجلة الرسمية 📖</h2>
                <p className="text-xs sm:text-sm text-gray-300 font-bold mt-1">جميع المقالات التي تمت مراجعتها ونشرها من قِبل فريق التحرير.</p>
              </div>
              <button onClick={() => setShowMagazineModal(false)} className="px-4 py-2 bg-rose-950 text-rose-300 rounded-xl text-xs sm:text-sm border border-rose-900 cursor-pointer font-black">
                إغلاق ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {articles.length === 0 ? (
                <p className="text-sm sm:text-base text-gray-300 text-center py-10 font-bold">لم يتم نشر أي مقالة في المجلة حتى الآن. بانتظار إبداعات الكُتّاب!</p>
              ) : (
                articles.map(art => (
                  <div key={art.id} className="bg-slate-950/60 border border-blue-950 rounded-xl p-5 sm:p-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm bg-amber-950 text-amber-400 px-3 py-1 rounded-full border border-amber-900 font-black">{art.category}</span>
                      <span className="text-xs sm:text-sm text-gray-300 font-bold">{art.date}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">{art.title}</h3>
                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-wrap font-bold">{art.content}</p>
                    
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
                      className="text-xs sm:text-sm text-indigo-300 self-end font-black cursor-pointer hover:text-amber-400 transition-colors flex items-center gap-1.5 bg-indigo-950/60 px-3 py-2 rounded-lg border border-indigo-900/60"
                    >
                      <span>الكاتب: {art.author} ✍️</span>
                      <span className="underline text-xs">عرض البروفايل 👤</span>
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
          <div className="bg-[#0e1630] border border-blue-900 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-8 shadow-2xl flex flex-col gap-6 font-bold">
            
            <div className="flex justify-between items-center border-b border-blue-950 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-amber-400">كروت الأعضاء ومتطوعين 🌟</h2>
                <p className="text-xs sm:text-sm text-gray-300 font-bold mt-1">استعراض كافة الأعضاء المسجلين في المنصة.</p>
              </div>
              <button onClick={() => setShowMembersModal(false)} className="px-4 py-2 bg-rose-950 text-rose-300 rounded-xl text-xs sm:text-sm border border-rose-900 cursor-pointer font-black">
                إغلاق ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {members.length === 0 ? (
                <p className="text-sm sm:text-base text-gray-300 col-span-full text-center py-8 font-bold">لم يتم إضافة أي عضو حتى الآن.</p>
              ) : (
                members.map(member => (
                  <div 
                    key={member.id} 
                    onClick={() => setSelectedWriter(member)}
                    className="bg-slate-950/60 border border-blue-950 rounded-xl p-5 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-amber-500/60 transition-all"
                  >
                    <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-amber-500" />
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-white">{member.name}</h3>
                      <span className="text-xs sm:text-sm text-indigo-300 font-bold">{member.role}</span>
                    </div>
                    {member.bio && (
                      <p className="text-xs sm:text-sm text-gray-200 line-clamp-3 leading-relaxed font-bold">{member.bio}</p>
                    )}
                    <span className="text-xs sm:text-sm bg-amber-950/80 text-amber-400 px-3 py-1 rounded-full border border-amber-900 mt-auto font-black">
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
          <div className="bg-[#0e1630] border border-amber-500/50 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-8 shadow-2xl flex flex-col gap-6 relative font-bold">
            
            <button 
              onClick={() => setSelectedWriter(null)}
              className="absolute top-4 left-4 px-4 py-2 bg-rose-950 text-rose-300 rounded-xl text-xs sm:text-sm border border-rose-900 cursor-pointer font-black"
            >
              إغلاق ✕
            </button>

            <div className="flex flex-col items-center text-center gap-3 pt-2">
              <img src={selectedWriter.image} alt={selectedWriter.name} className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 shadow-xl" />
              <div>
                <h3 className="font-black text-xl sm:text-2xl text-white">{selectedWriter.name}</h3>
                <span className="text-sm sm:text-base text-indigo-300 mt-1 block font-black">{selectedWriter.role}</span>
              </div>
              {selectedWriter.bio && (
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-blue-950 w-full text-right font-bold">
                  {selectedWriter.bio}
                </p>
              )}
              <span className="text-xs sm:text-sm bg-amber-950/80 text-amber-400 px-4 py-2 rounded-full border border-amber-900 font-black">
                ⏱️ {selectedWriter.volunteerHours} ساعة تطوع داخل الفريق
              </span>
            </div>

            <div className="border-t border-blue-950 pt-4 flex flex-col gap-3">
              <h4 className="text-base sm:text-lg font-black text-amber-400">مقالات الكاتب المنشورة في المجلة 📝:</h4>
              
              {articles.filter(a => a.author.trim() === selectedWriter.name.trim()).length === 0 ? (
                <p className="text-xs sm:text-sm text-gray-300 text-center py-4 bg-slate-950/40 rounded-xl font-bold">لم ينشر هذا الكاتب أي مقال حتى الآن.</p>
              ) : (
                articles
                  .filter(a => a.author.trim() === selectedWriter.name.trim())
                  .map(art => (
                    <div key={art.id} className="bg-slate-950/80 border border-blue-950 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="bg-amber-950 text-amber-400 px-2.5 py-0.5 rounded border border-amber-900 font-black">{art.category}</span>
                        <span className="text-gray-300 font-bold">{art.date}</span>
                      </div>
                      <h5 className="font-black text-base sm:text-lg text-white">{art.title}</h5>
                      <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 font-bold">{art.content}</p>
                    </div>
                  ))
              )}
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
