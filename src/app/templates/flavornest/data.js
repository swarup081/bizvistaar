// This object contains all the dynamic content AND theme for the site.
// For your MVP, you will duplicate this file for each new client and manually change the values.

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Your Business Name", // This will be replaced by the name from local storage
    logo: "https://flavornestfoods.netlify.app/flavornest_logo.jpeg",
    whatsappNumber: "91123456789", // Remember to change this for each client

    // --- NEW THEME SECTION ---
    theme: {
        '--color-primary': '#6D4C41',
        '--color-secondary': '#F9EBE4',
        '--color-text': '#5D4037',
        '--color-background': '#FFF8F2',
        '--font-heading': 'var(--font-playfair)',
        '--font-body': 'var(--font-inter)',
    },

    // --- NAVIGATION ---
    navigation: [
        { href: "#home", label: "Home" },
        { href: "#menu", label: "Menu" },
        { href: "#reviews", label: "Reviews" },
    ],

    // --- PAGE SECTIONS ---
    hero: {
        title: "Handcrafted Delicacies, Made with Love",
        subtitle: "Experience the authentic taste of homemade sweets and savories, crafted with the freshest ingredients and a touch of tradition.",
        cta: "Explore Our Menu"
    },
    about: {
        title: "Where Taste Finds a Home",
        text: "FlavorNest started from a simple passion for cooking, balanced with the hustle of student life. Every dish we create is a piece of our heart, made with the same care and quality we'd want for our own family. Thank you for supporting a small dream and letting us share our flavors with you."
    },
    menu: {
        title: "Our Signature Offerings",
        items: [
            { id: 1, name: "Kesar Mawa Modak ", description: "Delicate homemade mawa modaks with kesar and premium dry fruits. Perfect for festivals, celebrations, and gifting.", price: 129, unit: "6 Pieces", image: "/flavournestImage/modak_productimage.jpeg" },
            { id: 2, name: "Shahi Mawa Rolls ", description: "Rich rolls stuffed with fresh mawa, fried in ghee and coated in sugar syrup, garnished with grated mawa, boondi, and dry fruits. Ideal for festivals, special occasions, and gifting.", price: 149, unit: "4 Pieces", image: "/flavournestImage/shahi_mava_rolls_productimage.jpeg" },
            { id: 5, name: "Thekua ", description: "Authentic handmade Thekua made with 100% whole wheat atta and fried in fresh oil , no palm oil, no preservatives. Crafted in small, limited batches for a perfectly crisp texture and rich traditional flavor.", price: 249, unit: "200 grams", image: "/flavournestImage/thakua_productimage.jpeg" },
           ]
    },
    reviews: {
        title: "What Our Customers Say",
        items: [
            { author: "Muskan B.", text: "The Kesar Mawa Modaks were absolutely divine! So fresh and perfectly sweet. You can taste the quality in every bite." },
            { author: "Anjali P.", text: "FlavorNest is my go-to for festive sweets now. The packaging is beautiful, making it perfect for gifting." },
            { author: "Rohan D.", text: "Incredible taste and so hygienic. It feels so good to support a local, student-run business that puts so much love into their food." }
        ]
    },
    footer: {
        // This copyright text will also be dynamically updated by the page component
        copyright: `© ${new Date().getFullYear()} Your Business Name. All Rights Reserved`,
        madeBy: "BizVistar",
        madeByLink: "https://www.instagram.com/swarup_81",
        socialLink: "https://www.instagram.com/_flavornest_",
        socialText: "Follow our journey on "
    }
};
