'use client';
import { useState, useEffect } from 'react';
import { businessData as initialBusinessData } from './data.js';

// --- Reusable SVG Icons for Services ---
const DesignIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-secondary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5v-5.714c0-.597-.237-1.17-.659-1.591L14.25 3.104m0 0A23.298 23.298 0 0012 3c-1.331 0-2.63.097-3.886.284M19 14.5L14.25 19l-4.25-4.5 4.25-4.5z" />
    </svg>
);
const DevIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-secondary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5 0l-4.5 16.5" />
    </svg>
);
const BrandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-secondary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a16.5 16.5 0 01-1.08 8.16m-5.84 0a16.5 16.5 0 01-1.08-8.16m5.84 0a16.5 16.5 0 01-1.08 8.16M9.75 11.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
    </svg>
);
const serviceIcons = [DesignIcon, DevIcon, BrandIcon];

// --- Main Page Component ---
export default function AtelierPage() {
    
    const [businessData, setBusinessData] = useState(initialBusinessData); 

    useEffect(() => {
        const storedStoreName = localStorage.getItem('storeName');
        if (storedStoreName) {
            setBusinessData(prevData => ({
                ...prevData,
                name: storedStoreName,
                footer: {
                    ...prevData.footer,
                    copyright: `© ${new Date().getFullYear()} ${storedStoreName}. All Rights Reserved`
                }
            }));
        }
    }, []); 

    // --- Dynamic Theme Logic ---
    const createFontVariable = (fontName) => {
        if (!fontName) return;
        const formattedName = fontName.toLowerCase().replace(' ', '-');
        return `var(--font-${formattedName})`;
    };
    
    const fontVariables = {
        '--font-heading': createFontVariable(businessData.theme.font.heading),
        '--font-body': createFontVariable(businessData.theme.font.body),
    };

    const themeClassName = `theme-${businessData.theme.colorPalette}`;

    if (!businessData) {
        return <div className="flex h-screen items-center justify-center text-xl">Loading Preview...</div>;
    }
    
    return (
        <div 
          className={`antialiased font-sans bg-brand-bg text-brand-text ${themeClassName}`}
          style={fontVariables}
        >
            
            {/* --- Header --- */}
            <header className="bg-brand-bg/80 backdrop-blur-sm sticky top-0 z-40 w-full">
                <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="text-2xl font-bold text-brand-secondary font-serif tracking-wider">
                        {businessData.logoText || businessData.name}
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        {businessData.navigation.map(navItem => (
                            <a key={navItem.href} href={navItem.href} className="inactive-nav hover:text-brand-secondary transition-colors text-lg">{navItem.label}</a>
                        ))}
                    </nav>
                </div>
            </header>

            <main>
                {/* --- Hero Section --- */}
                <section id="home" className="container mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-6">
                            <h1 className="text-5xl md:text-6xl font-bold text-brand-secondary leading-tight font-serif">{businessData.hero.title}</h1>
                            <p className="text-xl text-brand-text opacity-90">{businessData.hero.subtitle}</p>
                            <a 
                                href={`https://wa.me/${businessData.whatsappNumber}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="mt-4 inline-block btn btn-primary px-8 py-3 rounded-lg text-lg w-fit"
                            >
                                {businessData.hero.cta}
                            </a>
                        </div>
                        <div className="flex justify-center">
                            <img 
                                src={businessData.hero.image} 
                                alt="Portrait" 
                                className="w-full max-w-sm md:max-w-md h-auto rounded-lg shadow-2xl object-cover" 
                                onError={(e) => e.target.src = 'https://placehold.co/600x800/E9ECEF/495057?text=Image+Error'}
                            />
                        </div>
                    </div>
                </section>

                {/* --- About Section --- */}
                <section id="about" className="py-24 bg-brand-primary">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary leading-tight font-serif">{businessData.about.title}</h2>
                        <p className="text-lg text-brand-text opacity-90 mt-6">{businessData.about.text}</p>
                    </div>
                </section>

                {/* --- Services Section --- */}
                <section id="services" className="py-24">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-brand-secondary mb-16 font-serif">{businessData.services.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {businessData.services.items.map((item, index) => {
                                const Icon = serviceIcons[index % serviceIcons.length];
                                return (
                                    <div key={item.id} className="flex flex-col items-center md:items-start text-center md:text-left">
                                        <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center">
                                            <Icon />
                                        </div>
                                        <h3 className="text-2xl font-bold text-brand-secondary font-serif mt-6 mb-2">{item.title}</h3>
                                        <p className="text-brand-text opacity-90">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                
                {/* --- Portfolio Section (Masonry Grid) --- */}
                <section id="work" className="py-24 bg-brand-primary">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-brand-secondary mb-16 font-serif">{businessData.portfolio.title}</h2>
                        {/* This grid uses responsive classes to create a masonry effect.
                            - 2 columns on small screens
                            - 3 columns on medium screens
                            - `md:grid-rows-2` creates a defined grid structure
                            - `md:grid-flow-col-dense` allows items to fill gaps
                        */}
                        <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 h-[70vh] md:h-[90vh]">
                            {businessData.portfolio.items.map((item, index) => (
                                <a 
                                  href="#" 
                                  key={item.id}
                                  className={`
                                    group relative rounded-lg overflow-hidden shadow-lg
                                    ${index === 1 ? 'md:col-span-1 md:row-span-2' : ''}
                                    ${index === 3 ? 'md:col-span-2 md:row-span-1' : ''}
                                    ${index === 4 ? 'md:col-span-1 md:row-span-1' : ''}
                                  `}
                                >
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                        onError={(e) => e.target.src = 'https://placehold.co/600x400/CCCCCC/909090?text=Image+Missing'}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <h3 className="text-2xl font-bold text-white font-serif transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                                        <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.category}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Contact Section --- */}
                <section id="contact" className="py-32">
                    <div className="container mx-auto px-6 max-w-3xl text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-secondary leading-tight font-serif">{businessData.contact.title}</h2>
                        <a 
                            href={`mailto:${businessData.contact.email}`}
                            className="text-2xl md:text-3xl text-brand-text opacity-90 font-serif mt-8 inline-block hover:text-brand-secondary transition-colors"
                        >
                            {businessData.contact.email}
                        </a>
                        <div className="flex justify-center gap-8 mt-12">
                            {businessData.contact.socials.map(social => (
                                <a 
                                    key={social.name} 
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg font-bold text-brand-text hover:text-brand-secondary transition-colors"
                                >
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* --- Footer --- */}
            <footer className="bg-brand-primary py-8">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-brand-text opacity-70">{businessData.footer.copyright}</p>
                </div>
            </footer>
        </div>
    );
}