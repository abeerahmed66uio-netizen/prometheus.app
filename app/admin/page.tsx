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

export default function AdminDashboard() {
  // حالات المصادقة وكلمة المرور
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // حالات إدارة الأعضاء
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState('');
  const [volunteerHours, setVolunteerHours] = useState('');
  const [bio, setBio] = useState('');

  // استرجاع البيانات المسبقة عند فتح الصفحة
  useEffect(() => {
    const savedPassword = localStorage.getItem('prometheus_admin_password');
    if (savedPassword) {
      setAdminPassword(savedPassword);
    }

    const savedMembers = localStorage.getItem('prometheus_team_members');
    if (savedMembers) {
      try {
        setMembers(JSON.parse(savedMembers));
      } catch (e) {}
    }
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

  // تغيير كلمة المرور من داخل اللوحة
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    localStorage.setItem('prometheus_admin_password', newPasswordInput);
    setAdminPassword(newPasswordInput);
    setNewPasswordInput('');
    setIsChangingPassword(false);
    alert('تم تغيير كلمة المرور بنجاح! 🔑');
  };

  // رفع الصورة وتحويلها إلى Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // حفظ الأعضاء في LocalStorage
  const saveToLocalStorage = (updatedMembers: TeamMember[]) => {
    setMembers(updatedMembers);
    localStorage.setItem('prometheus_team_members', JSON.stringify(updatedMembers));
  };

  // إضافة عضو جديد
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
    saveToLocalStorage(updated);

    setName('');
    setRole('');
    setImage('');
    setVolunteerHours('');
    setBio('');
    alert('تم إضافة الكارت بنجاح وسيحفظ للمشاهدين! 🚀');
  };

  // حذف عضو
  const handleDeleteMember = (id: number) => {
    const updated = members.filter(m => m.id !== id);
    saveToLocalStorage(updated);
  };

  // الحالة 1: إذا لم يتم تعيين كلمة مرور من قبل
  if (!adminPassword) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <span className="text-3xl">⚙️</span>
            <h1 className="text-xl font-bold text-white mt-2">إعداد لوحة التحكم (المالك)</h1>
            <p className="text-xs text-gray-400 mt-1">هذه أول مرة تفتح فيها الموقع. يرجى تعيين كلمة مرور سرية خاصة بك للأدمن:</p>
          </div>

          <form onSubmit={handleSetInitialPassword} className="flex flex-col gap-4">
            <div>
              <input 
                type="password" 
                value={newPasswordInput} 
                onChange={(e) => setNewPasswordInput(e.target.value)} 
                placeholder="أدخل كلمة المرور الجديدة..." 
                className="w-full bg-slate-900 border border-blue-900 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 text-center"
                autoFocus
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
            >
              حفظ وتعيين كلمة المرور 🔒
            </button>
          </form>

          <div className="text-center border-t border-blue-950 pt-4">
            <Link href="/" className="text-xs text-gray-400 hover:text-white">
              ← العودة للرئيسية
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // الحالة 2: إذا تم تعيين كلمة مرور ولكن لم يتم تسجيل الدخول بعد
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
            <Link href="/" className="text-xs text-gray-400 hover:text-white">
              ← العودة للرئيسية
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // الحالة 3: لوحة التحكم الكاملة بعد تسجيل الدخول بنجاح
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

        {/* نموذج إضافة عضو جديد */}
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-amber-400 mb-4">إضافة كارت عضو جديد للمنصة ➕</h2>
          
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
              <label className="text-xs text-gray-300 block mb-1">اختر الصورة الشخصية من الاستديو:</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="w-full bg-slate-900 border border-blue-900 rounded-xl p-2 text-xs text-gray-300 file:ml-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
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
              <label className="text-xs text-gray-300 block mb-1">نبذة مختصرة أو إنجازاته:</label>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="اكتب نبذة قصيرة عن العضو..." 
                className="w-full bg-slate-900 border border-blue-900 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 h-20 resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
              >
                حفظ ونشر الكارت للمشاهدين 🚀
              </button>
            </div>
          </form>
        </div>

        {/* قائمة الأعضاء الحاليين للتحكم والحذف */}
        <div className="bg-[#0e1630] border border-blue-900/60 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">الكروت المضافة حالياً ({members.length}) 📋</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.length === 0 ? (
              <p className="text-xs text-gray-400 col-span-full text-center py-6">لم تقم بإضافة أي عضو حتى الآن.</p>
            ) : (
              members.map(member => (
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