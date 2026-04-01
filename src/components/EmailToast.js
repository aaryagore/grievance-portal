import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Mail, CheckCircle, AlertTriangle, X } from 'lucide-react';
export const EmailToast = () => {
    const [notification, setNotification] = useState(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const handler = (e) => {
            const detail = e.detail;
            setNotification(detail);
            setVisible(true);
            setTimeout(() => setVisible(false), 5000);
            setTimeout(() => setNotification(null), 5500);
        };
        window.addEventListener('zcoer-mail-sent', handler);
        return () => window.removeEventListener('zcoer-mail-sent', handler);
    }, []);
    if (!notification)
        return null;
    const isResolution = notification.type === 'resolution';
    const hasError = notification.error;
    return (_jsx("div", { className: `fixed bottom-6 right-6 z-[100] max-w-sm w-full transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`, children: _jsxs("div", { className: `rounded-2xl shadow-2xl overflow-hidden border ${hasError
                ? 'bg-rose-50 border-rose-200'
                : isResolution
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-indigo-50 border-indigo-200'}`, children: [_jsx("div", { className: `px-4 py-2 text-xs font-black uppercase tracking-widest text-white ${hasError ? 'bg-rose-500' : isResolution ? 'bg-emerald-600' : 'bg-indigo-600'}`, children: hasError ? '⚠ Email notification failed' : '✉ Email notification dispatched' }), _jsxs("div", { className: "p-4 flex items-start space-x-3", children: [_jsx("div", { className: `p-2 rounded-xl shrink-0 ${hasError ? 'bg-rose-100' : isResolution ? 'bg-emerald-100' : 'bg-indigo-100'}`, children: hasError
                                ? _jsx(AlertTriangle, { className: "w-5 h-5 text-rose-600" })
                                : isResolution
                                    ? _jsx(CheckCircle, { className: "w-5 h-5 text-emerald-600" })
                                    : _jsx(Mail, { className: "w-5 h-5 text-indigo-600" }) }), _jsxs("div", { className: "flex-grow min-w-0", children: [_jsx("div", { className: "font-black text-slate-900 text-sm", children: hasError
                                        ? 'Mail delivery failed'
                                        : isResolution
                                            ? 'Resolution Notice Sent'
                                            : 'Complaint Receipt Sent' }), _jsxs("div", { className: "text-xs text-slate-500 mt-0.5 truncate", children: [hasError ? 'Check backend server · ' : 'To: ', notification.to] }), _jsxs("div", { className: "text-xs font-bold text-slate-700 mt-1 font-mono", children: ["Case #", notification.id] })] }), _jsx("button", { onClick: () => setVisible(false), className: "text-slate-400 hover:text-slate-600 p-1", children: _jsx(X, { className: "w-4 h-4" }) })] })] }) }));
};
