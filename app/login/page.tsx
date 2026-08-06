'use client';

import { useState } from 'react';
import Link from 'next/link';

type Role = 'writer' | 'editor' | 'admin';

export default function LoginPage() {
    const [writerPass, setWriterPass] = useState('');
    const [editorPass, setEditorPass] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [unlockedRole, setUnlockedRole] = useState<Role | null>(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const CORRECT_PASSWORDS: Record<Role, string> = {
        writer: 'writer123',
        editor: 'editor456',
        admin: 'admin789',
    };

    const handleLogin = (role: Role) => {
        let enteredPass = '';
        if (role === 'writer') enteredPass = writerPass;
        if (role === 'editor') enteredPass = editorPass;
        if (role === 'admin') enteredPass = adminPass;

        if (enteredPass === CORRECT_PASSWORDS[role]) {
            const roleName = role === 'writer' ? 'كاتب' : role === 'editor' ? 'محرر' : 'آدمن';
            setUnlockedRole(role);
            setMessage({
                text: `تم التحقق بنجاح من حساب الـ ${roleName}! اضغط الزر أدناه للدخول. 🔥`,
                type: 'success'
            });
        } else {
            setMessage({
                text: 'كلمة المرور غير صحيحة، حاول مجدداً.',
                type: 'error'
            });
        }
    };

    return (
        <main dir="rtl" className="min-h-screen bg-[#070b19] text-white flex flex-col justify-between font-sans">
            <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-blue-950/40 bg-[#070b19]/80">
                <Link href="/" className="text-xl font-bold">
                    PROMETHEUS <span className="text-amber-500">🔥</span>
                </Link>
                <Link href="/" className="text-sm text-gray-400 hover:text-amber-400">
                    العودة للرئيسية ←
                </Link>
            </nav>

            <section className="max-w-xl mx-auto px-4 py-12 w-full">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold mb-3">بوابة تسجيل دخول الأعضاء</h1>
                    <p className="text-gray-400 text-sm">اختر صلاحيتك وأدخل كلمة المرور الخاصة بك</p>
                </div>

                {message.text && (
                    <div className={`mb-8 p-4 rounded-xl text-center border ${message.type === 'success'
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                            : 'bg-rose-950/40 border-rose-800 text-rose-400'
                        }`}>
                        <p className="font-bold text-sm mb-3">{message.text}</p>
                        
                        {message.type === 'success' && unlockedRole && (
                            <Link
                                href={`/${unlockedRole}`}
                                className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg"
                            >
                                الانتقال إلى لوحة التحكم الآن 🚀
                            </Link>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    {/* كارت الكاتب */}
                    <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">الكاتب</h2>
                            <p className="text-gray-400 text-xs mb-4">خاص بكتابة المقالات.</p>
                            <input
                                type="password"
                                placeholder="كلمة مرور الكاتب"
                                value={writerPass}
                                onChange={(e) => setWriterPass(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <button
                            onClick={() => handleLogin('writer')}
                            className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm cursor-pointer transition-colors"
                        >
                            التحقق ودخول الكاتب
                        </button>
                    </div>

                    {/* كارت المحرر */}
                    <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">المحرر</h2>
                            <p className="text-gray-400 text-xs mb-4">خاص بمراجعة وتنسيق المقالات.</p>
                            <input
                                type="password"
                                placeholder="كلمة مرور المحرر"
                                value={editorPass}
                                onChange={(e) => setEditorPass(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <button
                            onClick={() => handleLogin('editor')}
                            className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer transition-colors"
                        >
                            التحقق ودخول المحرر
                        </button>
                    </div>

                    {/* كارت الآدمن */}
                    <div className="bg-[#0e1630] border border-blue-900/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">الآدمن</h2>
                            <p className="text-gray-400 text-xs mb-4">صلاحيات كاملة لإدارة النظام.</p>
                            <input
                                type="password"
                                placeholder="كلمة مرور الآدمن"
                                value={adminPass}
                                onChange={(e) => setAdminPass(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-blue-950 text-sm text-white focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <button
                            onClick={() => handleLogin('admin')}
                            className="mt-6 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm cursor-pointer transition-colors"
                        >
                            التحقق ودخول الآدمن
                        </button>
                    </div>
                </div>
            </section>

            <footer className="text-center py-6 text-xs text-gray-500 border-t border-blue-950/40">
                جميع الحقوق محفوظة © 2026 Prometheus
            </footer>
        </main>
    );
}