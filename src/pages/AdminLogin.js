import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { STAFF_ACCOUNTS } from '../constants';
import { storage } from '../lib/storage';
export const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [showPass, setShowPass] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));
        const staff = STAFF_ACCOUNTS[username.toLowerCase()];
        if (!staff) {
            setError('Username not found in the staff registry.');
            setIsLoading(false);
            return;
        }
        if (staff.password !== password) {
            setError('Incorrect password. Please try again.');
            setIsLoading(false);
            return;
        }
        storage.loginAdmin({ id: staff.id, username: staff.username, name: staff.name, assignedCategory: staff.assignedCategory, role: staff.role });
        navigate('/admin/dashboard');
    };
    return (_jsxs("div", { className: "min-h-screen bg-indigo-950 flex items-center justify-center p-4 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-32 -right-32 w-96 h-96 bg-zeal-gold/10 rounded-full blur-[100px] animate-pulse-soft" }), _jsx("div", { className: "absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-float" }), _jsx("div", { className: "absolute inset-0 blueprint-pattern-light opacity-5" }), _jsxs("div", { className: "w-full max-w-md relative z-10", children: [_jsxs("div", { className: "text-center mb-10", children: [_jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/10 rounded-3xl shadow-2xl mb-6", children: _jsx(Shield, { className: "w-10 h-10 text-zeal-gold" }) }), _jsx("h1", { className: "text-4xl font-black text-white tracking-tight", children: "Staff Portal" }), _jsx("p", { className: "text-indigo-300 mt-2 font-medium", children: "Authorized personnel only" })] }), _jsx("div", { className: "bg-white/5 border border-white/10 backdrop-blur-sm rounded-[2.5rem] p-10", children: _jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-black text-indigo-200 mb-3 uppercase tracking-wider", children: "Username" }), _jsx("input", { id: "admin-username-input", required: true, type: "text", placeholder: "e.g. super_dean", value: username, onChange: (e) => setUsername(e.target.value), className: "w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-indigo-400 font-medium focus:ring-4 focus:ring-white/10 focus:border-white/30 outline-none transition-all" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-black text-indigo-200 mb-3 uppercase tracking-wider", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "admin-password-input", required: true, type: showPass ? 'text' : 'password', placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white placeholder-indigo-400 font-medium focus:ring-4 focus:ring-white/10 focus:border-white/30 outline-none transition-all" }), _jsx("button", { type: "button", onClick: () => setShowPass(!showPass), className: "absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white transition-colors", children: showPass ? _jsx(EyeOff, { className: "w-5 h-5" }) : _jsx(Eye, { className: "w-5 h-5" }) })] })] }), error && (_jsxs("div", { className: "flex items-center space-x-3 bg-rose-500/10 border border-rose-500/30 px-5 py-4 rounded-2xl", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-rose-400 shrink-0" }), _jsx("p", { className: "text-sm text-rose-300 font-medium", children: error })] })), _jsx("button", { id: "admin-login-btn", type: "submit", disabled: isLoading, className: "w-full bg-zeal-gold text-indigo-950 py-5 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-indigo-950/30 border-t-indigo-950 rounded-full animate-spin" }), _jsx("span", { children: "Authenticating..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Lock, { className: "w-5 h-5" }), _jsx("span", { children: "Secure Login" })] })) })] }) })] })] }));
};
