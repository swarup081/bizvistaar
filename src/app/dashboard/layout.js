"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid, 
  Globe, 
  Package, 
  AppWindow, 
  Users, 
  PieChart, 
  Bell, 
  MessageCircle, 
  User,
  Tag,
  LogOut,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
    { name: 'Website', icon: Globe, href: '/dashboard/website' },
    { name: 'Orders', icon: Package, href: '/dashboard/orders' },
    { name: 'Products', icon: Tag, href: '/dashboard/products' },
    { name: 'Apps', icon: AppWindow, href: '/dashboard/apps' },
    { name: 'Analytics', icon: PieChart, href: '/dashboard/analytics' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserEmail(user.email);
        }
    };

    window.addEventListener('scroll', handleScroll);
    fetchUser();

    // Click outside listener
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
  };

  return (
    <div className="min-h-screen p-7 bg-[#F3F4F6] font-sans text-[#333333]">
      {/* Header */}
      <header 
        className={`sticky top-0 z-50 bg-white flex items-center justify-between transition-all duration-300 ease-in-out
          ${isScrolled 
            ? 'rounded-none shadow-md w-[calc(100%+3.5rem)] -mx-7 px-10 py-4'
            : 'rounded-full shadow-sm px-6 py-4'
          }`}
      >
        {/* Left: Logo */}
        <span className="text-3xl font-bold text-gray-900 not-italic tracking-tight">
          BizVistaar
        </span>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium
                  ${isActive 
                    ? 'bg-[#8A63D2] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: User Controls */}
        <div className="flex items-center gap-4">
         
          <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-all bg-white"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#8A63D2] to-blue-400 flex items-center justify-center text-white shadow-sm">
                   <User size={16} />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">
                        {userEmail || 'Account'}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                </div>
              </button>

              {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                      <div className="px-3 py-2 border-b border-gray-50 mb-1">
                          <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                          <p className="text-sm font-bold text-gray-800 truncate">{userEmail}</p>
                      </div>

                      {/* Placeholder Links */}
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                          <User size={16} /> Profile
                      </button>

                      <div className="h-px bg-gray-50 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                          <LogOut size={16} /> Sign out
                      </button>
                  </div>
              )}
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className={`mt-5 rounded-[2rem] bg-[#fff] font-sans text-[#333333] ${
        pathname === '/dashboard/website' ? 'p-0 overflow-hidden h-[calc(100vh-140px)]' : 'p-10 min-h-[500px]'
      }`}>
        {children}
      </main>
    </div>
  );
}
