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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
      
      {/* Floating animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating icons */}
      <Sparkles className="absolute top-20 left-20 text-white/20 w-8 h-8 animate-float" />
      <Zap className="absolute top-40 right-32 text-white/20 w-6 h-6 animate-float animation-delay-2000" />
      <Shield className="absolute bottom-32 left-32 text-white/20 w-10 h-10 animate-float animation-delay-4000" />

      <Card className="w-full max-w-md relative z-10 backdrop-blur-lg bg-white/95 shadow-2xl border-0 animate-slide-up">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-4">
                <Layers className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <p className="text-center text-gray-500 text-sm">Sign in to continue to Layers</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  disabled={loading}
                  className="pl-10 h-12 border-gray-200 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 h-12 border-gray-200 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            {error && (
              <div className="animate-shake">
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Account</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold">Email:</span> admin@test.com<br/>
              <span className="font-semibold">Password:</span> password123
            </p>
          </form>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-2px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(2px);
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}