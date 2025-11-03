// This object contains all the dynamic content AND theme for the site.

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Candlea",
    logoText: "Candlea", // From screenshot
    whatsappNumber: "91123456789", 

    // --- THEME SECTION ---
    theme: {
        colorPalette: 'sage-green',
        font: {
            heading: 'Lora',
            body: 'Montserrat'
        }
    },

    // --- NAVIGATION ---
    navigation: [
        { href: "#home", label: "Home" },
        { href: "#shop", label: "Shop" },
        { href: "#blog", label: "Blog" },
        { href: "#contact", label: "Contact" },
    ],

    // --- PAGE SECTIONS (from screenshots) ---
    hero: {
        title: "Crafting moments of tranquility",
        subtitle: "Discover our collection of soothing candles, each one thoughtfully made to help you unwind.",
        cta: "Shop Now",
        image: "https://placehold.co/800x1000/F0EAE6/333333?text=Frazzled+Mom+Candle"
    },
    
    infoBar: "Ready to ignite a fresh experience?", // Updated text

    feature1: {
        title: "Crafting warmth & serenity in every flame",
        text: "At Candlea, we believe in the power of scent to transform spaces and uplift moods. Our passion for crafting high-quality, eco-friendly candles drives everything we do.",
        subtext: "Whether you're looking to create a cozy atmosphere or find the perfect gift, our carefully curated collection offers something special for every moment. Join us in embracing the warmth, tranquility, and beauty that our candles bring to your home.",
        cta: "About Us",
        image: "https://placehold.co/800x800/FBEAE4/333333?text=Comfort+Zone+Candle"
    },
    
    collection: {
        title: "Our collection",
        items: [
            { id: 1, name: "Scented candles", image: "https://placehold.co/600x800/B0C4DE/333333?text=Rain+Check" },
            { id: 2, name: "Button Shirt", image: "https://placehold.co/600x800/C0A080/333333?text=Grandpa's+Cardigan" },
            { id: 3, name: "Cartridge", image: "https://placehold.co/600x800/D4E1B0/333333?text=Farmer's+Market" },
        ]
    },

    bestSellers: {
        title: "Our best seller",
        items: [
            { id: 4, name: 'Lightweight Granite Hat', price: 29.00, category: 'Button Shirt', image: 'https://placehold.co/600x600/F0EAE6/333333?text=Dear+Grad' },
            { id: 5, name: 'Incredible Linen Shirt', price: 11.90, category: 'Cashmere', image: 'https://placehold.co/600x600/D1C7C0/333333?text=Vinyl+Records' },
            { id: 6, name: 'Practical Linen Shoes', price: 11.90, category: 'Cashmere', image: 'https://placehold.co/600x600/A0B8C0/FFFFFF?text=Weekend' },
            { id: 7, name: 'Fantastic Paper Pants', price: 11.90, category: 'Cashmere', image: 'https://placehold.co/600x600/C0A0B8/FFFFFF?text=Happy+Hour' },
        ]
    },
    
    feature2: {
        title: "Embrace the serenity of peaceful scents",
        text: "Indulge in the serene and calming aromas that our candles offer, transforming your space into a peaceful haven. Let the gentle, soothing scents wash over you.",
        subtext: "Treat yourself to the soothing embrace of our peaceful scents, carefully crafted to transform your space into a sanctuary of calm and relaxation.",
        image1: "https://placehold.co/800x1000/D4E1B0/333333?text=Succulent+Garden", 
        image2: "https://placehold.co/600x800/B0C4DE/333333?text=Dear+Grad+2", 
    },

    // POINT 5: "features" array removed
    
    blog: {
        title: "Our blog",
        items: [
            { date: "NOV 19, 2024", title: "Nullam ullamcorper nisl quis ornare molestie", text: "Suspendisse posuere, diam in bibendum lobortis, turpis ipsum aliquam risus, sit amet...", image: "https://placehold.co/600x400/E0D8B0/333333?text=Blog+1" },
            { date: "NOV 19, 2024", title: "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus", text: "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus. Nunc urna Morbi fringilla vitae...", image: "https://placehold.co/600x400/FBEAE4/333333?text=Blog+2" },
            { date: "NOV 19, 2024", title: "Morbi condimentum molestie Nam enim odio sodales", text: "Sed mauris Pellentesque elit Aliquam at lacus interdum nascetur elit ipsum. Enim ipsum...", image: "https://placehold.co/600x400/D1C7C0/333333?text=Blog+3" },
            { date: "NOV 19, 2024", title: "Urna pretium elit mauris cursus Curabitur at elit Vestibulum", text: "Mi vitae magnis Fusce laoreet nibh felis porttitor laoreet Vestibulum faucibus. At Nulla...", image: "https://placehold.co/600x400/A0B8C0/333333?text=Blog+4" },
        ]
    },

    // --- FOOTER (from PDF Page 5) ---
    footer: {
        links: {
          about: [
            { name: "Our Story", url: "#" },
            { name: "Careers", url: "#" },
            { name: "Sustainability", url: "#" }
          ],
          categories: [
            { name: "Candles", url: "#" },
            { name: "Gift Sets", url: "#" }
          ],
          getHelp: [
            { name: "Contact Us", url: "#" },
            { name: "Shipping", url: "#" },
            { name: "Returns", url: "#" }
          ]
        },
        copyright: "© 2025 Candlea. All Rights Reserved"
      }
    };
