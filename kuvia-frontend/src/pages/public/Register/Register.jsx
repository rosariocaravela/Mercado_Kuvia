import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { registerClient, registerSeller } from '../../../services/authService';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [step, setStep] = useState(1); // 1: tipo, 2: dados, 3: loja (se seller)
  const [accountType, setAccountType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Campos específicos para vendedor
    storeName: '',
    storeCategory: '',
    storeDescription: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!accountType) {
      setError('Por favor, selecione o tipo de conta.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return false;
    }

    // Validar telefone de Moçambique
    const phoneRegex = /^(\+258)?[8][4-7]\d{7}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Número de telefone inválido. Use o formato: +258 84 123 4567');
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (accountType === 'seller') {
      if (!formData.storeName || !formData.storeCategory) {
        setError('Por favor, preencha os dados da loja.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      if (accountType === 'seller') {
        setStep(3);
      } else {
        handleSubmit();
      }
    } else if (step === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        ...(accountType === 'seller' ? {
          businessName: formData.storeName,
          businessType: formData.storeCategory,
          businessDescription: formData.storeDescription,
        } : {}),
      };

      const response = accountType === 'seller'
        ? await registerSeller(payload)
        : await registerClient(payload);

      console.log(JSON.stringify(response, null, 2));
      console.log("TOKEN:", response.data.token);
      console.log("USER:", response.data.user);

      login(response.data.token, response.data.user);

      if (accountType === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: 'Eletrónicos', value: 'ELETRONICOS' },
    { label: 'Moda e Vestuário', value: 'MODA' },
    { label: 'Beleza e Cosméticos', value: 'BELEZA' },
    { label: 'Alimentação', value: 'ALIMENTACAO' },
    { label: 'Agricultura', value: 'AGRICULTURA' },
    { label: 'Móveis e Decoração', value: 'MOVEIS' },
    { label: 'Serviços', value: 'SERVICOS' },
    { label: 'Outros', value: 'OUTROS' }
  ];

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Marketing */}
      <section className="hidden md:flex md:w-1/2 lg:w-[60%] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            alt="Empreendedor moçambicano"
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=900&fit=crop"
          />
          <div className="register-gradient absolute inset-0 mix-blend-multiply opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-on-primary h-full">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛍️</span>
            <span className="font-headline-md text-headline-md font-extrabold tracking-tighter text-white">
              Kuvia
            </span>
          </div>

          <div className="max-w-xl">
            <h1 className="font-headline-xl text-headline-xl mb-6 text-white leading-tight">
              Comece a vender online em minutos.
            </h1>
            <p className="font-body-lg text-body-lg text-white/90">
              Crie a sua loja personalizada, partilhe no WhatsApp e comece a receber pedidos hoje mesmo. Sem complicações.
            </p>
          </div>

          <div className="space-y-4">
            {['Criação rápida', 'Sem custos iniciais', 'Suporte local'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">check</span>
                </div>
                <span className="font-body-md">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Right Side: Register Form */}
      <section className="w-full md:w-1/2 lg:w-[40%] flex flex-col justify-center bg-background-surface px-margin-page py-12 overflow-y-auto">
        <div className="max-w-[440px] mx-auto w-full">
          {/* Mobile Header */}
          <div className="md:hidden mb-8 text-center">
            <h2 className="font-headline-md text-headline-md font-bold text-primary mb-2 flex items-center justify-center gap-2">
              <span className="text-2xl">🛍️</span> Kuvia
            </h2>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-sm text-label-sm text-outline">
                Passo {step} de {accountType === 'seller' ? 3 : 2}
              </span>
              <span className="font-label-sm text-label-sm text-primary">
                {Math.round((step / (accountType === 'seller' ? 3 : 2)) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(step / (accountType === 'seller' ? 3 : 2)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              {step === 1 && 'Que tipo de conta pretende?'}
              {step === 2 && 'Os seus dados'}
              {step === 3 && 'Sobre a sua loja'}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {step === 1 && 'Escolha como vai usar a Kuvia.'}
              {step === 2 && 'Preencha as suas informações pessoais.'}
              {step === 3 && 'Conte-nos mais sobre o seu negócio.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-error font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {/* Step 1: Account Type */}
          {step === 1 && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => { setAccountType('client'); setError(''); }}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${accountType === 'client'
                  ? 'border-primary bg-primary/5'
                  : 'border-border-light hover:border-primary/50'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accountType === 'client' ? 'bg-primary text-white' : 'bg-surface-container-low text-primary'
                    }`}>
                    <span className="material-symbols-outlined">shopping_bag</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-headline-md text-lg text-on-surface mb-1">Sou Cliente</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Quero descobrir lojas e comprar produtos locais.
                    </p>
                  </div>
                  {accountType === 'client' && (
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setAccountType('seller'); setError(''); }}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${accountType === 'seller'
                  ? 'border-primary bg-primary/5'
                  : 'border-border-light hover:border-primary/50'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accountType === 'seller' ? 'bg-primary text-white' : 'bg-surface-container-low text-primary'
                    }`}>
                    <span className="material-symbols-outlined">storefront</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-headline-md text-lg text-on-surface mb-1">Sou Vendedor</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Quero criar a minha loja online e vender produtos.
                    </p>
                  </div>
                  {accountType === 'seller' && (
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Personal Data */}
          {step === 2 && (
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="name">
                  Nome Completo *
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md"
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="email">
                  Email *
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md"
                    id="email"
                    name="email"
                    placeholder="seu@email.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="phone">
                  Telefone *
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    phone
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md"
                    id="phone"
                    name="phone"
                    placeholder="+258 84 123 4567"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="password">
                  Palavra-passe *
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md"
                    id="password"
                    name="password"
                    placeholder="Mínimo 6 caracteres"
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

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="confirmPassword">
                  Confirmar Palavra-passe *
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    lock_reset
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Repita a senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </form>
          )}

          {/* Step 3: Store Data (only for sellers) */}
          {step === 3 && accountType === 'seller' && (
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="storeName">
                  Nome da Loja *
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    storefront
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md"
                    id="storeName"
                    name="storeName"
                    placeholder="Ex: Loja do António"
                    type="text"
                    value={formData.storeName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="storeCategory">
                  Categoria *
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                    category
                  </span>
                  <select
                    id="storeCategory"
                    name="storeCategory"
                    value={formData.storeCategory}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md appearance-none"
                  >
                    <option value="">Selecione uma categoria</option>

                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="storeDescription">
                  Descrição da Loja
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body-md resize-none"
                  id="storeDescription"
                  name="storeDescription"
                  placeholder="Descreva brevemente o seu negócio..."
                  rows="4"
                  value={formData.storeDescription}
                  onChange={handleChange}
                ></textarea>
              </div>
            </form>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-xl font-label-md hover:bg-surface-container-high transition-all"
              >
                Voltar
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-container text-on-primary py-4 rounded-xl font-label-md shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  A processar...
                </span>
              ) : step === 1 ? 'Continuar' :
                step === 2 && accountType === 'seller' ? 'Continuar' :
                  'Criar Conta'}
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center mt-6 font-body-sm text-body-sm text-on-surface-variant">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Entrar
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