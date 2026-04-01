import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChevronDown, EyeOff, Send, User, MessageSquare, ShieldAlert, Skull, ShieldX, } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { storage } from '../lib/storage';
import { emailService } from '../lib/emailService';
import { mlPrioritize, detectAbuse } from '../lib/mlEngine';
export const SubmitComplaint = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentStudent = storage.getCurrentStudent();
    const [isAnonymous, setIsAnonymous] = React.useState(false);
    const [category, setCategory] = React.useState('Academics');
    const [subject, setSubject] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submissionStep, setSubmissionStep] = React.useState('idle');
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [policyNotice, setPolicyNotice] = React.useState(null);
    const [detectedAbuse, setDetectedAbuse] = React.useState(false);
    // Mandatory Login Check
    React.useEffect(() => {
        if (!currentStudent) {
            navigate('/login', { state: { message: 'Authentication required to lodge a grievance.', from: location.pathname } });
        }
    }, [currentStudent, navigate, location]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentStudent)
            return;
        setIsSubmitting(true);
        setSubmissionStep('analyzing');
        setPolicyNotice(null);
        // Detect abuse
        const isAbusive = detectAbuse(description);
        // Run ML prioritization
        const { priority, mlScore } = await mlPrioritize(category, subject, description, isAbusive);
        // Policy Violation Logic
        let forceDisclosure = false;
        if (isAbusive) {
            setDetectedAbuse(true);
            forceDisclosure = true;
            setPolicyNotice("AI detected abusive language or policy violation. Anonymous protection is VOID. Your identity (ZPRN) is being attached to this record.");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        setSubmissionStep('submitting');
        await new Promise(resolve => setTimeout(resolve, 800));
        const finalAnonymous = forceDisclosure ? false : isAnonymous;
        const newComplaint = {
            id: "ZES-" + Math.random().toString(36).substr(2, 7).toUpperCase(),
            category,
            subject,
            description,
            isAnonymous: finalAnonymous,
            policyViolation: forceDisclosure,
            studentName: finalAnonymous ? undefined : currentStudent.name,
            studentId: finalAnonymous ? undefined : currentStudent.zprn,
            studentEmail: currentStudent.email,
            createdAt: Date.now(),
            status: 'Pending',
            priority,
            mlScore,
            emailSent: false,
            resolutionEmailSent: false,
        };
        storage.saveComplaint(newComplaint);
        // Send email notification
        setSubmissionStep('emailing');
        await emailService.sendComplaintRaisedEmail(currentStudent, newComplaint);
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            navigate('/view');
        }, 2500);
    };
    if (!currentStudent)
        return null;
    if (isSuccess) {
        return (_jsxs("div", { className: "max-w-lg mx-auto py-24 px-4 text-center", children: [_jsx("div", { className: `w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ${detectedAbuse ? 'bg-rose-50' : 'bg-emerald-50'}`, children: detectedAbuse ? _jsx(Skull, { className: "w-12 h-12 text-rose-600" }) : _jsx(CheckCircle2, { className: "w-12 h-12 text-emerald-600" }) }), _jsx("h2", { className: "text-4xl font-black text-indigo-900 mb-4 tracking-tight", children: detectedAbuse ? 'Record Flagged' : 'Case Registered' }), _jsx("p", { className: "text-slate-600 mb-6 text-lg leading-relaxed", children: detectedAbuse
                        ? 'Your grievance was submitted, but flagged for abusive content. Your identity has been recorded for review.'
                        : 'Your grievance has been logged and ML-prioritized. A confirmation email has been dispatched to your inbox.' }), !detectedAbuse && (_jsxs("div", { className: "bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-8 text-sm text-indigo-700 font-medium", children: ["\uD83D\uDCE7 Check your email at ", _jsx("strong", { children: currentStudent.email }), " for your complaint receipt."] })), _jsxs("div", { className: "flex items-center justify-center space-x-2 text-indigo-600 font-bold", children: [_jsx("div", { className: "w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" }), _jsx("span", { children: "Redirecting..." })] })] }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-12", children: [_jsx("span", { className: "text-indigo-600 font-black text-xs uppercase tracking-widest mb-2 block", children: "Registration Desk" }), _jsx("h1", { className: "text-4xl font-black text-indigo-900", children: "Official Redressal Form" }), _jsxs("p", { className: "text-slate-500 mt-3 text-lg", children: ["Logged in as ", _jsx("span", { className: "text-indigo-600 font-bold", children: currentStudent.name }), " \u00B7 Email: ", _jsx("span", { className: "text-slate-700 font-medium", children: currentStudent.email })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [policyNotice && (_jsxs("div", { className: "bg-rose-600 text-white p-6 rounded-3xl shadow-xl shadow-rose-200 flex items-start space-x-4 animate-bounce", children: [_jsx(ShieldX, { className: "w-8 h-8 shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-black text-lg uppercase tracking-tight", children: "Critical Policy Alert" }), _jsx("p", { className: "font-bold text-sm opacity-90", children: policyNotice })] })] })), _jsxs("div", { className: "bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-5", children: [_jsx("div", { className: `p-4 rounded-2xl transition-colors ${isAnonymous ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`, children: _jsx(EyeOff, { className: "w-7 h-7" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-black text-indigo-950 text-lg", children: "Report Anonymously" }), _jsx("p", { className: "text-sm text-slate-500 font-medium", children: "Identity is masked unless Code of Conduct is violated." })] })] }), _jsx("button", { type: "button", disabled: isSubmitting, onClick: () => setIsAnonymous(!isAnonymous), className: `relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'}`, children: _jsx("span", { className: `inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${isAnonymous ? 'translate-x-7' : 'translate-x-1'}` }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6", children: [_jsxs("h2", { className: "text-xl font-black text-indigo-950 flex items-center space-x-3", children: [_jsx(MessageSquare, { className: "w-6 h-6 text-indigo-600" }), _jsx("span", { children: "Classification" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider", children: "Complaint Category *" }), _jsxs("div", { className: "relative", children: [_jsx("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all", children: CATEGORIES.map(cat => (_jsx("option", { value: cat, children: cat }, cat))) }), _jsx(ChevronDown, { className: "absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider", children: "Subject Title *" }), _jsx("input", { required: true, type: "text", placeholder: "Summary of the issue...", value: subject, onChange: (e) => setSubject(e.target.value), className: "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" })] }), _jsxs("div", { className: "bg-indigo-50 p-5 rounded-2xl border border-indigo-100", children: [_jsxs("div", { className: "flex items-center space-x-3 text-indigo-700 mb-2", children: [_jsx(ShieldAlert, { className: "w-4 h-4" }), _jsx("span", { className: "text-xs font-black uppercase tracking-widest", children: "Anti-Abuse Monitor" })] }), _jsx("p", { className: "text-xs text-indigo-900/60 leading-relaxed font-medium", children: "ZCOER maintains zero tolerance for abusive language. AI monitors submissions." })] })] }) }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4", children: [_jsxs("h2", { className: "text-xl font-black text-indigo-950 flex items-center space-x-3", children: [_jsx(User, { className: "w-6 h-6 text-indigo-600" }), _jsx("span", { children: "Identity Status" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs("div", { className: "flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200", children: [_jsx("span", { className: "text-[10px] font-black uppercase text-slate-400 tracking-wider", children: "Mode:" }), _jsx("span", { className: `text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${isAnonymous ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`, children: isAnonymous ? 'Anonymous (Conditional)' : 'Identified' })] }), _jsxs("div", { className: "flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200", children: [_jsx("span", { className: "text-[10px] font-black uppercase text-slate-400 tracking-wider", children: "Email:" }), _jsx("span", { className: "text-xs font-bold text-slate-700", children: currentStudent.email })] }), _jsx("div", { className: "text-[10px] text-slate-500 font-bold bg-amber-50 p-4 rounded-xl border border-amber-100", children: "\uD83D\uDCE7 A confirmation email will be sent to your registered email upon submission." })] })] }), _jsxs("div", { className: "bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6", children: [_jsxs("h2", { className: "text-xl font-black text-indigo-950 flex items-center space-x-3", children: [_jsx(AlertCircle, { className: "w-6 h-6 text-indigo-600" }), _jsx("span", { children: "Description" })] }), _jsx("div", { children: _jsx("textarea", { required: true, rows: 5, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Describe the incident clearly... The ML engine analyzes your text for urgency, impact, and sentiment in real-time.", className: "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all resize-none" }) })] })] })] }), _jsxs("div", { className: "flex items-center justify-end space-x-6 pt-4", children: [_jsx("button", { type: "button", disabled: isSubmitting, onClick: () => navigate('/'), className: "px-10 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-all uppercase text-sm tracking-widest", children: "Discard" }), _jsxs("button", { disabled: isSubmitting, type: "submit", className: `px-12 py-4 rounded-2xl font-black shadow-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-4 uppercase text-sm tracking-widest ${submissionStep === 'analyzing'
                                    ? 'bg-zeal-gold text-indigo-950'
                                    : submissionStep === 'emailing'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-indigo-900 text-white hover:bg-indigo-950'}`, children: [isSubmitting ? (_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsx(Send, { className: "w-5 h-5" })), _jsxs("span", { children: [submissionStep === 'idle' && 'Submit Complaint', submissionStep === 'analyzing' && '🤖 ML Analyzing...', submissionStep === 'submitting' && 'Registering...', submissionStep === 'emailing' && '📧 Sending Email...'] })] })] })] })] }));
};
