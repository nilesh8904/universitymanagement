import { useState, useEffect } from 'react';
import { Course, Attendance, Result, Timetable } from '../types';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'attendance' | 'results' | 'timetable' | 'materials' | 'profile'>('overview');
  
  const [courses, setCourses] = useState<Course[]>([]);

  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');

  const [timetable, setTimetable] = useState<Timetable[]>([]);

  const [results, setResults] = useState<Result[]>([]);


  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; url: string } | null>(null);

  const { user } = useAuth();
  const studentId = user?._id || '';

  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const loadCourses = async () => {
    try {
      const fetched = await authService.getStudentCourses();
      const mappedCourses = (fetched || []).map((c: any) => ({
        id: c._id,
        name: c.name,
        code: c.code,
        credits: c.credits,
        facultyId: c.faculty?._id || '',
        facultyName: c.faculty?.name || '',
        programId: '',
        collegeId: c.college,
        semester: c.semester,
        attendanceRate: c.attendanceRate || 0,
      }));
      setCourses(mappedCourses);
    } catch (error) {
      console.error('Unable to load student courses:', error);
    }
  };

  const loadAttendance = async () => {
    try {
      const fetched = await authService.getStudentAttendance();
      const mappedAttendance = (fetched || []).map((a: any) => ({
        id: a._id,
        studentId: a.student?._id || a.student,
        courseId: a.course?._id || a.course,
        date: a.date,
        status: a.status,
        markedBy: a.markedBy,
      }));
      setAttendance(mappedAttendance);
    } catch (error) {
      console.error('Unable to load student attendance:', error);
    }
  };

  const loadResults = async () => {
    try {
      const fetched = await authService.getStudentResults();
      const mappedResults = (fetched || []).map((r: any) => ({
        id: r._id,
        studentId: r.student?._id || r.student,
        courseId: r.course?._id || r.course,
        examType: r.examType,
        marks: r.marks,
        maxMarks: r.maxMarks,
        grade: r.grade,
        semester: r.semester,
      }));
      setResults(mappedResults);
    } catch (error) {
      console.error('Unable to load student results:', error);
    }
  };

  const loadMaterials = async (courseId?: string) => {
    try {
      let url = '/student/materials';
      if (courseId && courseId !== 'all') {
        url += `?courseId=${courseId}`;
      }
      console.log('📚 Loading materials with courseId:', courseId === 'all' ? 'ALL' : courseId || 'NONE');
      
      const response = await fetch(`${API_URL}${url}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        const fetched = data.data;
        console.log(`✅ StudentDashboard: ${fetched?.length || 0} materials fetched:`, fetched);

        const mappedMaterials = (fetched || []).map((m: any) => ({
          id: m._id || m.id,
          title: m.title || 'Untitled Material',
          description: m.description || '',
          url: m.url || '',
          type: m.type || 'file',
          courseId: m.course?._id || m.course || '',
          courseName: m.course?.name || m.courseName || 'Unknown Course',
          uploadedByName: m.uploadedBy?.name || 'Unknown',
          createdAt: m.uploadedAt || m.createdAt,
          raw: m,
        }));

        console.log(`📊 Total materials to display: ${mappedMaterials.length}`);
        setMaterials(mappedMaterials);
      } else {
        console.error('Failed to fetch materials:', data.message);
        setMaterials([]);
      }
    } catch (error) {
      console.error('Unable to load student materials:', error);
      setMaterials([]);
    }
  };

  const loadTimetable = async () => {
    try {
      const fetched = await authService.getStudentTimetable();
      const mappedTimetable = (fetched || []).map((t: any) => ({
        id: t._id,
        courseId: t.course?._id || t.course,
        day: t.day,
        startTime: t.startTime,
        endTime: t.endTime,
        room: t.room,
        facultyId: t.faculty?._id || t.faculty,
      }));
      setTimetable(mappedTimetable);
    } catch (error) {
      console.error('Unable to load student timetable:', error);
    }
  };

  useEffect(() => {
    loadCourses();
    loadAttendance();
    loadResults();
    loadMaterials();
    loadTimetable();
  }, []);

  useEffect(() => {
    if (activeTab === 'materials') {
      loadMaterials(selectedCourseFilter);
    }
  }, [selectedCourseFilter, activeTab]);

  const handleViewVideo = (material: { title: string; url: string }) => {
    setSelectedVideo(material);
    setShowVideoModal(true);
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await authService.changePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully');
    } catch (error: any) {
      console.error('Unable to change password:', error);
      alert(error?.message || 'Failed to change password');
    }
  };

  const getAttendancePercentage = (courseId: string) => {
    const courseAttendance = attendance.filter(a => a.studentId === studentId && a.courseId === courseId);
    if (courseAttendance.length === 0) return 0;
    const present = courseAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    return ((present / courseAttendance.length) * 100).toFixed(1);
  };

  const getOverallAttendance = () => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    if (studentAttendance.length === 0) return 0;
    const present = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    return ((present / studentAttendance.length) * 100).toFixed(1);
  };

  const calculateGPA = () => {
    const gradePoints: { [key: string]: number } = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0 };
    const studentResults = results.filter(r => r.studentId === studentId);
    if (studentResults.length === 0) return 0;
    const totalPoints = studentResults.reduce((sum, r) => sum + (gradePoints[r.grade] || 0), 0);
    return (totalPoints / studentResults.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <div className="text-sm text-gray-600">
              Student ID: <span className="font-semibold text-gray-900">{studentId}</span>
            </div>
          </div>
          <div className="flex space-x-8 border-b overflow-x-auto">
            {(['overview', 'courses', 'attendance', 'results', 'timetable', 'materials', 'profile'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Enrolled Courses</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{courses.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overall Attendance</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{getOverallAttendance()}%</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available Materials</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {materials.length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current GPA</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{calculateGPA()}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Videos</h3>
                <div className="space-y-3">
                  {materials.slice(0, 3).map((material) => {
                    const courseName = material.courseName || 'General';
                    const uploadedDate = material.createdAt ? new Date(material.createdAt).toLocaleDateString() : 'N/A';
                    return (
                      <div key={material.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{material.title}</p>
                          <p className="text-sm text-gray-600">{courseName} • {uploadedDate}</p>
                        </div>
                        <button
                          onClick={() => handleViewVideo({ title: material.title, url: material.url })}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Watch
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
                <div className="space-y-3">
                  {results.slice(0, 3).map((result) => {
                    const course = courses.find(c => c.id === result.courseId);
                    return (
                      <div key={result.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{course?.name}</p>
                          <p className="text-sm text-gray-600">{result.examType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{result.grade}</p>
                          <p className="text-xs text-gray-500">{result.marks}/{result.maxMarks}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{course.code}</span>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{course.credits} Credits</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Faculty:</span> {course.facultyName}</p>
                    <p><span className="font-medium">Semester:</span> {course.semester}</p>
                    <div className="pt-2 border-t border-gray-100 mt-3">
                      <p className="font-medium text-gray-900">Attendance: {getAttendancePercentage(course.id)}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${getAttendancePercentage(course.id)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">My Attendance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-3xl font-bold text-green-600">{getAttendancePercentage(course.id)}%</p>
                  <p className="text-sm text-gray-600 mt-1">Attendance Rate</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendance
                    .filter(a => a.studentId === studentId)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => {
                      const course = courses.find(c => c.id === record.courseId);
                      return (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{record.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{course?.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Results</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current GPA</p>
                <p className="text-2xl font-bold text-purple-600">{calculateGPA()}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.filter(r => r.studentId === studentId).map((result) => {
                    const course = courses.find(c => c.id === result.courseId);
                    const percentage = ((result.marks / result.maxMarks) * 100).toFixed(1);
                    return (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{course?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{result.examType}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {result.marks}/{result.maxMarks} ({percentage}%)
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                            result.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                            result.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{result.semester}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">My Timetable</h2>
            
            {timetable.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600">No timetable entries available</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {timetable.map((entry) => (
                      <tr key={entry._id || entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {entry.course?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {entry.faculty?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {entry.day || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {entry.startTime} - {entry.endTime}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {entry.room || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Course Materials</h2>
              <div className="flex items-center space-x-4">
                <label htmlFor="courseFilter" className="text-sm font-medium text-gray-700">Filter by Course:</label>
                <select
                  id="courseFilter"
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => {
                const courseName = material.courseName || 'General';
                const uploadedDate = material.createdAt ? new Date(material.createdAt).toLocaleDateString() : 'N/A';
                const isVideo = material.type === 'video' || material.url.includes('video') || material.url.includes('mp4');
                
                return (
                  <div key={material.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        isVideo ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {isVideo ? (
                          <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isVideo ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isVideo ? 'Video' : 'Material'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
                    {material.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                    )}
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Course:</span> {courseName}</p>
                      <p><span className="font-medium">Uploaded:</span> {uploadedDate}</p>
                    </div>
                    <button
                      onClick={() => isVideo ? handleViewVideo({ title: material.title, url: material.url }) : window.open(material.url, '_blank')}
                      className={`w-full mt-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                        isVideo ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isVideo ? (
                        <>
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"></path>
                          </svg>
                          <span>View Video</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                          <span>View Material</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {showVideoModal && selectedVideo && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h3>
                    <button
                      onClick={() => setShowVideoModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-black rounded-lg overflow-hidden">
                    <video
                      key={selectedVideo.url}
                      controls
                      className="w-full h-auto max-h-96"
                      src={selectedVideo.url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">Video from Cloudinary</p>
                </div>
              </div>
            )}

            {materials.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No materials found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedCourseFilter === 'all' 
                    ? 'No materials available for your enrolled courses.' 
                    : 'No materials found for the selected course.'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleChangePassword}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
