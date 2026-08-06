'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#070b19] text-white p-6 md:p-10 font-sans flex flex-col justify-between">
      {/* شريط التنقل العلوي */}
      <nav className="max-w-6xl mx-auto w-full flex justify-between items-center border-b border-blue-950 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">PROMETHEUS</span>
          <span className="text-amber-500">🔥</span>
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="text-amber-400 font-bold">الرئيسية</Link>
          <Link href="/team" className="text-gray-300 hover:text-white">الأعضاء</Link>
          <Link href="/editor" className="text-gray-300 hover:text-white">المجلة</Link>
          <Link href="/admin" className="text-rose-400 hover:text-white">لوحة الأدمن ⚙️</Link>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        
        {/* كارت تعريف بالفريق */}
        <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-3 text-amber-400">من نحن؟ 🌟</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              الدراسة والواقع ومتطلباته، ضعف مهارات البحث العلمي، قلة الاهتمام والتوعية بالمهارات التقنية والمهارات الناعمة، التلقين والحفظ المنصوص بدل الفهم والتفكير النقدي فضلاً عن نقص المبادرات والفرص المقدمة للطلبة لإبراز المهارات.
              <br/><br/>
              وبناءً على هذا الوضع، قررنا في بروميثوس أن نتخذ دور المصلح ونساهم في التغيير بدل اللوم وارتداء دور الضحية وإيجاد الحلول وخلقها إن لم توجد، حلول قابلة للتطبيق ومدروسة لتصنع أثراً مستمراً عبر الأجيال وللمدى الطويل.
            </p>
          </div>
        </div>

        {/* الكارت المطلوب: الملفات الشخصية للأعضاء (مرتبط بصفحة الأعضاء) */}
        <Link href="/team" className="bg-[#0e1630] border border-blue-900/40 hover:border-amber-500/60 transition-all rounded-2xl p-6 shadow-xl flex flex-col justify-between cursor-pointer group">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">الملفات الشخصية للأعضاء 👥</h2>
              <span className="text-xs bg-amber-950 text-amber-400 border border-amber-900 px-2.5 py-1 rounded-full">
                نشط الآن 🚀
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              تعرف على كل عضو: دوره، ساعات تطوعه، وإنجازاته بالفريق. شاهد الكارتات الشخصية المصممة لكل عضو بدقة.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-amber-400 font-bold border-t border-blue-950 pt-4">
            <span>استعراض قائمة الأعضاء والكارتات الشخصية</span>
            <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
          </div>
        </Link>

      </div>

      {/* التذييل */}
      <footer className="text-center py-6 text-xs text-gray-500 border-t border-blue-950/40">
        جميع الحقوق محفوظة © 2026 بروميثوس
      </footer>
    </main>
  );
}