import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, User, EyeOff, Briefcase, Skull, Brain, Scale, Mail } from 'lucide-react';
import { storage } from '../lib/storage';
import { STATUS_COLORS } from '../constants';
import { emailService } from '../lib/emailService';
export const AdminDashboard = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = React.useState(null);
    const [complaints, setComplaints] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All');
    const [priorityFilter, setPriorityFilter] = React.useState('All');
    const [sendingEmail, setSendingEmail] = React.useState(null);
    React.useEffect(() => {
        const currentAdmin = storage.getCurrentAdmin();
        if (!currentAdmin) {
            navigate('/admin/login');
            return;
        }
        setAdmin(currentAdmin);
        const allComplaints = storage.getComplaints();
        if (currentAdmin.assignedCategory === 'ALL') {
            setComplaints(allComplaints);
        }
        else {
            setComplaints(allComplaints.filter(c => c.category === currentAdmin.assignedCategory));
        }
    }, [navigate]);
    const handleLogout = () => {
        storage.logoutAdmin();
        navigate('/admin/login');
    };
    const handleStatusUpdate = async (id, newStatus) => {
        storage.updateComplaintStatus(id, newStatus);
        const updated = complaints.map(c => {
            if (c.id === id) {
                return { ...c, status: newStatus, resolvedAt: newStatus === 'Resolved' ? Date.now() : c.resolvedAt };
            }
            return c;
        });
        setComplaints(updated);
        if (newStatus === 'Resolved') {
            const target = updated.find(c => c.id === id);
            if (target) {
                setSendingEmail(id);
                await emailService.sendComplaintResolvedEmail(target);
                setSendingEmail(null);
            }
        }
    };
    const filtered = complaints.filter(c => {
        const matchesSearch = c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });
    // Sort by ML score (highest first = most urgent)
    const sortedFiltered = [...filtered].sort((a, b) => {
        const scoreA = a.mlScore?.finalScore || 0;
        const scoreB = b.mlScore?.finalScore || 0;
        return scoreB - scoreA;
    });
    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'Critical': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'Low': return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };
    if (!admin)
        return null;
    const criticalCount = complaints.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').length;
    const fairnessFlags = complaints.filter(c => c.mlScore?.fairnessFlag).length;
    return (_jsxs("div", { className: "bg-slate-50 min-h-screen pb-20", children: [_jsx("div", { className: "bg-white border-b border-slate-200 pt-10 pb-10 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center space-x-5", children: [_jsx("div", { className: "w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg", children: _jsx(Briefcase, { className: "w-8 h-8" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-black text-slate-900 leading-tight", children: admin.name }), _jsxs("div", { className: "flex items-center space-x-3 mt-1 flex-wrap gap-2", children: [_jsxs("span", { className: "text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded", children: ["Dept: ", admin.assignedCategory] }), _jsxs("span", { className: "text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded", children: ["Role: ", admin.role] }), criticalCount > 0 && (_jsxs("span", { className: "text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-600 px-2 py-0.5 rounded animate-pulse", children: ["\u26A0 ", criticalCount, " CRITICAL PENDING"] }))] })] })] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center space-x-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors border border-rose-100", children: [_jsx(LogOut, { className: "w-4 h-4" }), _jsx("span", { children: "Logout" })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12", children: [_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12", children: [_jsxs("div", { className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm", children: [_jsx("div", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1", children: "Pending" }), _jsx("div", { className: "text-3xl font-black text-slate-900", children: complaints.filter(c => c.status === 'Pending').length })] }), _jsxs("div", { className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500", children: [_jsx("div", { className: "text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1", children: "In Progress" }), _jsx("div", { className: "text-3xl font-black text-blue-600", children: complaints.filter(c => c.status === 'In Progress').length })] }), _jsxs("div", { className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500", children: [_jsx("div", { className: "text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1", children: "Resolved" }), _jsx("div", { className: "text-3xl font-black text-emerald-600", children: complaints.filter(c => c.status === 'Resolved').length })] }), _jsxs("div", { className: "bg-white p-5 rounded-3xl border border-rose-200 shadow-sm border-l-4 border-l-rose-600", children: [_jsx("div", { className: "text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1", children: "Critical \uD83D\uDD34" }), _jsx("div", { className: "text-3xl font-black text-rose-600", children: complaints.filter(c => c.priority === 'Critical').length })] }), _jsxs("div", { className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-rose-400", children: [_jsx("div", { className: "text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1", children: "Policy Violat." }), _jsx("div", { className: "text-3xl font-black text-rose-500", children: complaints.filter(c => c.policyViolation).length })] }), _jsxs("div", { className: "bg-white p-5 rounded-3xl border border-amber-200 shadow-sm border-l-4 border-l-amber-500", children: [_jsxs("div", { className: "text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center space-x-1", children: [_jsx(Scale, { className: "w-3 h-3" }), _jsx("span", { children: "Fairness Flags" })] }), _jsx("div", { className: "text-3xl font-black text-amber-600", children: fairnessFlags })] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-8", children: [_jsxs("div", { className: "relative flex-grow", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsx("input", { type: "text", placeholder: "Search Subject or ID...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 font-medium outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all" })] }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "bg-white border border-slate-200 rounded-2xl px-5 py-3.5 font-medium outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all", children: [_jsx("option", { value: "All", children: "All Statuses" }), _jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "In Progress", children: "In Progress" }), _jsx("option", { value: "Resolved", children: "Resolved" })] }), _jsxs("select", { value: priorityFilter, onChange: (e) => setPriorityFilter(e.target.value), className: "bg-white border border-slate-200 rounded-2xl px-5 py-3.5 font-medium outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all", children: [_jsx("option", { value: "All", children: "All Priorities" }), _jsx("option", { value: "Critical", children: "Critical" }), _jsx("option", { value: "High", children: "High" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "Low", children: "Low" })] })] }), _jsxs("div", { className: "flex items-center space-x-2 mb-4 text-xs text-slate-500 font-medium", children: [_jsx(Brain, { className: "w-3.5 h-3.5 text-indigo-600" }), _jsx("span", { children: "Sorted by ML Priority Score (highest urgency first)" }), _jsx("span", { className: "text-slate-300", children: "\u00B7" }), _jsxs("span", { children: [sortedFiltered.length, " complaints shown"] })] }), _jsx("div", { className: "space-y-4", children: sortedFiltered.length === 0 ? (_jsxs("div", { className: "bg-white p-20 rounded-[3rem] text-center border border-slate-200", children: [_jsx(Search, { className: "w-10 h-10 text-slate-300 mx-auto mb-6" }), _jsx("h3", { className: "text-xl font-bold text-slate-900", children: "Queue is Clear" })] })) : (sortedFiltered.map((c) => (_jsx("div", { className: `bg-white rounded-[2rem] border p-8 shadow-sm transition-shadow hover:shadow-md ${c.priority === 'Critical'
                                ? 'border-rose-300 ring-2 ring-rose-50'
                                : c.policyViolation
                                    ? 'border-rose-200 ring-1 ring-rose-50'
                                    : 'border-slate-200'}`, children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-start gap-8", children: [_jsxs("div", { className: "flex-grow", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-4", children: [_jsxs("span", { className: "text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase", children: ["#", c.id] }), _jsxs("span", { className: `text-[10px] font-black px-2 py-1 rounded uppercase border ${getPriorityBadgeClass(c.priority)}`, children: [c.priority === 'Critical' && '🔴 ', c.priority === 'High' && '🟠 ', c.priority === 'Medium' && '🟡 ', c.priority === 'Low' && '⚪ ', c.priority, " Priority"] }), c.mlScore && (_jsxs("span", { className: "text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase flex items-center space-x-1", children: [_jsx(Brain, { className: "w-3 h-3" }), _jsxs("span", { children: ["ML: ", c.mlScore.finalScore.toFixed(0), "/100"] })] })), c.mlScore?.fairnessFlag && (_jsxs("span", { className: "text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase flex items-center space-x-1", children: [_jsx(Scale, { className: "w-3 h-3" }), _jsx("span", { children: "Fairness Flag" })] })), c.policyViolation && (_jsxs("span", { className: "text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-1 rounded uppercase flex items-center", children: [_jsx(Skull, { className: "w-3 h-3 mr-1" }), "Policy Violation"] }))] }), _jsx("h2", { className: "text-xl font-black text-slate-900 mb-2", children: c.subject }), _jsxs("p", { className: "text-slate-500 text-sm leading-relaxed mb-4 italic", children: ["\"", c.description, "\""] }), c.mlScore && (_jsxs("div", { className: "mb-4 bg-slate-50 rounded-xl p-4 border border-slate-100", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1", children: [_jsx(Brain, { className: "w-3 h-3" }), _jsx("span", { children: "ML Analysis" })] }), _jsxs("span", { className: "text-[10px] font-bold text-slate-600", children: [c.mlScore.reasoning.substring(0, 80), "..."] })] }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: [
                                                            { label: 'Urgency', value: c.mlScore.urgencyScore },
                                                            { label: 'Sentiment', value: c.mlScore.sentimentScore },
                                                            { label: 'Impact', value: c.mlScore.impactScore },
                                                            { label: 'Frequency', value: c.mlScore.frequencyScore },
                                                        ].map(metric => (_jsxs("div", { children: [_jsx("div", { className: "text-[9px] font-black text-slate-400 uppercase mb-1", children: metric.label }), _jsx("div", { className: "h-1.5 bg-slate-200 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-indigo-600 rounded-full", style: { width: `${metric.value}%` } }) }), _jsx("div", { className: "text-[9px] text-slate-500 mt-0.5", children: metric.value.toFixed(0) })] }, metric.label))) })] })), _jsxs("div", { className: "flex items-center space-x-4", children: [c.isAnonymous && !c.policyViolation ? (_jsxs("div", { className: "flex items-center text-slate-400 bg-slate-50 px-3 py-1 rounded-full text-xs font-bold", children: [_jsx(EyeOff, { className: "w-3.5 h-3.5 mr-2" }), _jsx("span", { children: "Identity Hidden" })] })) : (_jsxs("div", { className: `flex items-center px-3 py-1 rounded-full text-xs font-bold ${c.policyViolation ? 'bg-rose-600 text-white' : 'bg-indigo-50 text-indigo-600'}`, children: [_jsx(User, { className: "w-3.5 h-3.5 mr-2" }), _jsxs("span", { children: [c.studentName, " (", c.studentId, ")"] })] })), c.studentEmail && !c.isAnonymous && (_jsxs("div", { className: "flex items-center text-slate-500 text-xs font-medium", children: [_jsx(Mail, { className: "w-3 h-3 mr-1" }), c.studentEmail] }))] })] }), _jsxs("div", { className: "flex flex-col items-center gap-3 lg:w-56 pt-4 lg:pt-0 lg:pl-8 lg:border-l border-slate-100 shrink-0", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2 w-full", children: [_jsx("button", { onClick: () => handleStatusUpdate(c.id, 'In Progress'), className: `py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${c.status === 'In Progress' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-blue-50'}`, children: "Process" }), _jsx("button", { onClick: () => handleStatusUpdate(c.id, 'Resolved'), disabled: sendingEmail === c.id, className: `py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${c.status === 'Resolved'
                                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                                            : sendingEmail === c.id
                                                                ? 'bg-emerald-100 text-emerald-600 border-emerald-200 cursor-wait'
                                                                : 'bg-white text-slate-500 border-slate-200 hover:bg-emerald-50'}`, children: sendingEmail === c.id ? '📧...' : 'Resolve' })] }), _jsx("div", { className: `text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${STATUS_COLORS[c.status]}`, children: c.status }), sendingEmail === c.id && (_jsx("div", { className: "text-[10px] text-emerald-600 font-bold animate-pulse", children: "\uD83D\uDCE7 Sending resolution email..." })), _jsx("div", { className: "text-[10px] text-slate-400 font-medium text-center", children: new Date(c.createdAt).toLocaleDateString('en-IN') })] })] }) }, c.id)))) })] })] }));
};
