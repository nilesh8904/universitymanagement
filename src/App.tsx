import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import UniversityAdminDashboard from './components/UniversityAdminDashboard';
import CollegeAdminDashboard from './components/CollegeAdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import { authService } from './services/authService';

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');

  const handleChangePassword = async () => {
    setChangePasswordError('');

    if (!oldPassword || !newPassword) {
      setChangePasswordError('Please provide both old and new passwords.');
      return;
    }

    // Validate new password policy
    const passwordPolicy = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordPolicy.test(newPassword)) {
      setChangePasswordError('New password must be at least 8 characters, include uppercase, lowercase, number, and special character (!@#$%^&*)');
      return;
    }

    if (oldPassword === newPassword) {
      setChangePasswordError('New password must be different from old password');
      return;
    }

    try {
      await authService.changePassword(oldPassword, newPassword);
      alert('Password changed successfully. Please log in again.');
      setOldPassword('');
      setNewPassword('');
      setShowChangePassword(false);
      logout();
    } catch (error: any) {
      setChangePasswordError(error?.message || 'Unable to change password');
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">University Portal</h1>
                <p className="text-xs text-gray-600">{user?.name} ({user?.role.replace('_', ' ')})</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Change Password
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Old Password</label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Password must: be 8+ chars, include uppercase, lowercase, number, and special character (!@#$%^&*)
                </p>
              </div>
              {changePasswordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {changePasswordError}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setOldPassword('');
                  setNewPassword('');
                  setChangePasswordError('');
                }}
                className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'university_admin' && <UniversityAdminDashboard />}
      {user?.role === 'college_admin' && <CollegeAdminDashboard />}
      {user?.role === 'student' && <StudentDashboard />}
    </div>
  </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
