import type { Complaint, Statistics, AdminUser, StudentUser } from '../types';
import { STORAGE_KEY, ADMIN_SESSION_KEY, STUDENT_SESSION_KEY } from '../constants';

export const storage = {
  getComplaints: (): Complaint[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveComplaint: (complaint: Complaint) => {
    const complaints = storage.getComplaints();
    complaints.unshift(complaint);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  },

  updateComplaintStatus: (id: string, status: Complaint['status']) => {
    const complaints = storage.getComplaints();
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      complaints[index].status = status;
      if (status === 'Resolved') {
        complaints[index].resolvedAt = Date.now();
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    }
  },

  getComplaintById: (id: string): Complaint | null => {
    const complaints = storage.getComplaints();
    return complaints.find(c => c.id === id) || null;
  },

  getStats: (): Statistics => {
    const complaints = storage.getComplaints();
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      critical: complaints.filter(c => c.priority === 'Critical').length,
      high: complaints.filter(c => c.priority === 'High').length,
    };
  },

  // Admin Session Management
  loginAdmin: (admin: AdminUser) => {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
  },

  logoutAdmin: () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  },

  getCurrentAdmin: (): AdminUser | null => {
    const data = localStorage.getItem(ADMIN_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Student Session Management
  loginStudent: (student: StudentUser) => {
    localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(student));
  },

  logoutStudent: () => {
    localStorage.removeItem(STUDENT_SESSION_KEY);
  },

  getCurrentStudent: (): StudentUser | null => {
    const data = localStorage.getItem(STUDENT_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
};
