// Comprehensive mock data for demo mode

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Demo user
export const demoUser = {
    id: "demo-user-1",
    email: "demo@restaurant.com",
    restaurant_name: "Demo Restaurant",
    phone: "+919876543210",
    created_at: "2024-01-01T00:00:00Z"
};

// Generate realistic customers
export const generateMockCustomers = () => {
    const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];
    const tiers = ["Bronze", "Silver", "Gold", "Platinum"];
    const firstNames = ["Rajesh", "Priya", "Amit", "Sneha", "Vikram", "Anita", "Sanjay", "Kavita", "Rahul", "Deepika", 
                        "Arjun", "Pooja", "Karan", "Neha", "Rohan", "Anjali", "Aditya", "Riya", "Nikhil", "Simran",
                        "Varun", "Swati", "Akash", "Meera", "Siddharth", "Nisha", "Harsh", "Tanvi", "Manish", "Isha"];
    const lastNames = ["Sharma", "Patel", "Kumar", "Singh", "Reddy", "Iyer", "Gupta", "Joshi", "Shah", "Mehta",
                       "Rao", "Nair", "Verma", "Desai", "Pillai", "Agarwal", "Chopra", "Malhotra", "Saxena", "Bhatia"];
    
    const customers = [];
    const now = new Date();
    
    for (let i = 0; i < 55; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;
        const phone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
        const totalSpent = Math.floor(Math.random() * 50000) + 1000;
        const totalPoints = Math.floor(totalSpent * 0.1);
        const visits = Math.floor(Math.random() * 30) + 1;
        const lastVisitDays = Math.floor(Math.random() * 90);
        const lastVisit = new Date(now.getTime() - lastVisitDays * 24 * 60 * 60 * 1000).toISOString();
        const createdDays = Math.floor(Math.random() * 365) + 30;
        const createdAt = new Date(now.getTime() - createdDays * 24 * 60 * 60 * 1000).toISOString();
        
        // Determine tier based on spending
        let tier;
        if (totalSpent < 5000) tier = "Bronze";
        else if (totalSpent < 15000) tier = "Silver";
        else if (totalSpent < 30000) tier = "Gold";
        else tier = "Platinum";
        
        const customerType = Math.random() > 0.85 ? "corporate" : "normal";
        const walletBalance = Math.random() > 0.7 ? Math.floor(Math.random() * 2000) : 0;
        
        customers.push({
            id: `customer-${i + 1}`,
            name,
            phone,
            country_code: "+91",
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
            total_points: totalPoints,
            total_spent: totalSpent,
            visits,
            tier,
            last_visit: lastVisit,
            created_at: createdAt,
            customer_type: customerType,
            gst_name: customerType === "corporate" ? `${name} Pvt Ltd` : null,
            gst_number: customerType === "corporate" ? `27AABCU9603R1Z${i}` : null,
            city: cities[Math.floor(Math.random() * cities.length)],
            address: customerType === "corporate" ? `Office ${i + 1}, Business Park` : null,
            pincode: `400${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
            dob: Math.random() > 0.5 ? `199${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : null,
            anniversary: Math.random() > 0.7 ? `201${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : null,
            allergies: Math.random() > 0.8 ? ["Peanuts", "Dairy"].slice(0, Math.floor(Math.random() * 2) + 1) : null,
            notes: Math.random() > 0.7 ? "Prefers window seating" : null,
            wallet_balance: walletBalance,
            custom_field_1: Math.random() > 0.5 ? ["Dine-in", "Takeaway", "Delivery"][Math.floor(Math.random() * 3)] : null,
            custom_field_2: null,
            custom_field_3: null
        });
    }
    
    return customers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// Generate points transactions
export const generateMockPointsTransactions = (customers) => {
    const transactions = [];
    const types = ["earned", "redeemed", "bonus", "expired", "adjusted"];
    const reasons = {
        earned: ["Bill payment", "Purchase", "Dine-in"],
        redeemed: ["Discount redemption", "Reward claimed"],
        bonus: ["Birthday bonus", "Anniversary bonus", "First visit bonus", "Tier upgrade bonus"],
        expired: ["Points expired after 1 year"],
        adjusted: ["Manual adjustment by admin"]
    };
    
    customers.forEach((customer, idx) => {
        const numTransactions = Math.floor(Math.random() * 15) + 5;
        for (let i = 0; i < numTransactions; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const points = type === "redeemed" 
                ? -Math.floor(Math.random() * 500) - 100
                : Math.floor(Math.random() * 500) + 50;
            const daysAgo = Math.floor(Math.random() * 180);
            const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
            
            transactions.push({
                id: `points-${idx}-${i}`,
                customer_id: customer.id,
                customer_name: customer.name,
                points,
                type,
                reason: reasons[type][Math.floor(Math.random() * reasons[type].length)],
                created_at: createdAt,
                bill_amount: type === "earned" ? Math.floor(Math.random() * 5000) + 500 : null
            });
        }
    });
    
    return transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// Generate wallet transactions
export const generateMockWalletTransactions = (customers) => {
    const transactions = [];
    const types = ["credit", "debit"];
    const reasons = {
        credit: ["Wallet top-up", "Refund", "Bonus credit", "Cashback"],
        debit: ["Bill payment", "Purchase"]
    };
    
    customers.forEach((customer, idx) => {
        if (customer.wallet_balance > 0 || Math.random() > 0.5) {
            const numTransactions = Math.floor(Math.random() * 10) + 3;
            for (let i = 0; i < numTransactions; i++) {
                const type = types[Math.floor(Math.random() * types.length)];
                const amount = type === "debit"
                    ? -Math.floor(Math.random() * 1000) - 100
                    : Math.floor(Math.random() * 2000) + 500;
                const daysAgo = Math.floor(Math.random() * 120);
                const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
                
                transactions.push({
                    id: `wallet-${idx}-${i}`,
                    customer_id: customer.id,
                    customer_name: customer.name,
                    amount,
                    type,
                    reason: reasons[type][Math.floor(Math.random() * reasons[type].length)],
                    created_at: createdAt,
                    bonus_amount: type === "credit" && Math.random() > 0.7 ? Math.floor(amount * 0.1) : null
                });
            }
        }
    });
    
    return transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// Generate coupons
export const generateMockCoupons = () => {
    const now = new Date();
    return [
        {
            id: "coupon-1",
            code: "WELCOME20",
            description: "Welcome offer - 20% off on first order",
            discount_type: "percentage",
            discount_value: 20,
            min_order_value: 500,
            max_discount: 200,
            usage_limit: 100,
            used_count: 45,
            valid_from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            valid_until: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            channels: ["dine-in", "delivery", "takeaway"],
            is_active: true,
            created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "coupon-2",
            code: "GOLD50",
            description: "Flat ₹50 off for Gold tier members",
            discount_type: "fixed",
            discount_value: 50,
            min_order_value: 300,
            max_discount: null,
            usage_limit: 200,
            used_count: 87,
            valid_from: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            valid_until: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            channels: ["dine-in"],
            tier_restriction: "Gold",
            is_active: true,
            created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "coupon-3",
            code: "WEEKEND15",
            description: "Weekend special - 15% off",
            discount_type: "percentage",
            discount_value: 15,
            min_order_value: 800,
            max_discount: 150,
            usage_limit: 50,
            used_count: 23,
            valid_from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            valid_until: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            channels: ["dine-in", "takeaway"],
            is_active: true,
            created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "coupon-4",
            code: "FESTIVAL100",
            description: "Festival special - ₹100 off",
            discount_type: "fixed",
            discount_value: 100,
            min_order_value: 1000,
            max_discount: null,
            usage_limit: 30,
            used_count: 30,
            valid_from: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            valid_until: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            channels: ["dine-in", "delivery"],
            is_active: false,
            created_at: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "coupon-5",
            code: "DELIVERY25",
            description: "Delivery discount - 25% off",
            discount_type: "percentage",
            discount_value: 25,
            min_order_value: 400,
            max_discount: 100,
            usage_limit: 150,
            used_count: 68,
            valid_from: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            valid_until: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
            channels: ["delivery"],
            is_active: true,
            created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
};

// Generate segments
export const generateMockSegments = () => {
    const now = new Date();
    return [
        {
            id: "segment-1",
            name: "VIP Gold Members",
            filters: { tier: "Gold" },
            customer_count: 12,
            created_at: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "segment-2",
            name: "Inactive Customers (30+ days)",
            filters: { last_visit_days: "30" },
            customer_count: 18,
            created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "segment-3",
            name: "Corporate Clients",
            filters: { customer_type: "corporate" },
            customer_count: 8,
            created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "segment-4",
            name: "Mumbai Premium",
            filters: { city: "Mumbai", tier: "Platinum" },
            customer_count: 5,
            created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
};

// Generate feedback
export const generateMockFeedback = (customers) => {
    const feedback = [];
    const comments = [
        "Great food and service!",
        "Excellent ambiance, loved the experience",
        "Good food but service could be faster",
        "Amazing food quality, will visit again",
        "Nice place for family dining",
        "Delicious food, highly recommended",
        "Average experience, expected better",
        "Outstanding service and hospitality",
        "Food was good but portion size was small",
        "Best restaurant in the area!"
    ];
    
    customers.slice(0, 30).forEach((customer, idx) => {
        if (Math.random() > 0.3) {
            const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars mostly
            const daysAgo = Math.floor(Math.random() * 60);
            const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
            
            feedback.push({
                id: `feedback-${idx + 1}`,
                customer_id: customer.id,
                customer_name: customer.name,
                rating,
                comments: comments[Math.floor(Math.random() * comments.length)],
                created_at: createdAt
            });
        }
    });
    
    return feedback.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// WhatsApp templates
export const generateMockWhatsAppTemplates = () => {
    return [
        {
            id: "template-1",
            name: "Welcome Message",
            content: "Welcome to {{restaurant_name}}, {{customer_name}}! 🎉 Thank you for joining our loyalty program. Start earning points on every visit!",
            variables: ["restaurant_name", "customer_name"],
            created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "template-2",
            name: "Points Earned",
            content: "Hi {{customer_name}}! You've earned {{points_earned}} points on your recent visit. Your total balance: {{points_balance}} points. Thank you for dining with us! 🌟",
            variables: ["customer_name", "points_earned", "points_balance"],
            created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "template-3",
            name: "Birthday Wishes",
            content: "Happy Birthday {{customer_name}}! 🎂 We've added {{points_earned}} bonus points to your account. Visit us today and enjoy special birthday treats!",
            variables: ["customer_name", "points_earned"],
            created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "template-4",
            name: "Wallet Credit",
            content: "Hi {{customer_name}}, ₹{{amount}} has been credited to your wallet! Your wallet balance is now ₹{{wallet_balance}}. Use it on your next visit! 💰",
            variables: ["customer_name", "amount", "wallet_balance"],
            created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "template-5",
            name: "Tier Upgrade",
            content: "Congratulations {{customer_name}}! 🎊 You've been upgraded to {{tier}} tier. Enjoy enhanced benefits and exclusive rewards at {{restaurant_name}}!",
            variables: ["customer_name", "tier", "restaurant_name"],
            created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
};

// WhatsApp automation rules
export const generateMockAutomationRules = () => {
    return [
        {
            id: "rule-1",
            event: "points_earned",
            template_id: "template-2",
            template_name: "Points Earned",
            is_enabled: true,
            delay_minutes: 5,
            created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "rule-2",
            event: "birthday",
            template_id: "template-3",
            template_name: "Birthday Wishes",
            is_enabled: true,
            delay_minutes: 0,
            created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "rule-3",
            event: "wallet_credit",
            template_id: "template-4",
            template_name: "Wallet Credit",
            is_enabled: true,
            delay_minutes: 2,
            created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "rule-4",
            event: "tier_upgrade",
            template_id: "template-5",
            template_name: "Tier Upgrade",
            is_enabled: false,
            delay_minutes: 10,
            created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
};

// Loyalty settings
export const mockLoyaltySettings = {
    points_per_rupee: 1,
    redemption_rate: 1,
    min_points_to_redeem: 100,
    points_expiry_days: 365,
    birthday_bonus_points: 100,
    anniversary_bonus_points: 150,
    first_visit_bonus: 50,
    bronze_earning_percentage: 100,
    silver_earning_percentage: 110,
    gold_earning_percentage: 125,
    platinum_earning_percentage: 150,
    bronze_threshold: 0,
    silver_threshold: 5000,
    gold_threshold: 15000,
    platinum_threshold: 30000,
    off_peak_hours_start: "14:00",
    off_peak_hours_end: "17:00",
    off_peak_bonus_percentage: 20
};

// Generate analytics dashboard stats
export const generateMockAnalytics = (customers, pointsTransactions, feedback) => {
    const totalCustomers = customers.length;
    const newCustomers7d = customers.filter(c => {
        const daysDiff = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
    }).length;
    
    const activeCustomers30d = customers.filter(c => {
        const daysDiff = (Date.now() - new Date(c.last_visit).getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
    }).length;
    
    const totalPointsIssued = pointsTransactions
        .filter(t => t.type === "earned" || t.type === "bonus")
        .reduce((sum, t) => sum + Math.abs(t.points), 0);
    
    const totalPointsRedeemed = pointsTransactions
        .filter(t => t.type === "redeemed")
        .reduce((sum, t) => sum + Math.abs(t.points), 0);
    
    const avgRating = feedback.length > 0
        ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
        : "N/A";
    
    return {
        total_customers: totalCustomers,
        new_customers_7d: newCustomers7d,
        active_customers_30d: activeCustomers30d,
        total_points_issued: totalPointsIssued,
        total_points_redeemed: totalPointsRedeemed,
        avg_rating: avgRating
    };
};

// Generate segment stats
export const generateMockSegmentStats = (customers) => {
    const byTier = {
        bronze: customers.filter(c => c.tier === "Bronze").length,
        silver: customers.filter(c => c.tier === "Silver").length,
        gold: customers.filter(c => c.tier === "Gold").length,
        platinum: customers.filter(c => c.tier === "Platinum").length
    };
    
    const byType = {
        normal: customers.filter(c => c.customer_type === "normal").length,
        corporate: customers.filter(c => c.customer_type === "corporate").length
    };
    
    const inactive30Days = customers.filter(c => {
        const daysDiff = (Date.now() - new Date(c.last_visit).getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff >= 30;
    }).length;
    
    return {
        total: customers.length,
        by_tier: byTier,
        by_type: byType,
        inactive_30_days: inactive30Days
    };
};

// WhatsApp automation events
export const whatsappAutomationEvents = [
    { id: "points_earned", name: "Points Earned", description: "When customer earns points" },
    { id: "points_redeemed", name: "Points Redeemed", description: "When customer redeems points" },
    { id: "bonus_points", name: "Bonus Points", description: "When bonus points are awarded" },
    { id: "wallet_credit", name: "Wallet Credit", description: "When amount is credited to wallet" },
    { id: "wallet_debit", name: "Wallet Debit", description: "When amount is debited from wallet" },
    { id: "birthday", name: "Birthday", description: "On customer's birthday" },
    { id: "anniversary", name: "Anniversary", description: "On customer's anniversary" },
    { id: "first_visit", name: "First Visit", description: "On customer's first visit" },
    { id: "tier_upgrade", name: "Tier Upgrade", description: "When customer tier is upgraded" },
    { id: "coupon_earned", name: "Coupon Earned", description: "When customer earns a coupon" },
    { id: "points_expiring", name: "Points Expiring", description: "When points are about to expire" },
    { id: "feedback_received", name: "Feedback Received", description: "After customer submits feedback" },
    { id: "inactive_reminder", name: "Inactive Reminder", description: "For inactive customers" }
];

// Initialize all mock data
export const initializeMockData = () => {
    const customers = generateMockCustomers();
    const pointsTransactions = generateMockPointsTransactions(customers);
    const walletTransactions = generateMockWalletTransactions(customers);
    const coupons = generateMockCoupons();
    const segments = generateMockSegments();
    const feedback = generateMockFeedback(customers);
    const whatsappTemplates = generateMockWhatsAppTemplates();
    const automationRules = generateMockAutomationRules();
    const analytics = generateMockAnalytics(customers, pointsTransactions, feedback);
    const segmentStats = generateMockSegmentStats(customers);
    
    return {
        user: demoUser,
        customers,
        pointsTransactions,
        walletTransactions,
        coupons,
        segments,
        feedback,
        whatsappTemplates,
        automationRules,
        loyaltySettings: mockLoyaltySettings,
        analytics,
        segmentStats,
        whatsappAutomationEvents
    };
};
