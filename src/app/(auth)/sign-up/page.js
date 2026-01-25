'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';

function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');
  const signInUrl = redirect ? `/sign-in?redirect=${encodeURIComponent(redirect)}` : '/sign-in';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agreedToTerms) {
        setErrorMessage("You must agree to the Terms and Conditions to create an account.");
        return;
    }

    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else if (data.user) {
      // Create profile record
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
      });

      if (profileError) {
          console.error("Profile creation failed:", profileError);
          // We don't block the user, but we log it.
      }

      // Check for redirect URL
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
        router.push(redirectUrl);
      } else {
        router.push('/get-started');
      }
    } else {
       // Edge case if sign up requires email verification before data.user is useful (depends on Supabase config)
       // Usually data.user is returned even if email confirmation is sent.
       setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Getting Started
          </h2>
          <p className="text-gray-500">
             Already have an account? <Link href={signInUrl} className="text-purple-600 font-semibold hover:text-purple-500 underline decoration-purple-600/30 underline-offset-4">Sign in</Link>
          </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Full Name */}
        <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                Full Name
            </label>
            <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
                required
            />
        </div>

        {/* Email */}
        <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email
            </label>
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
        
        {/* Password */}
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                 <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                </label>
                <span className="text-sm text-gray-400">At least 8 characters</span>
            </div>
            <div className="relative">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
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

        {/* Terms Checkbox */}
        <div className="pt-2">
            <label className="flex items-center space-x-3 cursor-pointer group select-none">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all hover:border-purple-500 checked:bg-purple-600 checked:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                    <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                </div>
                <span className="text-sm text-gray-700">
                    You agree to our <Link href="/terms" className="text-purple-600 hover:underline">Term and Conditions</Link>
                </span>
            </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? (
             <>
               <Loader2 className="w-5 h-5 animate-spin" />
               Creating Account...
             </>
          ) : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>}>
      <SignUpForm />
    </Suspense>
  );
}
