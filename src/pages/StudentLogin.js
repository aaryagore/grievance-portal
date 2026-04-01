import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { STUDENT_DATABASE } from '../constants';
import { storage } from '../lib/storage';
export const StudentLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [zprn, setZprn] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [showPass, setShowPass] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const message = location.state?.message;
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));
        const student = STUDENT_DATABASE[zprn.toLowerCase()];
        if (!student) {
            setError('ZPRN not found in the system. Please check your credentials.');
            setIsLoading(false);
            return;
        }
        if (student.password !== password) {
            setError('Incorrect password. Please try again.');
            setIsLoading(false);
            return;
        }
        storage.loginStudent({ zprn: student.zprn, name: student.name, email: student.email });
        const from = location.state?.from || '/submit';
        navigate(from);
    };
    return (_jsxs("div", { className: "min-h-screen zeal-light-gradient flex items-center justify-center p-4 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-32 -right-32 w-96 h-96 bg-zeal-gold/10 rounded-full blur-[80px] animate-pulse-soft" }), _jsx("div", { className: "absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/5 rounded-full blur-[80px] animate-float" }), _jsxs("div", { className: "w-full max-w-md relative z-10", children: [_jsxs("div", { className: "text-center mb-10", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-200 mb-6", children: _jsx(GraduationCap, { className: "w-10 h-10 text-white" }) }), _jsx("h1", { className: "text-4xl font-black text-slate-900 tracking-tight", children: "Student Portal" }), _jsx("p", { className: "text-slate-500 mt-2 font-medium", children: "Login with your ZCOER credentials" })] }), _jsxs("div", { className: "bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-10", children: [message && (_jsxs("div", { className: "mb-6 flex items-center space-x-3 bg-amber-50 border border-amber-200 px-5 py-4 rounded-2xl", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-amber-600 shrink-0" }), _jsx("p", { className: "text-sm text-amber-800 font-medium", children: message })] })), _jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider", children: "ZPRN Number" }), _jsx("input", { id: "zprn-input", required: true, type: "text", placeholder: "e.g. zcoer2310", value: zprn, onChange: (e) => setZprn(e.target.value), className: "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password-input", required: true, type: showPass ? 'text' : 'password', placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pr-14 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" }), _jsx("button", { type: "button", onClick: () => setShowPass(!showPass), className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors", children: showPass ? _jsx(EyeOff, { className: "w-5 h-5" }) : _jsx(Eye, { className: "w-5 h-5" }) })] })] }), error && (_jsxs("div", { className: "flex items-center space-x-3 bg-rose-50 border border-rose-200 px-5 py-4 rounded-2xl", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-rose-500 shrink-0" }), _jsx("p", { className: "text-sm text-rose-700 font-medium", children: error })] })), _jsx("button", { type: "submit", id: "login-submit-btn", disabled: isLoading, className: "w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-70 flex items-center justify-center space-x-3", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }), _jsx("span", { children: "Verifying..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "Login to Portal" }), _jsx(ArrowRight, { className: "w-5 h-5" })] })) })] })] })] })] }));
};
