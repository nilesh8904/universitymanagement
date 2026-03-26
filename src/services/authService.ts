import { apiRequest } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'university_admin' | 'college_admin' | 'student';
  collegeId?: string;
  studentInfo?: any;
  facultyInfo?: any;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 AuthService: Attempting login with:', credentials);
      const data = await apiRequest('/auth/login', 'POST', credentials);
      console.log('🔐 AuthService: API response:', data);
      
      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        console.log('🔐 AuthService: Login successful, stored user data');
      }
      return data.data;
    } catch (error: any) {
      console.error('🔐 AuthService: Login failed:', error.message);
      // Return null so the auth context knows it failed
      return null;
    }
  },

  register: async (userData: RegisterData) => {
    const data = await apiRequest('/auth/register', 'POST', userData);
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data.data;
  },

  getColleges: async () => {
    const data = await apiRequest('/university/colleges', 'GET');
    return data.data;
  },

  getCollegeAdmins: async () => {
    const data = await apiRequest('/university/college-admins', 'GET');
    return data.data;
  },

  createCollege: async (payload: { name: string; code: string; address: string; dean: string; establishedYear: number }) => {
    const data = await apiRequest('/university/colleges', 'POST', payload);
    return data.data;
  },

  createCollegeAdmin: async (payload: { name: string; email: string; collegeId: string; facultyInfo?: any }) => {
    const data = await apiRequest('/university/college-admins', 'POST', payload);
    return data.data;
  },

  getCollegeStudents: async () => {
    const data = await apiRequest('/college/students', 'GET');
    return data.data;
  },

  createCollegeStudent: async (payload: { name: string; email: string; studentInfo?: any }) => {
    const data = await apiRequest('/college/students', 'POST', payload);
    return data.data;
  },

  getCollegeCourses: async () => {
    const data = await apiRequest('/college/courses', 'GET');
    return data.data;
  },

  createCollegeCourse: async (payload: { name: string; code: string; credits: number; faculty: string; semester: number }) => {
    const data = await apiRequest('/college/courses', 'POST', payload);
    return data.data;
  },

  getCollegeMaterials: async () => {
    const data = await apiRequest('/college/materials', 'GET');
    return data.data;
  },

  createCollegeMaterial: async (payload: { title: string; description?: string; courseId: string; url: string; type?: string }) => {
    const data = await apiRequest('/college/materials', 'POST', payload);
    return data.data;
  },

  getStudentMaterials: async () => {
    const data = await apiRequest('/student/materials', 'GET');
    return data.data;
  },

  getStudentTimetable: async () => {
    const data = await apiRequest('/student/timetable', 'GET');
    return data.data;
  },

  getCurrentUser: async () => {
    const data = await apiRequest('/auth/me', 'GET');
    return data.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const data = await apiRequest('/auth/change-password', 'PUT', {
      oldPassword,
      newPassword,
    });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};
