import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Loader2, Shield, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const validateForm = (isSignUp: boolean) => {
    const newErrors: { email?: string; password?: string; fullName?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    if (isSignUp && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;
    
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password. Please try again.'
          : error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    
    setIsLoading(true);
    const { error } = await signUp(email, password, fullName);
    setIsLoading(false);
    
    if (error) {
      let errorMessage = error.message;
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      }
      toast({
        title: 'Sign up failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account created',
        description: 'Welcome to AITAS. Redirecting to your portal...',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex pt-20">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-5" />
          <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold tracking-tight">AITAS</span>
                <span className="text-[9px] text-primary-foreground/60 tracking-widest uppercase leading-tight">International Alliance for<br />Trade and Allied Services</span>
              </div>
            </div>
            
            <div className="max-w-md">
              <h1 className="text-3xl font-semibold mb-4 leading-tight">
                International Alliance for Trade and Allied Services
              </h1>
              <p className="text-base text-primary-foreground/80 leading-relaxed">
                Empowering exporters, importers, and enterprises with technology-driven trade facilitation, healthcare coordination, and global connectivity services.
              </p>
              
              <div className="mt-10 space-y-3">
                <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span>Government-backed trade infrastructure</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span>Serving 50+ countries worldwide</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-primary-foreground/50">
              © 2026 AITAS – International Alliance for Trade and Allied Services. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[400px]">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold tracking-tight">AITAS</span>
                <span className="text-[8px] text-muted-foreground tracking-widest uppercase leading-tight">Trade & Allied Services</span>
              </div>
            </div>

            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Welcome back</CardTitle>
                <CardDescription className="text-sm">
                  Sign in to access your AITAS trade facilitation portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin" className="text-sm font-medium">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="text-sm font-medium">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="you@organization.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={errors.password ? 'border-destructive' : ''}
                        />
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Sign In <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={errors.fullName ? 'border-destructive' : ''}
                        />
                        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@organization.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={errors.password ? 'border-destructive' : ''}
                        />
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By continuing, you agree to AITAS's Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
