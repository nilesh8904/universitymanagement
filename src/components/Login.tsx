import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('🔐 Login: Form submitted with email:', email, 'password length:', password.length);
    
    try {
      const success = await login(email, password);
      console.log('🔐 Login: Login result:', success);
      
      if (!success) {
        setError('Invalid credentials. Please check your email and password.');
      }
      // On success, the auth state will update and App.tsx will re-render to show dashboard
    } catch (err) {
      console.log('🔐 Login: Exception caught:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">University Portal</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
            <p className="text-xs text-gray-500 mt-1">Your role will be determined by your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Roles:</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">University Admin</p>
                  <p className="text-xs text-gray-600">Manage all colleges and system settings</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100">
                    <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">College Admin</p>
                  <p className="text-xs text-gray-600">Manage courses, faculty, and students</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100">
                    <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.5 1.5H5.75A2.75 2.75 0 003 4.25v11.5A2.75 2.75 0 005.75 18.5h8.5a2.75 2.75 0 002.75-2.75V6.5m-11-4v3m6-3v3m-6 2h12M5 14h10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Student</p>
                  <p className="text-xs text-gray-600">View courses, attendance, and results</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-900">
                <span className="font-semibold">Note:</span> Your role is determined by your account in the system. Enter your email and password to login with your assigned role.
              </p>
              <p className="text-xs text-blue-900 mt-1">
                Default password for seeded users is <span className="font-bold">password123</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}