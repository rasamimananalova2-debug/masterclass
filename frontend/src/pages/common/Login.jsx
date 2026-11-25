import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap, BookOpen, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@lms.local');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.userMessage || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__shell">
        <aside className="login-page__visual" aria-hidden="true">
          <div className="login-page__visual-inner">
            <div>
              <div className="login-page__brand">
                <div className="login-page__brand-mark">
                  <GraduationCap size={22} />
                </div>
                <div className="login-page__brand-text">
                  <strong>MonCampus</strong>
                  <span>Plateforme de gestion pédagogique</span>
                </div>
              </div>

              <h2>Gérez votre établissement, simplement.</h2>
              <p className="login-page__visual-lead">
                Un espace unique pour suivre les cours, les notes, les emplois du temps
                et la communication avec toute la communauté éducative.
              </p>

              <ul className="login-page__features">
                <li>
                  <span className="login-page__feature-icon">
                    <BookOpen size={16} />
                  </span>
                  Suivi pédagogique en temps réel
                </li>
                <li>
                  <span className="login-page__feature-icon">
                    <Calendar size={16} />
                  </span>
                  Emplois du temps et présences
                </li>
                <li>
                  <span className="login-page__feature-icon">
                    <Shield size={16} />
                  </span>
                  Données sécurisées et protégées
                </li>
              </ul>
            </div>
            <p className="login-page__visual-footer">© 2026 MonCampus. Tous droits réservés.</p>
          </div>
        </aside>

        <div className="login-page__panel">
          <div className="login-page__card-wrap">
            <div className="login-page__mobile-brand">
              <div className="login-page__logo">
                <GraduationCap size={32} />
              </div>
              <h1>MonCampus</h1>
              <p>Plateforme de gestion pédagogique</p>
            </div>

            <div className="login-page__card">
              <h2>Connexion</h2>
              <p className="login-page__card-lead">
                Bienvenue ! Connectez-vous pour accéder à votre espace.
              </p>

              {error && (
                <div className="mb-4">
                  <Alert type="error" message={error} onClose={() => setError('')} />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  required
                />

                <Input
                  label="Mot de passe"
                  type="password"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <Button type="submit" loading={loading} className="w-full" size="lg">
                  Se connecter
                </Button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
