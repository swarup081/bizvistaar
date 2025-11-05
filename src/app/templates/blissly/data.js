// src/app/templates/brewhaven/data.js

// This object contains all the dynamic content AND theme for the site.
// It is structured to be read by the src/app/templates/brewhaven/page.js component.

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Brewhaven", // This will be replaced by the name from local storage
    logoText: "Brewhaven", // This will be replaced by the name from local storage

    // --- THEME SECTION ---
    theme: {
        // Choose a palette from globals.css that defines an 'accent' color
        // 'elegant-botanics' has a warm, artisanal feel that fits a coffee shop
        colorPalette: 'elegant-botanics', 
        font: {
            // These fonts must be loaded in src/app/layout.js
            heading: 'kalam', // A classy serif font
            body: 'Lato'             // A clean, readable sans-serif font
        }
    },

    // --- NAVIGATION ---
    navigation: [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#menu", label: "Menu" },
        { href: "#events", label: "Events" },
        { href: "#contact", label: "Contact" },
    ],

    // --- HEADER BUTTON ---
    headerButton: {
        text: "Order Online",
        href: "#menu" // Links to the menu section
    },

    // --- PAGE SECTIONS ---
    hero: {
        title: "Where Every Sip is an Experience",
        subtitle: "Discover our passion for artisanal coffee, handcrafted pastries, and a space designed for you to relax, work, or connect.",
        cta: "View Our Menu",
        image: "/blissly/hero_image.png" // Placeholder image path
    },

    events: {
        title: "What's Brewing",
        items: [
            {
                image: "/blissly/valentin-ciccarone-YMihlfY0wcE-unsplash.jpg",
                title: "Live Acoustic Nights",
                text: "Join us every Friday evening for live music from local artists. Enjoy great coffee and even better company."
            },
            {
                image: "/blissly/john-amachaab-z0IktCV6PAg-unsplash.jpg",
                title: "Latte Art Workshop",
                text: "Unleash your inner barista. Learn the basics of latte art from our head barista. Sign up in-store!"
            },
            {
                image: "/blissly/wtu-257-KaMWcrwimB4-unsplash.jpg",
                title: "Meet the Roaster",
                text: "A special tasting event featuring our latest single-origin bean. Learn about the roasting process."
            }
        ]
    },
    
    about: {
        title: "From Bean to Cup, With Passion",
        text: "Brewhaven was born from a simple idea: coffee should be an experience, not just a routine. We partner with sustainable farms, roast our beans in-house, and train our baristas to pull the perfect shot, every time.",
        image: "/blissly/keghan-crossland-ZZxmc66SjfM-unsplash.jpg", // Placeholder image path
        features: [
            {
                title: "Ethically Sourced Beans",
                text: "We build direct relationships with farmers to ensure quality and fair compensation."
            },
            {
                title: "In-House Roasting",
                text: "Our beans are roasted fresh every week to bring out their unique, complex flavors."
            },
            {
                title: "Community Focused",
                text: "A welcoming space for everyone to gather, create, and connect."
            }
        ]
    },

    menu: {
        badge: "Our Menu",
        title: "Crafted for You",
        description: "From our signature espresso blends to freshly-baked pastries and light bites, there's something to brighten your day.",
        items: [
            { name: "Classic Espresso", price: "3.50", description: "A rich, full-bodied shot with notes of chocolate and citrus." },
            { name: "Creamy Cappuccino", price: "4.50", description: "Perfectly balanced espresso, steamed milk, and a cap of foam." },
            { name: "Artisanal Latte", price: "5.00", description: "Our signature espresso with velvety smooth steamed milk." },
            { name: "Pour Over (V60)", price: "5.50", description: "A clean, bright cup highlighting our single-origin of the day." },
            { name: "Croissant", price: "3.00", description: "Flaky, buttery, and baked fresh every morning." },
            { name: "Avocado Toast", price: "8.50", description: "Sourdough toast with fresh avocado, chili flakes, and sea salt." }
        ],
        cta: "View Full Menu"
    },

    testimonials: {
        // 'items' is an array of testimonial objects
        items: [
            {
                quote: "This is my absolute favorite spot. The coffee is consistently excellent and the atmosphere is so cozy and welcoming!",
                name: "Sarah K.",
                title: "Local Designer"
            },
            {
                quote: "The best avocado toast in the city, hands down. And the baristas always remember my order.",
                name: "Michael R.",
                title: "Remote Worker"
            },
            {
                quote: "I came for the latte art workshop and had a blast. The staff is so knowledgeable and friendly. A true community gem.",
                name: "Emily T.",
                title: "Student"
            }
        ]
    },

    specialty: {
        title: "Our Specialty",
        items: [
            { name: "Cappuccino", price: "22.00", image: "/blissly/esra-afsar-JqXUZxoLwlE-unsplash.jpg" },
            { name: "Cookies", price: "18.00", image: "/blissly/caroline-badran-UvZiEu43tcQ-unsplash.jpg" },
            { name: "Matcha Green Tea Latte", price: "25.00", image: "/blissly/mustafa-akin-4fa1DuXBTKw-unsplash.jpg" },
            { name: "Croissant", price: "35.00", image: "/blissly/vicky-nguyen-a4xoMVKzbak-unsplash.jpg" }
        ]
    },

    cta: {
        title: "Let's get in touch!",
        text: "Have a question about our menu, events, or catering? We'd love to hear from you. Drop by or send us a message.",
        cta: "Contact Us"
    },

    // --- FOOTER ---
    footer: {
        promoTitle: "Join our mailing list",
        contact: {
            phone: "+1 (123) 456-7890",
            email: "hello@brewhaven.com",
        },
        links: {
            pages: [
                { name: "Home", url: "#home" },
                { name: "About", url: "#about" },
                { name: "Menu", url: "#menu" },
                { name: "Events", url: "#events" }
            ],
            utility: [
                { name: "Style Guide", url: "#" },
                { name: "Changelog", url: "#" },
                { name: "Licenses", url: "#" }
            ]
        },
        location: {
            title: "Location",
            address: "123 Coffee St, Bean Town, CA 90210",
            hours: "Mon - Fri: 7am - 6pm\nSat - Sun: 8am - 5pm" // Using \n for line breaks
        },
        // This copyright text will also be dynamically updated by the page component
        copyright: `© ${new Date().getFullYear()} Brewhaven. All Rights Reserved.`
    }
};