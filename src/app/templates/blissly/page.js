// src/app/templates/brewhaven/page.js

'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // <-- ADD THIS IMPORT
import { businessData as initialBusinessData } from './data.js';

// --- Reusable SVG Icons ---


const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#F5A623]">
        <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.83 4.426 4.894.71c.848.124 1.186 1.158.57 1.753l-3.54 3.45.836 4.874c.144.843-.735 1.49-1.493 1.099L10 16.54l-4.389 2.296c-.758.39-1.637-.256-1.493-1.099l.836-4.874-3.54-3.45c-.616-.595-.278-1.629.57-1.753l4.894-.71L9.132 2.884Z" clipRule="evenodd" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.211-1.01-.56-1.368l-1.928-1.928a2.25 2.25 0 0 0-3.182 0l-1.17 1.17-1.414-1.414 1.17-1.17a2.25 2.25 0 0 0 0-3.182L9.118 5.66c-.358-.358-.852-.56-1.368-.56H6.375a2.25 2.25 0 0 0-2.25 2.25Z" />
    </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

const MapPinIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-brand-text/40 hover:text-brand-text transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-brand-text/40 hover:text-brand-text transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);
// --- END: Added code for Testimonial Slider ---

// --- Reusable UI Components ---

const Header = ({ business }) => (
    <header className="bg-brand-bg sticky top-0 z-40 w-full font-sans border-b border-brand-primary/50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            {/* Left Nav */}
            <nav className="hidden md:flex items-center gap-6">
                {business.navigation.map(navItem => (
                    <a key={navItem.label} href={navItem.href} className="text-sm font-medium tracking-wide text-brand-text hover:opacity-70 transition-opacity">
                        {navItem.label}
                    </a>
                ))}
            </nav>
            
            {/* Center Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <a href="#home" className="text-3xl font-bold text-brand-text tracking-wider font-serif">
                    {business.logoText}
                </a>
            </div>
            
             {/* Right Nav & Icons */}
            <div className="flex-1 flex justify-end items-center gap-6">
                <div className="flex items-center gap-6">
                    <a href={business.headerButton.href} className="hidden lg:inline-block bg-brand-secondary text-brand-bg px-6 py-3 text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
                        {business.headerButton.text}
                    </a>
                </div>
            </div>
        </div>
    </header>
);

// --- Main Page Component ---
export default function BrewhavenPage() {
    
    const [businessData, setBusinessData] = useState(initialBusinessData); 

    // --- START: Added code for Testimonial Slider ---
const [currentTestimonial, setCurrentTestimonial] = useState(0);
const testimonials = businessData.testimonials.items;

const prevTestimonial = () => {
    setCurrentTestimonial(current => (current === 0 ? testimonials.length - 1 : current - 1));
};

const nextTestimonial = () => {
    setCurrentTestimonial(current => (current === testimonials.length - 1 ? 0 : current + 1));
};

const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
};

    
    useEffect(() => {
        // Set body font
        document.body.style.fontFamily = `'${businessData.theme.font.body}', sans-serif`;
        
        // Set heading font
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.fontFamily = `'${businessData.theme.font.heading}', serif`;
        });

        // Get store name from local storage
        const storedStoreName = localStorage.getItem('storeName');
        if (storedStoreName) {
            setBusinessData(prevData => ({
                ...prevData,
                name: storedStoreName,
                logoText: storedStoreName,
                footer: {
                    ...prevData.footer,
                    copyright: `© ${new Date().getFullYear()} ${storedStoreName}. Designed by Webestica, Powered by Webflow`
                }
            }));
        }

        // Cleanup function to reset fonts when component unmounts
        return () => {
            headings.forEach(heading => {
                heading.style.fontFamily = '';
            });
            document.body.style.fontFamily = '';
        };
    }, [businessData.theme.font.body, businessData.theme.font.heading]); // Rerun effect if fonts change

    const createFontVariable = (fontName) => {
        const formattedName = fontName.toLowerCase().replace(/ /g, '-');
        return `var(--font-${formattedName})`;
    };
    
    const fontVariables = {
        '--font-heading': createFontVariable(businessData.theme.font.heading),
        '--font-body': createFontVariable(businessData.theme.font.body),
    };

    const themeClassName = `theme-${businessData.theme.colorPalette}`;
    
    return (
        <div 
          className={`antialiased bg-brand-bg text-brand-text ${themeClassName}`}
          style={fontVariables}
        >
            <Header business={{ logoText: businessData.logoText, navigation: businessData.navigation, headerButton: businessData.headerButton }} />

            <main>
              {/* --- Hero Section --- */}
<section id="home" className="relative overflow-hidden bg-brand-primary">
  <div className="container mx-auto px-6 py-20 md:py-28 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
      <h1 className="text-4xl md:text-6xl font-bold text-brand-text leading-tight">{businessData.hero.title}</h1>
      <p className="text-base md:text-lg text-brand-text opacity-70 max-w-md">{businessData.hero.subtitle}</p>
      <a 
        href="#menu"
        className="mt-4 inline-flex items-center gap-3 bg-brand-secondary text-brand-bg px-8 py-4 text-base font-medium tracking-wide rounded-lg hover:opacity-90 transition-all"
      >
        <span>{businessData.hero.cta}</span>
      </a>
    </div>
    <div className="hidden md:flex justify-center">
      <div className="w-full max-w-sm lg:max-w-md aspect-square overflow-hidden">
        <img 
          src={businessData.hero.image} 
          alt="Hero Image" 
          className="w-full h-full object-contain object-center"
        />
      </div>
    </div>
  </div>

  {/* Wavey irregular divider */}
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
    <svg className="relative block w-[calc(100%+1.3px)] h-24 md:h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0,40 C150,90 350,0 600,60 C850,120 1050,20 1200,70 L1200,0 L0,0 Z" fill="currentColor" className="text-brand-bg"/>
    </svg>
  </div>
</section>

                {/* --- Events Section --- */}
                <section id="events" className="py-24">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-text text-center mb-16">{businessData.events.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {businessData.events.items.map((item, index) => (
                                <div key={index} className="bg-brand-primary rounded-lg overflow-hidden shadow-sm">
                                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover"/>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-brand-text mb-3">{item.title}</h3>
                                        <p className="text-brand-text opacity-70 mb-5">{item.text}</p>
                                        <a href="#" className="font-semibold text-brand-secondary hover:text-brand-text transition-colors flex items-center">
                                            Read more <ArrowRightIcon />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- About Section --- */}
                <section id="about" className="py-24 bg-brand-primary relative">
                  {/* Top wave */}
                  <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg className="relative block w-[calc(100%+1.3px)] h-24 md:h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                      <path d="M0,50 C100,90 200,10 300,50 C400,90 500,10 600,50 C700,90 800,10 900,50 C1000,90 1100,10 1200,50 L1200,0 L0,0 Z" fill="currentColor" className="text-brand-bg"/>
                    </svg>
                  </div>
                  <div className="container mx-auto py-14 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                      <div className="flex justify-center">
                           <img 
                              src={businessData.about.image} 
                              alt="Artisanal Roasting" 
                              className="w-full max-w-md lg:max-w-lg aspect-[4/5] object-cover rounded-t-full shadow-md"
                          />
                      </div>
                      <div className="md:pl-10 text-center md:text-left items-center md:items-start flex flex-col">
                          <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight">{businessData.about.title}</h2>
                          <p className="text-lg text-brand-text opacity-70 mt-6 max-w-lg">{businessData.about.text}</p>
                          <div className="mt-8 space-y-6">
                              {businessData.about.features.map((feature, index) => (
                                  <div key={index}>
                                      <h4 className="text-xl font-bold text-brand-text">{feature.title}</h4>
                                      <p className="text-brand-text opacity-70 mt-1">{feature.text}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                  {/* Bottom wave */}
                  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
                    <svg className="relative block w-[calc(100%+1.3px)] h-24 md:h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                      <path d="M0,50 C100,90 200,10 300,50 C400,90 500,10 600,50 C700,90 800,10 900,50 C1000,90 1100,10 1200,50 L1200,0 L0,0 Z" fill="currentColor" className="text-brand-bg"/>
                    </svg>
                  </div>
                </section>

                {/* --- Menu Section --- */}
                <section id="menu" className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="inline-block bg-brand-primary text-brand-secondary text-sm font-semibold px-4 py-1 rounded-full mb-4">
                                {businessData.menu.badge}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-4">{businessData.menu.title}</h2>
                            <p className="text-lg text-brand-text opacity-70">{businessData.menu.description}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
                            {businessData.menu.items.map((item, index) => (
                                <div key={index} className="py-4">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="text-2xl font-bold text-brand-text">{item.name}</h4>
                                        <span className="text-2xl font-bold text-brand-secondary">${item.price}</span>
                                    </div>
                                    <p className="text-brand-text opacity-70">{item.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <a href="#" className="font-semibold text-brand-secondary text-lg hover:text-brand-text transition-colors flex items-center justify-center">
                                {businessData.menu.cta} <ArrowRightIcon />
                            </a>
                        </div>
                    </div>
                </section>

                {/* --- Testimonials Section --- */}
              {/* --- Testimonials Section (NEW SLIDER UI) --- */}
              <section id="testimonials" className="py-24 bg-brand-bg">
                    <div className="container mx-auto px-6 relative max-w-3xl">
                        <div className="relative flex flex-col items-center">
                            
                            {/* Quote Icon - Styled to match screenshot */}
                            <span className="font-serif text-9xl text-brand-text/80 leading-none -mb-4">”</span>
                            
                            {/* Testimonial Text - Using the new handwriting font */}
                            <motion.p 
                                key={currentTestimonial}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="text-3xl md:text-4xl text-brand-text text-center mt-6 min-h-[110px] md:min-h-[120px]"
                                style={{ fontFamily: 'var(--font-handwriting)' }} // <-- Using the new font
                            >
                                {testimonials[currentTestimonial].quote}
                            </motion.p>
                            
                            {/* Yellow Line - Now uses the correct accent color */}
                            <div className="w-16 h-1 bg-brand-accent my-8"></div>

                            {/* Author - Using sans-serif font */}
                            <div className="text-center font-sans">
                                <h5 className="text-lg font-bold text-brand-text">{testimonials[currentTestimonial].name}</h5>
                                <p className="text-sm text-brand-text/70 font-medium">{testimonials[currentTestimonial].title}</p>
                            </div>

                            {/* Navigation Arrows */}
                            <button onClick={prevTestimonial} className="absolute -left-4 md:-left-24 top-1/2 -translate-y-1/2 p-2" aria-label="Previous testimonial">
                                <ChevronLeftIcon />
                            </button>
                            <button onClick={nextTestimonial} className="absolute -right-4 md:-right-24 top-1/2 -translate-y-1/2 p-2" aria-label="Next testimonial">
                                <ChevronRightIcon />
                            </button>
                        </div>

                        {/* Pagination Dots - Using accent color */}
                        <div className="flex justify-center gap-2 mt-12">
                            {testimonials.map((_, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => goToTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        currentTestimonial === index ? 'bg-brand-accent' : 'bg-brand-text/20 hover:bg-brand-text/40'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                {/* --- Specialty Section --- */}
                <section id="specialty" className="py-24">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-16">{businessData.specialty.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {businessData.specialty.items.map((item, index) => (
                                <div key={index} className="group">
                                    <div className="aspect-[4/5] bg-brand-primary rounded-lg overflow-hidden mb-4">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                                    </div>
                                    <h4 className="text-xl font-bold text-brand-text">{item.name}</h4>
                                    <p className="text-brand-secondary text-lg font-medium">${item.price} USD</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Final CTA --- */}
                <section id="cta-final" className="py-24 bg-brand-primary">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div>
                            <h2 className="text-4xl font-bold text-brand-text max-w-xl">{businessData.cta.title}</h2>
                            <p className="text-lg text-brand-text opacity-70 max-w-xl mt-4">{businessData.cta.text}</p>
                        </div>
                        <a 
                            href="#"
                            className="mt-8 md:mt-0 inline-flex flex-shrink-0 items-center gap-3 bg-brand-secondary text-brand-bg px-8 py-4 text-base font-medium tracking-wide rounded-lg hover:opacity-90 transition-all"
                        >
                            <span>{businessData.cta.cta}</span>
                        </a>
                    </div>
                </section>
            </main>

            {/* --- Footer --- */}
            <footer id="contact" className="py-20 pb-12 bg-brand-bg text-brand-text border-t border-brand-primary/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        
                        {/* Column 1: Subscribe & Contact */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">{businessData.footer.promoTitle}</h4>
                            <form className="flex mb-6">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="w-full bg-brand-primary border border-brand-secondary/30 py-3 px-4 text-brand-text placeholder:text-brand-text/50 focus:ring-0 focus:border-brand-secondary outline-none rounded-l-md"
                                />
                                <button 
                                    type="submit" 
                                    className="px-4 py-3 bg-brand-secondary text-brand-bg font-semibold text-sm rounded-r-md hover:opacity-90"
                                >
                                    <ArrowRightIcon />
                                </button>
                            </form>
                            <ul className="space-y-2 text-brand-text/80 text-sm">
                                <li className="flex items-center"><PhoneIcon /> {businessData.footer.contact.phone}</li>
                                <li className="flex items-center"><EmailIcon /> {businessData.footer.contact.email}</li>
                            </ul>
                        </div>

                        {/* Column 2: Page Links */}
                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider">Page Links</h4>
                            <ul className="space-y-3 text-sm">
                                {businessData.footer.links.pages.map(link => (
                                    <li key={link.name}>
                                        <a href={link.url} className="text-brand-text/70 hover:text-brand-text transition-colors">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Column 3: Utility Links */}
                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider">Utility Links</h4>
                            <ul className="space-y-3 text-sm">
                                {businessData.footer.links.utility.map(link => (
                                    <li key={link.name}>
                                        <a href={link.url} className="text-brand-text/70 hover:text-brand-text transition-colors">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Location */}
                        <div>
                            <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider">{businessData.footer.location.title}</h4>
                            <p className="text-brand-text/70 text-sm mb-4 flex">
                                <MapPinIcon className="flex-shrink-0 mt-1"/>
                                <span>{businessData.footer.location.address}</span>
                            </p>
                            <h5 className="text-sm font-semibold mt-6 mb-2 uppercase tracking-wider">Opening hours</h5>
                            <p className="text-brand-text/70 text-sm whitespace-pre-line">{businessData.footer.location.hours}</p>
                        </div>
                    </div>

                    {/* Bottom Footer Bar */}
                    <div className="text-center border-t border-brand-primary/50 mt-16 pt-8 text-sm">
                        <p className="text-brand-text/70">{businessData.footer.copyright}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}