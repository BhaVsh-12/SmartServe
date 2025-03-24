// Service Categories
export const serviceCategories = [
  {
    id: "1",
    name: "Home Services",
    icon: "home",
    subcategories: [
      {
        id: "1-1",
        name: "Plumbing",
        providers: [
          {
            id: "p1",
            name: "PlumbFix Experts",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
            experience: "7 years",
            rating: 4.6,
            description: "Reliable plumbing services for repairs and installations.",
            pricing: "From $40/hr",
            reviews: [{ id: "r1", userName: "Alice Smith", rating: 5, comment: "Quick and efficient!", date: "2024-01-20" }],
          },
        ],
      },
      {
        id: "1-2",
        name: "Cleaning",
        providers: [
          {
            id: "p2",
            name: "CleanPro Services",
            avatar: "https://images.unsplash.com/photo-1600891964092-a6a7e59a8ba9",
            experience: "5 years",
            rating: 4.8,
            description: "Eco-friendly home cleaning services.",
            pricing: "From $50/hr",
            reviews: [{ id: "r2", userName: "John Doe", rating: 5, comment: "Excellent service!", date: "2023-05-15" }],
          },
        ],
      },
      {
        id: "1-3",
        name: "Painting",
        providers: [
          {
            id: "p3",
            name: "ColorCrafters",
            avatar: "https://images.unsplash.com/photo-1543965170-4ebf72f73414",
            experience: "10 years",
            rating: 4.9,
            description: "High-quality painting for homes and offices.",
            pricing: "From $60/hr",
            reviews: [{ id: "r3", userName: "Emily Clark", rating: 5, comment: "Very professional!", date: "2023-12-10" }],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Tech Services",
    icon: "laptop",
    subcategories: [
      {
        id: "2-1",
        name: "IT Support",
        providers: [
          {
            id: "p4",
            name: "Tech Wizards",
            avatar: "https://images.unsplash.com/photo-1581092335776-b5b94af6808c",
            experience: "6 years",
            rating: 4.7,
            description: "Comprehensive IT support services.",
            pricing: "From $80/hr",
            reviews: [{ id: "r4", userName: "David Johnson", rating: 5, comment: "Fixed my laptop fast!", date: "2024-02-08" }],
          },
        ],
      },
      {
        id: "2-2",
        name: "Software Development",
        providers: [
          {
            id: "p5",
            name: "CodeCrafters",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
            experience: "8 years",
            rating: 4.9,
            description: "Custom software development solutions.",
            pricing: "Project-based",
            reviews: [{ id: "r5", userName: "Sophia Martinez", rating: 5, comment: "Built a great website!", date: "2024-03-01" }],
          },
        ],
      },
      {
        id: "2-3",
        name: "Networking",
        providers: [
          {
            id: "p6",
            name: "NetPro Solutions",
            avatar: "https://images.unsplash.com/photo-1604335399100-380290a30d52",
            experience: "9 years",
            rating: 4.8,
            description: "Reliable networking solutions for businesses and homes.",
            pricing: "From $70/hr",
            reviews: [{ id: "r6", userName: "Sarah Connor", rating: 4.7, comment: "Great networking setup!", date: "2024-01-15" }],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Health & Wellness",
    icon: "heart-pulse",
    subcategories: [
      {
        id: "3-1",
        name: "Fitness Training",
        providers: [
          {
            id: "p7",
            name: "FitLife Coaching",
            avatar: "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
            experience: "9 years",
            rating: 4.8,
            description: "Personalized fitness coaching.",
            pricing: "From $100/month",
            reviews: [{ id: "r7", userName: "Mark Taylor", rating: 5, comment: "Achieved my fitness goals!", date: "2023-11-22" }],
          },
        ],
      },
      {
        id: "3-2",
        name: "Mental Health Counseling",
        providers: [
          {
            id: "p8",
            name: "MindWell Therapists",
            avatar: "https://images.unsplash.com/photo-1554306297-0c3f5c8980d4",
            experience: "12 years",
            rating: 4.9,
            description: "Professional mental health support.",
            pricing: "From $80/hr",
            reviews: [{ id: "r8", userName: "Emma Watson", rating: 5, comment: "Life-changing therapy sessions!", date: "2023-10-30" }],
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Business & Finance",
    icon: "briefcase",
    subcategories: [
      {
        id: "4-1",
        name: "Accounting",
        providers: [
          {
            id: "p9",
            name: "Finance Pros",
            avatar: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
            experience: "15 years",
            rating: 4.9,
            description: "Expert accounting and bookkeeping services.",
            pricing: "From $70/hr",
            reviews: [{ id: "r9", userName: "Michael Brown", rating: 5, comment: "Saved me a lot in taxes!", date: "2023-10-05" }],
          },
        ],
      },
      {
        id: "4-2",
        name: "Business Strategy",
        providers: [
          {
            id: "p10",
            name: "BizGrow Consultants",
            avatar: "https://images.unsplash.com/photo-1573164574511-73c773193279",
            experience: "10 years",
            rating: 4.8,
            description: "Strategic consulting for business growth.",
            pricing: "Project-based",
            reviews: [{ id: "r10", userName: "Robert Downey", rating: 4.9, comment: "Helped scale my business!", date: "2023-09-12" }],
          },
        ],
      },
    ],
  },
];


// Service History
export const serviceHistory = [
  {
    id: "h1",
    providerId: "p1",
    providerName: "CleanPro Services",
    serviceId: "1-1",
    serviceName: "Home Cleaning",
    date: "2023-06-15",
    status: "Completed",
    amount: "$120",
  },
];

// User Data
export const userData = {
  id: "user1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  addresses: [
    {
      id: "addr1",
      type: "Home",
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      isDefault: true,
    },
  ],
  paymentMethods: [
    {
      id: "pm1",
      type: "Credit Card",
      lastFour: "4242",
      expiryDate: "05/25",
      isDefault: true,
    },
  ],
};

// Transactions
export const transactions = [
  {
    id: "t1",
    date: "2023-06-15",
    amount: "$120",
    description: "Payment to CleanPro Services",
    status: "Completed",
  },
];

// Conversations
export const conversations = [
  {
    id: "c1",
    participantId: "p1",
    participantName: "CleanPro Services",
    participantAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    lastMessage: "We will be there at 10 AM tomorrow as scheduled.",
    lastMessageTime: "2023-06-14 15:30",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        senderId: "user1",
        senderName: "Alex Johnson",
        senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        content: "Hi, I'd like to confirm my appointment for tomorrow.",
        timestamp: "2023-06-14 15:20",
        isRead: true,
      },
    ],
  },
];
