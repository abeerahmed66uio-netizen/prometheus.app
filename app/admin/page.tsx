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

interface UserRequest {
  id: number;
  name: string;
  role: 'كاتب' | 'محرر';
  email?: string;
  bio?: string;
  image?: string;
  date: string;
}

interface ApprovedLogin {
  id: number;
  name: string;
  role: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface Partner {
  id: number;
  name: string;
  logo: string;
  link?: string;
}

export default function AdminDashboard() {
  // حالات المصادقة وكلمة المرور
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // حالات إدارة البيانات
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<UserRequest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [teamLogo, setTeamLogo] = useState<string>('');

  // نموذج إضافة عضو جديد
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState('');
  const [volunteerHours, setVolunteerHours] = useState('');
  const [bio, setBio] = useState('');

  // نموذج إضافة إنجاز جديد
  const [achTitle, setAchTitle] = useState('');
  const [achDesc, setAchDesc] = useState('');
  const [achDate, setAchDate] = useState('');

  // نموذج إضافة شريك جديد
  const [partnerName, setPartnerName] = useState('');
  const [partnerLogo, setPartnerLogo] = useState('');
  const [partnerLink, setPartnerLink] = useState('');

  // استرجاع البيانات عند فتح الصفحة
  useEffect(() => {
    const savedPassword = localStorage.getItem('prometheus_admin_password');
    if (savedPassword) setAdminPassword(savedPassword);

    const savedMembers = localStorage.getItem('prometheus_team_members');
    if (savedMembers) {
      try { setMembers(JSON.parse(savedMembers)); } catch (e) {}
    }

    const savedRequests = localStorage.getItem('prometheus_pending_requests');
    if (savedRequests) {
      try { setPendingRequests(JSON.parse(savedRequests)); } catch (e) {}
    }

    const savedAchievements = localStorage.getItem('prometheus_achievements');
    if (savedAchievements) {
      try { setAchievements(JSON.parse(savedAchievements)); } catch (e) {}
    }

    const savedPartners = localStorage.getItem('prometheus_partners');
    if (savedPartners) {
      try { setPartners(JSON.parse(savedPartners)); } catch (e) {}
    }

    const savedLogo = localStorage.getItem('prometheus_team_logo');
    if (savedLogo) setTeamLogo(savedLogo);
  }, []);

  // تعيين كلمة المرور لأول مرة
  const handleSetInitialPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    localStorage.setItem('prometheus_admin_password', newPasswordInput);
    setAdminPassword(newPasswordInput);
    setIsAuthenticated(true);
    setNewPasswordInput('');
  };

  // تسجيل الدخول
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  // تغيير كلمة المرور
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    localStorage.setItem('prometheus_admin_password', newPasswordInput);
    setAdminPassword(newPasswordInput);
    setNewPasswordInput('');
    setIsChangingPassword(false);
    alert('تم تغيير كلمة المرور بنجاح! 🔑');
  };

  // رفع الصور لتحويل Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // حفظ شعار الفريق
  const handleSaveTeamLogo = (base64Logo: string) => {
    setTeamLogo(base64Logo);
    localStorage.setItem('prometheus_team_logo', base64Logo);
    alert('تم تحديث شعار الفريق بنجاح! 🔥');
  };

  // موافقة على طلبات التسجيل (تفعيل حساب فقط)
  const handleApproveRequest = (request: UserRequest) => {
    const approvedLogins: ApprovedLogin[] = JSON.parse(
      localStorage.getItem('prometheus_approved_logins') || '[]'
    );

    const newApprovedLogin: ApprovedLogin = {
      id: Date.now(),
      name: request.name.trim(),
      role: request.role,
    };

    localStorage.setItem(
      'prometheus_approved_logins',
      JSON.stringify([...approvedLogins, newApprovedLogin])
    );

    const updatedRequests = pendingRequests.filter((r) => r.id !== request.id);
    setPendingRequests(updatedRequests);
    localStorage.setItem('prometheus_pending_requests', JSON.stringify(updatedRequests));

    alert(`تمت الموافقة وتفعيل حساب (${request.name}) بنجاح! 🎉`);
  };

  // رفض طلب الانضمام
  const handleRejectRequest = (id: number) => {
    const updated = pendingRequests.filter((r) => r.id !== id);
    setPendingRequests(updated);
    localStorage.setItem('prometheus_pending_requests', JSON.stringify(updated));
  };

  // إضافة كارت عضو يدويًا
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const newMember: TeamMember = {
      id: Date.now(),
      name,
      role,
      image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
      volunteerHours: Number(volunteerHours) || 0,
      bio,
    };

    const updated = [newMember, ...members];
    setMembers(updated);
    localStorage.setItem('prometheus_team_members', JSON.stringify(updated));

    setName(''); setRole(''); setImage(''); setVolunteerHours(''); setBio('');
    alert('تم إضافة كارت العضو بنجاح! 🚀');
  };

  const handleDeleteMember = (id: number) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    localStorage.setItem('prometheus_team_members', JSON.stringify(updated));
  };

  // إضافة إنجاز جديد
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle || !achDesc) return;

    const newAch: Achievement = {
      id: Date.now(),
      title: achTitle,
      description: achDesc,
      date: achDate || new Date().toLocaleDateString('ar-EG'),
    };

    const updated = [newAch, ...achievements];
    setAchievements(updated);
    localStorage.setItem('prometheus_achievements', JSON.stringify(updated));

    setAchTitle(''); setAchDesc(''); setAchDate('');
    alert('تم إضافة الإنجاز بنجاح! 🏆');
  };

  const handleDeleteAchievement = (id: number) => {
    const updated = achievements.filter((a) => a.id !== id);
    setAchievements(updated);
    localStorage.setItem('prometheus_achievements', JSON.stringify(updated));
  };

  // إضافة شريك جديد
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !partnerLogo) return;

    const newPartner: Partner = {
      id: Date.now(),
      name: partnerName,
      logo: partnerLogo,
      link: partnerLink,
    };

    const updated = [newPartner, ...partners];
    setPartners(updated);
    localStorage.setItem('prometheus_partners', JSON.stringify(updated));

    setPartnerName(''); setPartnerLogo(''); setPartnerLink('');
    alert('تم إضافة الشريك بنجاح! 🤝');
  };

  const handleDeletePartner = (id: number) => {
    const updated = partners.filter((p) => p.id !== id);
    setPartners(updated);
    localStorage.setItem('prometheus_partners', JSON.stringify(updated));
  };

  // 🔒 الحالة 1: إعداد كلمة المرور لأول مرة
  if (!adminPassword) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <span className="text-3xl">⚙️</span>
            <h1 className="text-xl font-bold text-white mt-2">إعداد لوحة التحكم (المالك)</h1>
            <p className="text-xs text-gray-400 mt-1">يرجى تعيين كلمة مرور سرية خاصة بك للأدمن:</p>
          </div>

          <form onSubmit={handleSetInitialPassword} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={newPasswordInput} 
              onChange={(e) => setNewPasswordInput(e.target.value)} 
              placeholder="أدخل كلمة المرور الجديدة..." 
              className="w-full bg-slate-900 border border-blue-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 text-center"
              autoFocus
              required
            />
            <button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
            >
              حفظ وتعيين كلمة المرور 🔒
            </button>
          </form>

          <div className="text-center border-t border-blue-950 pt-4">
            <Link href="/" className="text-xs text-gray-400 hover:text-white">← العودة للرئيسية</Link>
          </div>
        </div>
      </main>
    );
  }

  // 🔒 الحالة 2: تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <span className="text-3xl">🔒</span>
            <h1 className="text-xl font-bold text-white mt-2">بوابة دخول الأدمن</h1>
            <p className="text-xs text-gray-400 mt-1">أدخل كلمة المرور الخاصة بك للوصول إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="كلمة المرور..." 
                className="w-full bg-slate-900 border border-blue-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 text-center"
                autoFocus
                required
              />
              {passwordError && (
                <p className="text-rose-400 text-xs text-center mt-2">كلمة المرور غير صحيحة، حاول مجدداً!</p>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
            >
              دخول 🔓
            </button>
          </form>

          <div className="text-center border-t border-blue-950 pt-4">
            <Link href="/" className="text-xs text-gray-400 hover:text-white">← العودة للرئيسية</Link>
          </div>
        </div>
      </main>
    );
  }

  // 🚀 الحالة 3: لوحة التحكم المكتملة
  return (
    <main dir="rtl" className="min-h-screen bg-[#070b19] text-white p-6 md:p-10 font-sans">
      
      {/* شريط التنقل العلوي */}
      <nav className="max-w-6xl mx-auto w-full flex justify-between items-center border-b border-blue-950 pb-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">PROMETHEUS ADMIN</span>
          <span className="text-amber-500">⚙️</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button 
            onClick={() => setIsChangingPassword(!isChangingPassword)} 
            className="text-amber-400 hover:text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-900/50 cursor-pointer"
          >
            {isChangingPassword ? 'إلغاء' : 'تغيير الباسورد 🔑'}
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="text-rose-400 hover:text-rose-300 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900/50 cursor-pointer"
          >
            تسجيل خروج 🔒
          </button>
          <Link href="/" className="text-gray-300 hover:text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-blue-900">
            الرئيسية 🏠
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* نافذة تغيير كلمة المرور */}
        {isChangingPassword && (
          <div className="bg-[#0e1630] border border-amber-500/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-amber-400 mb-3">تغيير كلمة مرور الأدمن</h3>
            <form onSubmit={handleChangePassword} className="flex gap-3">
              <input 
                type="password" 
                value={newPasswordInput} 
                onChange={(e) => setNewPasswordInput(e.target.value)} 
                placeholder="أدخل كلمة المرور الجديدة..." 
                className="flex-1 bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
              <button 
                type="submit" 
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                حفظ التغيير
              </button>
            </form>
          </div>
        )}

        {/* 🖼️ قسم رفع وتغيير شعار الفريق الرئيسي */}
        <div className="bg-[#0e1630] border border-amber-500/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <span>شعار الفريق الرئيسي</span> 🖼️
            </h2>
            <p className="text-xs text-gray-400">تغيير الصورة/الشعار الظاهر في واجهة الصفحة الرئيسية للفريق.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-950 border border-amber-500/60 flex items-center justify-center overflow-hidden">
              {teamLogo ? (
                <img src={teamLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">🔥</span>
              )}
            </div>

            <label className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-md">
              اختر شعار جديد 📁
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleImageUpload(e, handleSaveTeamLogo)} 
              />
            </label>
          </div>
        </div>

        {/* 📩 قسم الطلبات المعلقة */}
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <span>طلبات التسجيل المعلقة</span>
              <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40">
                {pendingRequests.length}
              </span>
            </h2>
            <span className="text-xs text-gray-400">تفعيل حسابات الكُتاب والمحررين</span>
          </div>

          <div className="flex flex-col gap-3">
            {pendingRequests.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6 bg-slate-950/40 rounded-xl border border-blue-950">
                لا توجد طلبات تسجيل معلقة حالياً.
              </p>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="bg-slate-950/80 border border-blue-900/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={req.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'} 
                      alt={req.name} 
                      className="w-12 h-12 rounded-full object-cover border border-amber-500" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white">{req.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                          req.role === 'كاتب' ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                        }`}>
                          طلب دور: {req.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{req.bio || 'لا توجد نبذة مرفقة'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => handleApproveRequest(req)}
                      className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-800 transition-all cursor-pointer"
                    >
                      تفعيل الحساب ✔️
                    </button>
                    <button 
                      onClick={() => handleRejectRequest(req.id)}
                      className="bg-rose-950 hover:bg-rose-900 text-rose-300 px-3 py-1.5 rounded-lg text-xs border border-rose-900 transition-all cursor-pointer"
                    >
                      رفض ✖
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🏆 قسم إضافة وتعديل الإنجازات */}
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <h2 className="text-lg font-bold text-amber-400">إدارة الإنجازات 🏆</h2>
          
          <form onSubmit={handleAddAchievement} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-blue-950">
            <input 
              type="text" 
              placeholder="عنوان الإنجاز (مثال: إطلاق ورشة الذكاء الاصطناعي)" 
              value={achTitle}
              onChange={(e) => setAchTitle(e.target.value)}
              className="bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
            <input 
              type="text" 
              placeholder="التاريخ (مثال: أغسطس 2026)" 
              value={achDate}
              onChange={(e) => setAchDate(e.target.value)}
              className="bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <textarea 
              placeholder="تفاصيل الإنجاز..." 
              value={achDesc}
              onChange={(e) => setAchDesc(e.target.value)}
              className="bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 sm:col-span-2 h-20 resize-none"
              required
            />
            <button 
              type="submit" 
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs sm:col-span-2 cursor-pointer shadow-md"
            >
              إضافة الإنجاز ➕
            </button>
          </form>

          {/* قائمة الإنجازات الحالية */}
          <div className="flex flex-col gap-2 mt-2">
            {achievements.map((ach) => (
              <div key={ach.id} className="bg-slate-950/80 border border-blue-950 p-3 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-white">{ach.title} <span className="text-amber-400 text-[10px]">({ach.date})</span></h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">{ach.description}</p>
                </div>
                <button onClick={() => handleDeleteAchievement(ach.id)} className="text-rose-400 hover:text-rose-300 bg-rose-950/60 p-1.5 rounded-lg border border-rose-900 cursor-pointer">
                  حذف 🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 🤝 قسم إضافة وإدارة الشركاء */}
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <h2 className="text-lg font-bold text-amber-400">إدارة الشركاء 🤝</h2>
          
          <form onSubmit={handleAddPartner} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-blue-950">
            <input 
              type="text" 
              placeholder="اسم الشريك أو الجهة الراعية" 
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
            <input 
              type="url" 
              placeholder="رابط الموقع الإلكتروني (اختياري)" 
              value={partnerLink}
              onChange={(e) => setPartnerLink(e.target.value)}
              className="bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <div className="sm:col-span-2 flex items-center gap-3">
              <label className="bg-slate-900 border border-blue-900 text-gray-300 text-xs p-2.5 rounded-xl cursor-pointer w-full text-center hover:border-amber-500">
                {partnerLogo ? 'تم اختيار الشعار ✔️' : 'اختر شعار الشريك 📁'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e, (base64) => setPartnerLogo(base64))} 
                />
              </label>
            </div>
            <button 
              type="submit" 
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs sm:col-span-2 cursor-pointer shadow-md"
            >
              إضافة شريك جديد ➕
            </button>
          </form>

          {/* قائمة الشركاء */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {partners.map((p) => (
              <div key={p.id} className="bg-slate-950/80 border border-blue-950 p-3 rounded-xl flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.logo} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-blue-900" />
                  <span className="font-bold text-white">{p.name}</span>
                </div>
                <button onClick={() => handleDeletePartner(p.id)} className="text-rose-400 hover:text-rose-300 bg-rose-950/60 p-1.5 rounded-lg border border-rose-900 cursor-pointer">
                  حذف 🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 👤 قسم إضافة كروت الأعضاء يدويًا */}
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">إضافة كارت عضو جديد يدويًا ➕</h2>
          
          <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1">اسم العضو:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="مثال: أحمد علي" 
                className="w-full bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">الدور / المنصب بالفريق:</label>
              <input 
                type="text" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                placeholder="مثال: مطور واجهات / كاتب" 
                className="w-full bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">اختر الصورة الشخصية:</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, (base64) => setImage(base64))} 
                className="w-full bg-slate-900 border border-blue-900 rounded-xl p-2 text-xs text-gray-300 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">ساعات التطوع:</label>
              <input 
                type="number" 
                value={volunteerHours} 
                onChange={(e) => setVolunteerHours(e.target.value)} 
                placeholder="مثال: 45" 
                className="w-full bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-300 block mb-1">نبذة مختصرة:</label>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="اكتب نبذة قصيرة..." 
                className="w-full bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 h-20 resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
              >
                حفظ ونشر الكارت 🚀
              </button>
            </div>
          </form>
        </div>

        {/* 📋 قائمة الكروت المضافة حالياً */}
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">الكروت المضافة حالياً ({members.length}) 📋</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.length === 0 ? (
              <p className="text-xs text-gray-400 col-span-full text-center py-6">لم تقم بإضافة أي كارت عضو حتى الآن.</p>
            ) : (
              members.map((member) => (
                <div key={member.id} className="bg-slate-950/80 border border-blue-950 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-amber-500" />
                    <div>
                      <h3 className="font-bold text-xs text-white">{member.name}</h3>
                      <span className="text-[10px] text-indigo-300">{member.role}</span>
                      <p className="text-[10px] text-amber-400 mt-1">{member.volunteerHours} ساعة تطوع</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMember(member.id)}
                    className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 px-2.5 py-1.5 rounded-lg text-xs border border-rose-900 cursor-pointer"
                  >
                    حذف 🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
