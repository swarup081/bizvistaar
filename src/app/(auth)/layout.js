'use client';

import Link from 'next/link';
import { Folder, Mail, Globe } from 'lucide-react';
import Logo from '@/lib/logo/logoOfBizVistar';

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* Left Side - Branding and Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#EAEBF0] flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Placeholder Graphic - mimicking the cloud/files illustration */}
        <div className="relative z-10 mb-12">
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Abstract Cloud Shape */}
                <div className="absolute inset-0 bg-white rounded-full opacity-60 blur-3xl transform scale-150"></div>

                {/* Floating Icons to mimic the illustration */}
                <div className="relative z-20 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl shadow-sm rotate-[-6deg] flex items-center justify-center">
                        <Mail className="w-8 h-8 text-orange-400" />
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow-sm rotate-[12deg] translate-y-4 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="col-span-2 flex justify-center mt-2">
                        <div className="p-6 bg-[#FFDCA8] rounded-2xl shadow-md rotate-[-3deg] border-2 border-gray-800 flex items-center justify-center">
                            <Folder className="w-12 h-12 text-gray-800" />
                        </div>
                    </div>
                </div>

                {/* Background decorative elements */}
                 <div className="absolute top-0 right-0 w-8 h-8 bg-purple-200 rounded-full opacity-50 animate-pulse"></div>
                 <div className="absolute bottom-10 left-10 w-4 h-4 bg-blue-200 rounded-full opacity-50"></div>
            </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">
                Products are trusted around the World
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
                With great care, our products are loved all over the world
            </p>

             {/* Pagination dots */}
             <div className="flex gap-2 mt-10">
                <div className="w-2 h-2 rounded-full bg-gray-800"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
             </div>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 lg:px-24 overflow-y-auto bg-white">
        <div className="w-full max-w-md mx-auto">
             {/* Mobile Logo */}
             <div className="mb-10 lg:hidden flex justify-center">
                 <Link href="/">
                    <Logo className="text-3xl" />
                 </Link>
             </div>
          {children}
        </div>
      </div>
    </div>
  );
}
