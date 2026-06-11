import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { loginUser } from '../../../services/authService';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    remember: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData.identifier, formData.password);

      login(response.data.token, response.data.user);

      if (response.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.data.user.role === 'SELLER') {
        navigate('/seller/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Email ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Marketing/Illustration */}
      <section className="hidden md:flex md:w-1/2 lg:w-[60%] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="Empreendedora moçambicana"
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=900&fit=crop"
          />
          <div className="absolute inset-0 login-gradient mix-blend-multiply opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-on-primary h-full">
          {/* Brand Anchor */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛍️</span>
            <span className="font-headline-md text-headline-md font-extrabold tracking-tighter text-white">
              Kuvia
            </span>
          </div>
          
          <div className="max-w-xl">
            <h1 className="font-headline-xl text-headline-xl mb-6 text-white leading-tight">
              Transforme o seu negócio local numa marca global.
            </h1>
            <p className="font-body-lg text-body-lg text-white/90">
              Junte-se a milhares de empreendedores moçambicanos que estão a digitalizar o seu sucesso com a plataforma mais intuitiva do mercado.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-white/80">
            <div className="flex -space-x-3">
              <img 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-primary-container object-cover"
                src="https://i.pravatar.cc/100?img=1"
              />
              <img 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-primary-container object-cover"
                src="https://i.pravatar.cc/100?img=2"
              />
              <img 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-primary-container object-cover"
                src="https://i.pravatar.cc/100?img=3"
              />
            </div>
            <span className="font-label-sm text-label-sm">+500 lojistas activos em Maputo</span>
          </div>
        </div>
      </section>
      
      {/* Right Side: Login Form */}
      <section className="w-full md:w-1/2 lg:w-[40%] flex flex-col justify-center bg-background-surface px-margin-page py-12">
        <div className="max-w-[440px] mx-auto w-full">
          {/* Mobile Header */}
          <div className="md:hidden mb-8 text-center">
            <h2 className="font-headline-md text-headline-md font-bold text-primary mb-2 flex items-center justify-center gap-2">
              <span className="text-2xl">🛍️</span> Kuvia
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Gestão de loja moderna e simplificada.
            </p>
          </div>
          
          <div className="mb-10">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              Bem-vindo de volta
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Inicie sessão para gerir a sua loja hoje.
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-error font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email/Phone Field */}
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="identity">
                Email ou Telefone
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  person
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md text-body-md"
                  id="identity"
                  name="identifier"
                  placeholder="exemplo@kuvia.co.mz"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="password">
                  Palavra-passe
                </label>
                <Link to="/forgot-password" className="font-label-sm text-label-sm text-primary hover:underline transition-all">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input 
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md text-body-md"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input 
                className="w-5 h-5 rounded border-border-light text-primary focus:ring-primary transition-all"
                id="remember"
                name="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label 
                className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer"
                htmlFor="remember"
              >
                Lembrar de mim neste dispositivo
              </label>
            </div>
            
            {/* Primary Action */}
            <button 
              className="w-full bg-primary hover:bg-primary-container text-on-primary py-4 rounded-xl font-label-md text-label-md shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  A entrar...
                </span>
              ) : 'Entrar'}
            </button>
          </form>
          
          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-border-light"></div>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Ou continuar com
            </span>
            <div className="h-[1px] flex-1 bg-border-light"></div>
          </div>
          
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              type="button"
              className="flex items-center justify-center gap-3 py-3 px-4 border border-border-light rounded-xl font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-all active:bg-surface-container"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button 
              type="button"
              className="flex items-center justify-center gap-3 py-3 px-4 border border-border-light rounded-xl font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-all active:bg-surface-container"
            >
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
          
          {/* Footer Link */}
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Criar Loja Grátis
            </Link>
          </p>
        </div>
        
        {/* Page Footer */}
        <footer className="mt-12 text-center">
          <p className="font-label-sm text-label-sm text-outline">
            © 2024 Kuvia Moçambique. Construindo o futuro do comércio local.
          </p>
        </footer>
      </section>
    </main>
  );
}