import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { SubmitComplaint } from './pages/SubmitComplaint';
import { ComplaintList } from './pages/ComplaintList';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentLogin } from './pages/StudentLogin';
import { EmailToast } from './components/EmailToast';
const App = () => {
    return (_jsx(HashRouter, { children: _jsxs(Layout, { children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/submit", element: _jsx(SubmitComplaint, {}) }), _jsx(Route, { path: "/view", element: _jsx(ComplaintList, {}) }), _jsx(Route, { path: "/login", element: _jsx(StudentLogin, {}) }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin/dashboard", element: _jsx(AdminDashboard, {}) })] }), _jsx(EmailToast, {})] }) }));
};
export default App;
