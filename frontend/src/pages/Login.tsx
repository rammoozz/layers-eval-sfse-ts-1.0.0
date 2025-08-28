import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Mail, Lock, Sparkles, Zap, Shield, Layers, ArrowRight, Github, Twitter } from 'lucide-react';
import gsap from 'gsap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background gradient animation
      gsap.to(bgRef.current, {
        backgroundPosition: '100% 50%',
        duration: 8,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Card entrance animation
      gsap.fromTo(cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        }
      );

      // Floating shapes animation
      floatingRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.to(ref, {
            x: 'random(-50, 50)',
            y: 'random(-50, 50)',
            rotation: 'random(-30, 30)',
            duration: 'random(6, 10)',
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: index * 0.5,
          });
        }
      });

      // Floating icons animation
      iconRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.to(ref, {
            y: 'random(-30, -10)',
            rotation: 'random(-15, 15)',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: index * 0.3,
          });
        }
      });

      // Logo pulse animation
      gsap.to('.logo-glow', {
        opacity: 0.8,
        scale: 1.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Shake animation on submit
    gsap.to(cardRef.current, {
      x: [0, -5, 5, -3, 3, 0],
      duration: 0.3,
      ease: 'power2.inOut',
    });
    
    try {
      await login(email, password);
      // Success animation before navigation
      await gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        duration: 0.5,
        ease: 'power2.in',
      });
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
      // Error shake animation
      gsap.to(cardRef.current, {
        x: [0, -10, 10, -5, 5, 0],
        duration: 0.5,
        ease: 'power2.inOut',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = (inputName: string) => {
    gsap.to(`.${inputName}-icon`, {
      scale: 1.2,
      rotation: 360,
      duration: 0.5,
      ease: 'back.out(1.7)',
    });
  };

  const handleInputBlur = (inputName: string) => {
    gsap.to(`.${inputName}-icon`, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
        style={{ backgroundSize: '200% 200%' }}
      />
      
      {/* Floating animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          ref={el => floatingRefs.current[0] = el}
          className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
        <div 
          ref={el => floatingRefs.current[1] = el}
          className="absolute -top-10 -right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
        <div 
          ref={el => floatingRefs.current[2] = el}
          className="absolute -bottom-10 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
      </div>

      {/* Floating icons */}
      <Sparkles 
        ref={el => iconRefs.current[0] = el}
        className="absolute top-20 left-20 text-white/30 w-8 h-8"
      />
      <Zap 
        ref={el => iconRefs.current[1] = el}
        className="absolute top-40 right-32 text-white/30 w-6 h-6"
      />
      <Shield 
        ref={el => iconRefs.current[2] = el}
        className="absolute bottom-32 left-32 text-white/30 w-10 h-10"
      />

      <Card ref={cardRef} className="w-full max-w-md relative z-10 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="logo-glow absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-4">
                <Layers className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">Sign in to continue to Layers</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="relative group">
                <Mail className="email-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleInputFocus('email')}
                  onBlur={() => handleInputBlur('email')}
                  required
                  autoFocus
                  disabled={loading}
                  className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative group">
                <Lock className="password-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 pointer-events-none" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleInputFocus('password')}
                  onBlur={() => handleInputBlur('password')}
                  required
                  disabled={loading}
                  className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            {error && (
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  {error}
                </p>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}