import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/services/auth'; // adjust path rakeshgit

const LoginForm = ({ role }: { role: string }) => {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });

  // your submitLogin here...
};

{/* ===== : Patient Login Form (Right Side) ===== */}

{/* State (ensure these exist at top of component) */}
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [loginForm, setLoginForm] = useState({
  identifier: '',
  password: '',
});

/* Function (ensure this exists inside component) */
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

/* ===== UI BLOCK ===== */
<div className="space-y-4">

  <input
    value={loginForm.identifier}
    onChange={(event) =>
      setLoginForm((current) => ({
        ...current,
        identifier: event.target.value,
      }))
    }
    placeholder="Email or username"
    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400"
  />

  <input
    type="password"
    value={loginForm.password}
    onChange={(event) =>
      setLoginForm((current) => ({
        ...current,
        password: event.target.value,
      }))
    }
    placeholder="Password"
    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-400"
  />

  <button
    onClick={() => void submitLogin()}
    disabled={loading}
    className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
    style={{ fontWeight: 700 }}
  >
    {loading
      ? 'Signing In...'
      : `Sign In As ${role.charAt(0).toUpperCase() + role.slice(1)}`}
  </button>

  <div
    className="rounded-2xl bg-gray-50 p-4 text-gray-500"
    style={{ fontSize: '0.82rem' }}
  >
    Demo credentials:
    <div className="mt-2">
      Patient: alex@norvicdemo.com / Patient@123
    </div>
    <div>
      Doctor: james@norvicdemo.com / Doctor@123
    </div>
    <div>
      Admin: admin@norvicdemo.com / Admin@123
    </div>
  </div>

  {error ? (
    <div
      className="rounded-2xl bg-red-50 text-red-700 px-4 py-3"
      style={{ fontSize: '0.85rem', fontWeight: 600 }}
    >
      {error}
    </div>
  ) : null}

</div>
