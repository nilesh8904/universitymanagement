import { useState, useEffect } from 'react';
import { College, Program, User } from '../types';
import { authService } from '../services/authService';

export default function UniversityAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'colleges' | 'programs' | 'analytics' | 'collegeAdmins' | 'profile'>('overview');
  const [collegeAdmins, setCollegeAdmins] = useState<User[]>([]);
  const [showAddCollegeAdmin, setShowAddCollegeAdmin] = useState(false);
  const [newCollegeAdmin, setNewCollegeAdmin] = useState({ name: '', email: '', collegeId: '', facultyInfo: { employeeId: '', department: '', specialization: '', phone: '' } });

  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const [colleges, setColleges] = useState<College[]>([]);

  const [programs, setPrograms] = useState<Program[]>([
    { id: 'p1', name: 'Computer Science', code: 'CS', duration: '4 years', degree: 'B.Tech', collegeId: 'col1' },
    { id: 'p2', name: 'Mechanical Engineering', code: 'ME', duration: '4 years', degree: 'B.Tech', collegeId: 'col1' },
    { id: 'p3', name: 'Business Administration', code: 'MBA', duration: '2 years', degree: 'MBA', collegeId: 'col2' },
  ]);

  const [showAddCollege, setShowAddCollege] = useState(false);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [newCollege, setNewCollege] = useState({ name: '', code: '', address: '', establishedYear: 2024, dean: '' });
  const [newProgram, setNewProgram] = useState({ name: '', code: '', duration: '', degree: '', collegeId: '' });

  useEffect(() => {
    async function loadData() {
      try {
        const [adminsData, collegesData] = await Promise.all([
          authService.getCollegeAdmins(),
          authService.getColleges(),
        ]);
        setCollegeAdmins(adminsData || []);
        setColleges(collegesData || []);
      } catch (err) {
        console.error('Unable to fetch data', err);
      }
    }

    loadData();
  }, []);

  const handleAddCollege = async () => {
    if (!newCollege.name || !newCollege.code || !newCollege.address || !newCollege.dean) {
      alert('Please fill in all college details');
      return;
    }

    try {
      const createdCollege = await authService.createCollege({
        name: newCollege.name,
        code: newCollege.code,
        address: newCollege.address,
        dean: newCollege.dean,
        establishedYear: newCollege.establishedYear,
      });

      setColleges([...colleges, { ...createdCollege, totalStudents: createdCollege.totalStudents || 0, totalFaculty: createdCollege.totalFaculty || 0 }]);
      setNewCollege({ name: '', code: '', address: '', establishedYear: 2024, dean: '' });
      setShowAddCollege(false);
      alert('College created successfully in database');
    } catch (error: any) {
      console.error('Unable to create college:', error);
      alert(error?.message || 'Failed to create college');
    }
  };
  const handleAddCollegeAdmin = async () => {
    if (!newCollegeAdmin.name || !newCollegeAdmin.email || !newCollegeAdmin.collegeId) {
      alert('Please provide name, email and college');
      return;
    }

    try {
      const created = await authService.createCollegeAdmin({
        name: newCollegeAdmin.name,
        email: newCollegeAdmin.email,
        collegeId: newCollegeAdmin.collegeId,
        facultyInfo: newCollegeAdmin.facultyInfo,
      });

      setCollegeAdmins([...collegeAdmins, created]);
      setNewCollegeAdmin({ name: '', email: '', collegeId: '', facultyInfo: { employeeId: '', department: '', specialization: '', phone: '' } });
      setShowAddCollegeAdmin(false);
      alert('College admin created successfully');
    } catch (error: any) {
      console.error('Unable to create college admin:', error);
      alert(error?.message || 'Failed to create college admin');
    }
  };

  const handleAddProgram = () => {
    if (newProgram.name && newProgram.code && newProgram.collegeId) {
      setPrograms([...programs, { ...newProgram, id: `p${programs.length + 1}` }]);
      setNewProgram({ name: '', code: '', duration: '', degree: '', collegeId: '' });
      setShowAddProgram(false);
    }
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

  const totalStudents = colleges.reduce((sum, col) => sum + col.totalStudents, 0);
  const totalFaculty = colleges.reduce((sum, col) => sum + col.totalFaculty, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">University Admin Dashboard</h1>
          </div>
          <div className="flex space-x-8 border-b">
            {(['overview', 'colleges', 'programs', 'analytics', 'collegeAdmins', 'profile'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
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
                    <p className="text-sm text-gray-600">Total Colleges</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{colleges.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalStudents.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Faculty</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalFaculty}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Programs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{programs.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">College Overview</h3>
              <div className="space-y-4">
                {colleges.map((college) => (
                  <div key={college._id || college.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{college.name}</h4>
                      <p className="text-sm text-gray-600">Dean: {college.dean}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{college.totalStudents} Students</p>
                      <p className="text-sm text-gray-600">{college.totalFaculty} Faculty</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'colleges' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Colleges</h2>
              <button
                onClick={() => setShowAddCollege(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add College
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <div key={college._id || college.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">{college.code}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{college.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Dean:</span> {college.dean}</p>
                    <p><span className="font-medium">Established:</span> {college.establishedYear}</p>
                    <p><span className="font-medium">Address:</span> {college.address}</p>
                    <div className="pt-2 border-t border-gray-100 mt-3">
                      <p><span className="font-medium">Students:</span> {college.totalStudents}</p>
                      <p><span className="font-medium">Faculty:</span> {college.totalFaculty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showAddCollege && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Add New College</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="College Name"
                      value={newCollege.name}
                      onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="College Code"
                      value={newCollege.code}
                      onChange={(e) => setNewCollege({ ...newCollege, code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={newCollege.address}
                      onChange={(e) => setNewCollege({ ...newCollege, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Dean Name"
                      value={newCollege.dean}
                      onChange={(e) => setNewCollege({ ...newCollege, dean: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Established Year"
                      value={newCollege.establishedYear}
                      onChange={(e) => setNewCollege({ ...newCollege, establishedYear: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleAddCollege}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add College
                    </button>
                    <button
                      onClick={() => setShowAddCollege(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Academic Programs</h2>
              <button
                onClick={() => setShowAddProgram(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Program
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Degree</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {programs.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{program.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{program.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{program.degree}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{program.duration}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {colleges.find(c => c.id === program.collegeId)?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showAddProgram && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Add New Program</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Program Name"
                      value={newProgram.name}
                      onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Program Code"
                      value={newProgram.code}
                      onChange={(e) => setNewProgram({ ...newProgram, code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Degree (e.g., B.Tech, MBA)"
                      value={newProgram.degree}
                      onChange={(e) => setNewProgram({ ...newProgram, degree: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 4 years)"
                      value={newProgram.duration}
                      onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newProgram.collegeId}
                      onChange={(e) => setNewProgram({ ...newProgram, collegeId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select College</option>
                      {colleges.map((college) => (
                        <option key={college._id || college.id} value={college._id || college.id}>{college.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleAddProgram}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add Program
                    </button>
                    <button
                      onClick={() => setShowAddProgram(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Distribution</h3>
                <div className="space-y-3">
                  {colleges.map((college) => {
                    const percentage = (college.totalStudents / totalStudents) * 100;
                    return (
                      <div key={college.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{college.name}</span>
                          <span className="text-gray-900 font-medium">{college.totalStudents} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Distribution</h3>
                <div className="space-y-3">
                  {colleges.map((college) => {
                    const percentage = (college.totalFaculty / totalFaculty) * 100;
                    return (
                      <div key={college.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{college.name}</span>
                          <span className="text-gray-900 font-medium">{college.totalFaculty} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student-Faculty Ratio</h3>
                <div className="space-y-4">
                  {colleges.map((college) => {
                    const ratio = (college.totalStudents || 0 / college.totalFaculty || 0).toFixed(1);
                    return (
                      <div key={college._id || college.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{college.name}</span>
                        <span className="text-2xl font-bold text-blue-600">{ratio}:1</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Programs by College</h3>
                <div className="space-y-4">
                  {colleges.map((college) => {
                    const collegePrograms = programs.filter(p => p.collegeId === (college._id || college.id));
                    return (
                      <div key={college._id || college.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{college.name}</span>
                        <span className="text-2xl font-bold text-green-600">{collegePrograms.length}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collegeAdmins' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">College Admin Management</h2>
              <button
                onClick={() => setShowAddCollegeAdmin(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add College Admin
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collegeAdmins.map((admin) => (
                <div key={admin._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">{admin.name}</h3>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                  <p className="text-sm text-gray-600">College: {colleges.find((c) => (c._id || c.id) === String(admin.collegeId))?.name || 'N/A'}</p>
                </div>
              ))}
            </div>

            {showAddCollegeAdmin && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Add New College Admin</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newCollegeAdmin.name}
                      onChange={(e) => setNewCollegeAdmin({ ...newCollegeAdmin, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newCollegeAdmin.email}
                      onChange={(e) => setNewCollegeAdmin({ ...newCollegeAdmin, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newCollegeAdmin.collegeId}
                      onChange={(e) => setNewCollegeAdmin({ ...newCollegeAdmin, collegeId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select College</option>
                      {colleges.map((college) => (
                        <option key={college._id || college.id} value={college._id || college.id}>{college.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleAddCollegeAdmin}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowAddCollegeAdmin(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
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