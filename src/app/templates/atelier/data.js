// This object contains all the dynamic content AND theme for the site.
export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Your Name", // This will be replaced by the name from local storage
    logoText: "A", // A simple initial/logo. Use a full logo URL if preferred.
    whatsappNumber: "91123456789", // For the 'Book Now' button

    // --- THEME SECTION ---
    theme: {
        // Choose any: 'warm-bakery', 'strawberry-cream', 'chocolate-caramel',
        // 'cinnamon-spice', 'earl-grey', 'dark-roast'
        colorPalette: 'earl-grey',
        font: {
            heading: 'Playfair Display',
            body: 'Inter'
        }
    },

    // --- NAVIGATION ---
    navigation: [
        { href: "#about", label: "About" },
        { href: "#services", label: "Services" },
        { href: "#work", label: "Work" },
        { href: "#contact", label: "Contact" },
    ],

    // --- PAGE SECTIONS ---
    hero: {
        title: "Crafting digital experiences that inspire.",
        subtitle: "I'm a multidisciplinary designer & developer based in Silchar, focused on creating beautiful, functional, and user-centered digital products.",
        cta: "Book a Consultation",
        image: "https://placehold.co/600x800/E9ECEF/495057?text=Your+Portrait"
    },

    about: {
        title: "My design philosophy is simple: create things I'm proud of.",
        text: "For over 5 years, I've partnered with startups and established businesses to build brands and digital products. I believe in a collaborative process, clear communication, and a strong focus on strategy to achieve outstanding results."
    },

    services: {
        title: "What I Do",
        items: [
            { id: 1, title: "UI/UX Design", description: "Crafting intuitive and beautiful user interfaces." },
            { id: 2, title: "Web Development", description: "Building fast, responsive, and scalable websites." },
            { id: 3, title: "Brand Strategy", description: "Helping you define your brand's voice and identity." },
        ]
    },
    
    portfolio: {
        title: "Selected Work",
        items: [
            { id: 1, title: "Project Alpha", category: "Web Design", image: "https://placehold.co/600x400/8A7F7D/F8F9FA?text=Project+1" },
            { id: 2, title: "Project Beta", category: "Branding", image: "https://placehold.co/600x800/495057/E9ECEF?text=Project+2" },
            { id: 3, title: "Project Gamma", category: "Development", image: "https://placehold.co/600x400/8A7F7D/F8F9FA?text=Project+3" },
            { id: 4, title: "Project Delta", category: "UI/UX", image: "https://placehold.co/600x400/495057/E9ECEF?text=Project+4" },
            { id: 5, title: "Project Epsilon", category: "Branding", image: "https://placehold.co/600x800/8A7F7D/F8F9FA?text=Project+5" },
        ]
    },

    contact: {
        title: "Let's build something together.",
        email: "hello@yourdomain.com",
        socials: [
            { name: "Instagram", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "Dribbble", url: "#" },
        ]
    },

    footer: {
        copyright: `© ${new Date().getFullYear()} Your Name. All Rights Reserved`,
    }
};