export interface InstagramPost {
  id: string;
  category: string;
  imgUrl: string;
  likes: number;
  comments: number;
  size: string; // Tailwind grid span
  caption: string;
}

export const FEATURED_TESTIMONIAL = {
  name: "Meera Sen",
  role: "Verified Gourmet Enthusiast",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  date: "Today • Verified Order",
  stars: 5,
  heading: "An absolute masterwork of flavor and design!",
  review: "I commissioned a custom heart-shaped Red Velvet and Berries cake for my husband's milestone birthday. The live 3D designer made customization a dream. When it arrived in that premium gold-sealed climate-controlled box, we were spellbound! Our 40 guests were asking where we ordered it all evening! The sponge was incredibly moist, sweet but well-balanced with organic raspberry puree, and the frosting felt like luxury velvet cream on the palate.",
  order: {
    item: "Bespoke Red Velvet Heart",
    price: "₹1,499",
    thumbnail: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=150"
  },
  city: "New Delhi, GK-2"
};

export const SMALL_TESTIMONIALS = [
  {
    id: "review-1",
    name: "Aarav Kapoor",
    city: "Mumbai, Bandra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "The Belgian Hazelnut Feuilletine cake was exquisite! The crunch of caramelized praline combined with rich dark cacao ganache was purely heavenly. Hands down the finest chocolate pastry experience in Mumbai.",
    occasion: "Anniversary Celebration 💖",
    verified: true
  },
  {
    id: "review-2",
    name: "Dr. Ananya Reddy",
    city: "Bangalore, Indiranagar",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "100% vegetarian eggless cake that tastes this soft is rare! The Sicilian Pistachio & Raspberry was beautifully light, nutty, and perfectly tasty. The gold leaf detailing made it look like Awwwards digital art.",
    occasion: "Mother's Birthday 🎂",
    verified: true
  },
  {
    id: "review-3",
    name: "Vikram Malhotra",
    city: "Gurugram, DLF Phase 5",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "Midnight delivery was spot-on at 11:59 PM. The cake arrived chilled, pristine, and surrounded by dry-ice cooling vapors inside a stunning velvet package. Outstanding customer support throughout the track!",
    occasion: "Surprise Milestone 🌟",
    verified: true
  },
  {
    id: "review-4",
    name: "Kavya Singhal",
    city: "Noida, Sector 15",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "We ordered the Wild Lavender Honey cake for our baby shower. The pastel sky blue vanilla frosting and organic floral arrangement were highly aesthetic. Not a single slice was left! Simply marvelous.",
    occasion: "Baby Shower 👶",
    verified: true
  }
];

export const SCROLLING_REVIEWS = [
  {
    id: "sc-1",
    name: "Aarav Kapoor",
    city: "Bandra, Mumbai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "The Belgian Hazelnut Feuilletine cake was exquisite! The crunch of caramelized praline combined with rich dark cacao ganache was purely heavenly. Hands down the finest chocolate pastry experience in Mumbai.",
    occasion: "Anniversary Celebration 💖"
  },
  {
    id: "sc-2",
    name: "Dr. Ananya Reddy",
    city: "Indiranagar, Bangalore",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "100% vegetarian eggless cake that tastes this soft is rare! The Sicilian Pistachio & Raspberry was beautifully light, nutty, and perfectly tasty. The gold leaf detailing made it look like fine art.",
    occasion: "Mother's Birthday 🎂"
  },
  {
    id: "sc-3",
    name: "Vikram Malhotra",
    city: "DLF Phase 5, Gurugram",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "Midnight delivery was spot-on at 11:59 PM. The cake arrived chilled, pristine, and surrounded by dry-ice cooling vapors inside a stunning velvet package. Outstanding customer support!",
    occasion: "Surprise Milestone 🌟"
  },
  {
    id: "sc-4",
    name: "Kavya Singhal",
    city: "Sector 15, Noida",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "We ordered the Wild Lavender Honey cake for our baby shower. The pastel sky blue vanilla frosting and organic floral arrangement were highly aesthetic. Not a single slice was left! Simply marvelous.",
    occasion: "Baby Shower 👶"
  },
  {
    id: "sc-5",
    name: "Priyesha Mehta",
    city: "Koregaon Park, Pune",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "Stunning presentation. The customized gold monogram was perfectly precise, and the cake remained cold and intact even during a hot outdoor event. Absolute luxury in every bite.",
    occasion: "Engagement Gala 💍"
  },
  {
    id: "sc-6",
    name: "Rohan Varma",
    city: "Jubilee Hills, Hyderabad",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    review: "My corporate team was blown away by the edible logo cake. The chocolate fudge cream felt so velvety and delicious. Highly professional delivery coordination.",
    occasion: "Company Launch 🚀"
  }
];

export const CHRONICLES_STORIES = [
  {
    id: "ch-1",
    name: "Meera Sen",
    city: "New Delhi, GK-2",
    occasion: "Bespoke Anniversary Celebration 💖",
    stars: 5,
    title: "An absolute masterwork of flavor and design!",
    story: "I commissioned a custom heart-shaped Red Velvet and Berries cake for my husband's milestone birthday. The live 3D designer made customization a dream. When it arrived in that premium gold-sealed climate-controlled box, we were spellbound! Our 40 guests were asking where we ordered it all evening! It was sweet but perfectly balanced with raw organic raspberry puree."
  },
  {
    id: "ch-2",
    name: "Aarav Kapoor",
    city: "Bandra, Mumbai",
    occasion: "Milestone Golden Anniversary ✨",
    stars: 5,
    title: "The Belgian Hazelnut Feuilletine was pure culinary poetry",
    story: "For our 25th anniversary, we wanted a masterpiece. The Belgian Hazelnut Feuilletine cake surpassed every high-end French patisserie we've ever visited. The crunch of caramelized praline combined with rich dark cacao ganache was purely heavenly. Our friends in Mumbai are still raving about the texture!"
  },
  {
    id: "ch-3",
    name: "Dr. Ananya Reddy",
    city: "Indiranagar, Bangalore",
    stars: 5,
    occasion: "Mother's 70th Birthday Jubilee 🎂",
    title: "A flawless, light eggless creation",
    story: "My mother is strictly vegetarian, and finding an eggless cake with a light, non-dense crumb is nearly impossible. CakeUrban's Sicilian Pistachio & Raspberry was beautifully light, nutty, and perfectly tasty. The gold leaf detailing made it look like a physical piece of digital art."
  },
  {
    id: "ch-4",
    name: "Vikram Malhotra",
    city: "DLF Phase 5, Gurugram",
    stars: 5,
    occasion: "Surprise Midnight Proposal 💍",
    title: "Chilled to absolute perfection at midnight",
    story: "I planned a surprise proposal at midnight. The cake arrived in Faridabad heat at exactly 11:59 PM, surrounded by romantic dry-ice cooling vapors inside a stunning velvet package. She said Yes, and the chocolate fudge signature cake made the evening unforgettable."
  },
  {
    id: "ch-5",
    name: "Kavya Singhal",
    city: "Sector 15, Noida",
    stars: 5,
    occasion: "Botanical Baby Shower 👶",
    title: "Aesthetic lavender masterpiece",
    story: "Our Wild Lavender Honey cake was the visual center of our baby shower. The pastel sky blue vanilla frosting and organic floral arrangement were highly aesthetic. Not a single slice was left! Simply marvelous."
  },
  {
    id: "ch-6",
    name: "Priyesha Mehta",
    city: "Koregaon Park, Pune",
    stars: 5,
    occasion: "Elegant Garden Wedding 🌸",
    title: "Spectacular structural gold design",
    story: "We designed a multi-tier wedding cake with custom monogramming. The gold-burnished detailing matched our pastel decor perfectly. The team coordinated directly with our venue coordinator to place it in active refrigeration immediately. World-class service!"
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "ig-1",
    category: "Birthday Glamour 🎂",
    imgUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600",
    likes: 1248,
    comments: 89,
    size: "col-span-12 md:col-span-6 lg:col-span-4 h-[350px]",
    caption: "Sweet pink raspberry layers making milestones sparkle! ✨ Thank you @sara_kapur for sharing your stunning celebration."
  },
  {
    id: "ig-2",
    category: "Royal Wedding 👑",
    imgUrl: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600",
    likes: 3412,
    comments: 245,
    size: "col-span-12 md:col-span-6 lg:col-span-8 h-[350px]",
    caption: "A majestic multi-tiered white floral statement of pure organic luxury. Grand celebration of Kabir & Alisha's eternal vows."
  },
  {
    id: "ig-3",
    category: "Playful Kids 🎈",
    imgUrl: "https://images.unsplash.com/photo-1558961309-dbdf000302c6?auto=format&fit=crop&q=80&w=600",
    likes: 954,
    comments: 42,
    size: "col-span-12 md:col-span-6 lg:col-span-3 h-[420px]",
    caption: "Bright rainbow swirls and mini hand-baked chocolate chip cookies for Reyansh's 5th birthday adventure! 🍪"
  },
  {
    id: "ig-4",
    category: "Anniversary Love 💖",
    imgUrl: "https://images.unsplash.com/photo-1513073114154-36504427a37f?auto=format&fit=crop&q=80&w=600",
    likes: 2150,
    comments: 112,
    size: "col-span-12 md:col-span-6 lg:col-span-5 h-[420px]",
    caption: "Nothing says romance quite like our hand-sculpted crimson red velvet heart. Celebrating 25 years of beautiful togetherness."
  },
  {
    id: "ig-5",
    category: "Gourmet Cupcakes 🧁",
    imgUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600",
    likes: 1802,
    comments: 76,
    size: "col-span-12 md:col-span-6 lg:col-span-4 h-[420px]",
    caption: "Fluffy vanilla Chantilly peaks hand-decorated with stardust sugar sprinkles. The perfect bite of luxury for premium high-tea."
  },
  {
    id: "ig-6",
    category: "Designer Masterwork 🎨",
    imgUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    likes: 2790,
    comments: 198,
    size: "col-span-12 md:col-span-6 lg:col-span-7 h-[380px]",
    caption: "Aesthetic brushstroke white-chocolate panels, textured gold dust, and organic botanicals. Edible digital sculpture."
  },
  {
    id: "ig-7",
    category: "Celebration Candids ✨",
    imgUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=600",
    likes: 3105,
    comments: 167,
    size: "col-span-12 md:col-span-6 lg:col-span-5 h-[380px]",
    caption: "Lit with pure happiness! Capturing the glowing magical moment before slicing into our chocolate fudge ganache signature. 🎉"
  },
  {
    id: "ig-8",
    category: "Bespoke Photo Art 📸",
    imgUrl: "https://images.unsplash.com/photo-1505976378723-9726af54ee7f?auto=format&fit=crop&q=80&w=600",
    likes: 1640,
    comments: 54,
    size: "col-span-12 md:col-span-12 lg:col-span-12 h-[300px]",
    caption: "Memories printed in high-definition edible organic ink, surrounded by Tiffany Cyan buttercream borders. Your story, delicious."
  }
];
