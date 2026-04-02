import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft,  ShieldCheck, Stethoscope, User } from 'lucide-react';
import { useAuth } from "@/constants/AuthContext"

const roles = [
  { id: 'patient', label: 'Patient', icon: User, color: 'from-blue-600 to-cyan-500' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'from-emerald-600 to-teal-500' },
  { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'from-purple-600 to-violet-500' },
] as const;

export default function Login() {
  const navigate = useNavigate();
  const { login, signupPatient } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    age: '',
    gender: 'Male',
    address: '',
    bloodGroup: 'O+',
  });

  const submitLogin = async () => {
    setLoading(true);
    setError('');
    const result = await login({
      role,
      identifier: loginForm.identifier,
      password: loginForm.password,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Unable to sign in.');
      return;
    }
    navigate(`/${role}`);
  };

  const submitSignup = async () => {
    setLoading(true);
    setError('');
    const result = await signupPatient(signupForm);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Unable to create account.');
      return;
    }
    navigate('/patient');
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
        <button onClick={() => navigate('/')} className="self-start flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8" style={{ fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </button>
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 800 }}>
              {mode === 'login' ? 'Account Sign In' : 'Patient Sign Up'}
            </h1>
            <p className="text-gray-500">
              {mode === 'login'
                ? 'Use your stored credentials to enter the dashboard.'
                : 'Create a patient account that will be stored in the database.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex gap-2 rounded-2xl bg-gray-100 p-1">
              <button onClick={() => { setMode('login'); setError(''); }} className={`flex-1 py-3 rounded-2xl ${mode === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`} style={{ fontWeight: 700 }}>
                Sign In
              </button>
              <button onClick={() => { setMode('signup'); setRole('patient'); setError(''); }} className={`flex-1 py-3 rounded-2xl ${mode === 'signup' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`} style={{ fontWeight: 700 }}>
                Patient Sign Up
              </button>
            </div>

            {mode === 'login' ? (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setRole(item.id)}
                      className={`rounded-2xl border p-4 text-left transition ${role === item.id ? 'border-transparent shadow-lg font-bold' : 'border-gray-200 bg-gray-50 text-gray-700'}`}
                      style={role === item.id ? { backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` } : undefined}
                    >
                      <div className={`w-10 h-10 rounded-xl ${role === item.id ? 'bg-white/20' : 'bg-white'} flex items-center justify-center mb-3 bg-linear-to-br ${item.color}`}>
                        <item.icon size={18} className={role === item.id ? 'text-white' : 'text-white'} />
                      </div>
                      <p>{item.label}</p>
                    </button>
                  ))}
                </div>

                <input
                  value={loginForm.identifier}
                  onChange={(event) => setLoginForm((current) => ({ ...current, identifier: event.target.value }))}
                  placeholder="Email or username"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400"
                />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400"
                />
                <button
                  onClick={() => void submitLogin()}
                  disabled={loading}
                  className="w-full px-5 py-3 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 text-white"
                  style={{ fontWeight: 700 }}
                >
                  {loading ? 'Signing In...' : `Sign In As ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                </button>
                <div className="rounded-2xl bg-gray-50 p-4 text-gray-500" style={{ fontSize: '0.82rem' }}>
                  Demo credentials:
                  <div className="mt-2">Patient: `alex@norvicdemo.com` / `Patient@123`</div>
                  <div>Doctor: `james@norvicdemo.com` / `Doctor@123`</div>
                  <div>Admin: `admin@norvicdemo.com` / `Admin@123`</div>
                </div>
              </>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={signupForm.name} onChange={(event) => setSignupForm((current) => ({ ...current, name: event.target.value }))} placeholder="Full name" className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400" />
                  <input value={signupForm.username} onChange={(event) => setSignupForm((current) => ({ ...current, username: event.target.value }))} placeholder="Username" className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400" />
                  <input value={signupForm.email} onChange={(event) => setSignupForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400" />
                  <input value={signupForm.phone} onChange={(event) => setSignupForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400" />
                  <input type="password" value={signupForm.password} onChange={(event) => setSignupForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400" />
                  <input value={signupForm.age} onChange={(event) => setSignupForm((current) => ({ ...current, age: event.target.value }))} placeholder="Age" className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400" />
                  <select value={signupForm.gender} onChange={(event) => setSignupForm((current) => ({ ...current, gender: event.target.value }))} className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <select value={signupForm.bloodGroup} onChange={(event) => setSignupForm((current) => ({ ...current, bloodGroup: event.target.value }))} className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                      <option key={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <textarea value={signupForm.address} onChange={(event) => setSignupForm((current) => ({ ...current, address: event.target.value }))} placeholder="Address" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none resize-none focus:border-blue-400" />
                <button
                  onClick={() => void submitSignup()}
                  disabled={loading}
                  className="w-full px-5 py-3 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 text-white"
                  style={{ fontWeight: 700 }}
                >
                  {loading ? 'Creating Account...' : 'Create Patient Account'}
                </button>
              </>
            )}

            {error ? <div className="rounded-2xl bg-red-50 text-red-700 px-4 py-3" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{error}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
