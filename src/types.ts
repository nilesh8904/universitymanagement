export type UserRole = 'university_admin' | 'college_admin' | 'student';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  collegeId?: string;
  studentInfo?: {
    rollNumber?: string;
    department?: string;
    semester?: number;
    year?: number;
    courses?: string[];
  };
  facultyInfo?: {
    employeeId?: string;
    department?: string;
    specialization?: string;
    phone?: string;
  };
}

export interface College {
  _id?: string;
  id?: string;
  name: string;
  code: string;
  address: string;
  establishedYear: number;
  dean: string;
  totalStudents?: number;
  totalFaculty?: number;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  duration: string;
  degree: string;
  collegeId: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  facultyId: string;
  facultyName: string;
  programId: string;
  collegeId: string;
  semester: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  collegeId: string;
  specialization: string;
  phone: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  collegeId: string;
  programId: string;
  semester: number;
  enrollmentYear: number;
  phone: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  facultyId: string;
  dueDate: string;
  maxMarks: number;
  attachments: string[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  files: string[];
  marks?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  examType: string;
  marks: number;
  maxMarks: number;
  grade: string;
  semester: number;
}

export interface Timetable {
  _id?: string;
  id?: string;
  course?: {
    _id: string;
    name: string;
    code: string;
  };
  courseId?: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  faculty?: {
    _id: string;
    name: string;
    email: string;
  };
  facultyId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetRole: UserRole | 'all';
  createdAt: string;
  read: boolean;
}