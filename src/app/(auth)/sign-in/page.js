'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Default hidden (mask on)
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');
  const signUpUrl = redirect ? `/sign-up?redirect=${encodeURIComponent(redirect)}` : '/sign-up';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      // Check for redirect URL
      const redirectUrl = searchParams.get('redirect');

      // Validate redirect URL to prevent open redirect vulnerabilities
      if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
        router.push(redirectUrl);
      } else {
        router.push('/templates');
      }
      // Keep loading state true while redirecting
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-500">
             Already have an account? <Link href={signUpUrl} className="text-purple-600 font-semibold hover:text-purple-500 underline decoration-purple-600/30 underline-offset-4">Sign up</Link>
          </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email
            </label>
            <div className="relative">
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
                    required
                />
            </div>
        </div>
        
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                 <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                </label>
                <Link href="/forgot-password">
                    <span className="text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
                        Forgot Password?
                    </span>
                </Link>
            </div>
            <div className="relative">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400 pr-10"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? (
             <>
               <Loader2 className="w-5 h-5 animate-spin" />
               Signing In...
             </>
          ) : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>}>
      <SignInForm />
    </Suspense>
  );
}
