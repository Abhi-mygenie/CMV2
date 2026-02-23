import { createContext, useContext, useState, useEffect } from 'react';
import { initializeMockData } from '../data/mockData';

const DemoContext = createContext(null);

export const useDemoMode = () => {
    const context = useContext(DemoContext);
    if (!context) {
        throw new Error('useDemoMode must be used within DemoProvider');
    }
    return context;
};

export const DemoProvider = ({ children }) => {
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [demoData, setDemoData] = useState(null);

    // Initialize demo data when demo mode is enabled
    useEffect(() => {
        if (isDemoMode && !demoData) {
            const data = initializeMockData();
            setDemoData(data);
        }
    }, [isDemoMode]);

    const enableDemoMode = () => {
        const data = initializeMockData();
        setDemoData(data);
        setIsDemoMode(true);
        localStorage.setItem('demo_mode', 'true');
    };

    const disableDemoMode = () => {
        setIsDemoMode(false);
        setDemoData(null);
        localStorage.removeItem('demo_mode');
    };

    // Update functions for demo data
    const updateDemoData = (key, value) => {
        setDemoData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Customer operations
    const addCustomer = (customer) => {
        const newCustomer = {
            ...customer,
            id: `customer-${Date.now()}`,
            total_points: 0,
            total_spent: 0,
            visits: 0,
            tier: 'Bronze',
            wallet_balance: 0,
            created_at: new Date().toISOString(),
            last_visit: new Date().toISOString()
        };
        updateDemoData('customers', [...demoData.customers, newCustomer]);
        return newCustomer;
    };

    const updateCustomer = (id, updates) => {
        const customers = demoData.customers.map(c => 
            c.id === id ? { ...c, ...updates } : c
        );
        updateDemoData('customers', customers);
    };

    const deleteCustomer = (id) => {
        const customers = demoData.customers.filter(c => c.id !== id);
        updateDemoData('customers', customers);
    };

    // Points transaction operations
    const addPointsTransaction = (transaction) => {
        const newTransaction = {
            ...transaction,
            id: `points-${Date.now()}`,
            created_at: new Date().toISOString()
        };
        updateDemoData('pointsTransactions', [newTransaction, ...demoData.pointsTransactions]);
        
        // Update customer points
        const customer = demoData.customers.find(c => c.id === transaction.customer_id);
        if (customer) {
            updateCustomer(customer.id, {
                total_points: customer.total_points + transaction.points,
                last_visit: new Date().toISOString(),
                visits: customer.visits + 1
            });
        }
        
        return newTransaction;
    };

    // Wallet transaction operations
    const addWalletTransaction = (transaction) => {
        const newTransaction = {
            ...transaction,
            id: `wallet-${Date.now()}`,
            created_at: new Date().toISOString()
        };
        updateDemoData('walletTransactions', [newTransaction, ...demoData.walletTransactions]);
        
        // Update customer wallet balance
        const customer = demoData.customers.find(c => c.id === transaction.customer_id);
        if (customer) {
            const newBalance = customer.wallet_balance + transaction.amount + (transaction.bonus_amount || 0);
            updateCustomer(customer.id, { wallet_balance: newBalance });
        }
        
        return newTransaction;
    };

    // Coupon operations
    const addCoupon = (coupon) => {
        const newCoupon = {
            ...coupon,
            id: `coupon-${Date.now()}`,
            used_count: 0,
            created_at: new Date().toISOString()
        };
        updateDemoData('coupons', [...demoData.coupons, newCoupon]);
        return newCoupon;
    };

    const updateCoupon = (id, updates) => {
        const coupons = demoData.coupons.map(c => 
            c.id === id ? { ...c, ...updates } : c
        );
        updateDemoData('coupons', coupons);
    };

    const deleteCoupon = (id) => {
        const coupons = demoData.coupons.filter(c => c.id !== id);
        updateDemoData('coupons', coupons);
    };

    // Segment operations
    const addSegment = (segment) => {
        const newSegment = {
            ...segment,
            id: `segment-${Date.now()}`,
            created_at: new Date().toISOString()
        };
        updateDemoData('segments', [...demoData.segments, newSegment]);
        return newSegment;
    };

    const deleteSegment = (id) => {
        const segments = demoData.segments.filter(s => s.id !== id);
        updateDemoData('segments', segments);
    };

    // Feedback operations
    const addFeedback = (feedback) => {
        const newFeedback = {
            ...feedback,
            id: `feedback-${Date.now()}`,
            created_at: new Date().toISOString()
        };
        updateDemoData('feedback', [newFeedback, ...demoData.feedback]);
        return newFeedback;
    };

    // WhatsApp template operations
    const addWhatsAppTemplate = (template) => {
        const newTemplate = {
            ...template,
            id: `template-${Date.now()}`,
            created_at: new Date().toISOString()
        };
        updateDemoData('whatsappTemplates', [...demoData.whatsappTemplates, newTemplate]);
        return newTemplate;
    };

    const updateWhatsAppTemplate = (id, updates) => {
        const templates = demoData.whatsappTemplates.map(t => 
            t.id === id ? { ...t, ...updates } : t
        );
        updateDemoData('whatsappTemplates', templates);
    };

    const deleteWhatsAppTemplate = (id) => {
        const templates = demoData.whatsappTemplates.filter(t => t.id !== id);
        updateDemoData('whatsappTemplates', templates);
    };

    // Automation rule operations
    const addAutomationRule = (rule) => {
        const newRule = {
            ...rule,
            id: `rule-${Date.now()}`,
            created_at: new Date().toISOString()
        };
        updateDemoData('automationRules', [...demoData.automationRules, newRule]);
        return newRule;
    };

    const updateAutomationRule = (id, updates) => {
        const rules = demoData.automationRules.map(r => 
            r.id === id ? { ...r, ...updates } : r
        );
        updateDemoData('automationRules', rules);
    };

    const deleteAutomationRule = (id) => {
        const rules = demoData.automationRules.filter(r => r.id !== id);
        updateDemoData('automationRules', rules);
    };

    // Loyalty settings operations
    const updateLoyaltySettings = (updates) => {
        updateDemoData('loyaltySettings', { ...demoData.loyaltySettings, ...updates });
    };

    const value = {
        isDemoMode,
        demoData,
        enableDemoMode,
        disableDemoMode,
        // Customer operations
        addCustomer,
        updateCustomer,
        deleteCustomer,
        // Points operations
        addPointsTransaction,
        // Wallet operations
        addWalletTransaction,
        // Coupon operations
        addCoupon,
        updateCoupon,
        deleteCoupon,
        // Segment operations
        addSegment,
        deleteSegment,
        // Feedback operations
        addFeedback,
        // WhatsApp operations
        addWhatsAppTemplate,
        updateWhatsAppTemplate,
        deleteWhatsAppTemplate,
        addAutomationRule,
        updateAutomationRule,
        deleteAutomationRule,
        // Settings operations
        updateLoyaltySettings
    };

    return (
        <DemoContext.Provider value={value}>
            {children}
        </DemoContext.Provider>
    );
};
