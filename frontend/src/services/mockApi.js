// Mock API service for demo mode
// This intercepts all API calls when in demo mode and returns mock data

export class MockApiService {
    constructor(demoData, demoOperations) {
        this.data = demoData;
        this.ops = demoOperations;
    }

    // Simulate API delay
    delay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Auth endpoints
    async authMe() {
        await this.delay(200);
        return { data: this.data.user };
    }

    async authLogin(email, password) {
        await this.delay(300);
        return {
            data: {
                access_token: 'demo-token',
                user: this.data.user
            }
        };
    }

    // Customer endpoints
    async getCustomers(params = {}) {
        await this.delay();
        let customers = [...this.data.customers];

        // Apply search filter
        if (params.search) {
            const search = params.search.toLowerCase();
            customers = customers.filter(c => 
                c.name.toLowerCase().includes(search) ||
                c.phone.includes(search) ||
                (c.email && c.email.toLowerCase().includes(search))
            );
        }

        // Apply tier filter
        if (params.tier && params.tier !== 'all') {
            customers = customers.filter(c => c.tier === params.tier);
        }

        // Apply customer type filter
        if (params.customer_type && params.customer_type !== 'all') {
            customers = customers.filter(c => c.customer_type === params.customer_type);
        }

        // Apply last visit filter
        if (params.last_visit_days && params.last_visit_days !== 'all') {
            const days = parseInt(params.last_visit_days);
            const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            customers = customers.filter(c => new Date(c.last_visit) < cutoffDate);
        }

        // Apply city filter
        if (params.city) {
            customers = customers.filter(c => c.city === params.city);
        }

        // Sort customers
        const sortBy = params.sort_by || 'created_at';
        const sortOrder = params.sort_order || 'desc';
        customers.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            if (sortBy === 'created_at' || sortBy === 'last_visit') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }
            if (sortOrder === 'desc') {
                return bVal > aVal ? 1 : -1;
            } else {
                return aVal > bVal ? 1 : -1;
            }
        });

        // Apply limit
        if (params.limit) {
            customers = customers.slice(0, parseInt(params.limit));
        }

        return { data: customers };
    }

    async getCustomer(id) {
        await this.delay();
        const customer = this.data.customers.find(c => c.id === id);
        if (!customer) throw new Error('Customer not found');
        return { data: customer };
    }

    async createCustomer(data) {
        await this.delay(400);
        const customer = this.ops.addCustomer(data);
        return { data: customer };
    }

    async updateCustomer(id, data) {
        await this.delay(400);
        this.ops.updateCustomer(id, data);
        const customer = this.data.customers.find(c => c.id === id);
        return { data: customer };
    }

    async deleteCustomer(id) {
        await this.delay(300);
        this.ops.deleteCustomer(id);
        return { data: { message: 'Customer deleted' } };
    }

    // Segment stats
    async getSegmentStats() {
        await this.delay();
        return { data: this.data.segmentStats };
    }

    // Segments
    async getSegments() {
        await this.delay();
        // Calculate customer count for each segment
        const segments = this.data.segments.map(segment => {
            const filters = segment.filters;
            let count = this.data.customers.length;

            if (filters.tier) {
                count = this.data.customers.filter(c => c.tier === filters.tier).length;
            }
            if (filters.customer_type) {
                count = this.data.customers.filter(c => c.customer_type === filters.customer_type).length;
            }
            if (filters.last_visit_days) {
                const days = parseInt(filters.last_visit_days);
                const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
                count = this.data.customers.filter(c => new Date(c.last_visit) < cutoffDate).length;
            }

            return { ...segment, customer_count: count };
        });
        return { data: segments };
    }

    async createSegment(data) {
        await this.delay(400);
        const segment = this.ops.addSegment(data);
        return { data: segment };
    }

    async deleteSegment(id) {
        await this.delay(300);
        this.ops.deleteSegment(id);
        return { data: { message: 'Segment deleted' } };
    }

    // Points transactions
    async getPointsTransactions(customerId) {
        await this.delay();
        const transactions = customerId
            ? this.data.pointsTransactions.filter(t => t.customer_id === customerId)
            : this.data.pointsTransactions;
        return { data: transactions };
    }

    async createPointsTransaction(data) {
        await this.delay(400);
        const transaction = this.ops.addPointsTransaction(data);
        return { data: transaction };
    }

    // Wallet transactions
    async getWalletTransactions(customerId) {
        await this.delay();
        const transactions = customerId
            ? this.data.walletTransactions.filter(t => t.customer_id === customerId)
            : this.data.walletTransactions;
        return { data: transactions };
    }

    async createWalletTransaction(data) {
        await this.delay(400);
        const transaction = this.ops.addWalletTransaction(data);
        return { data: transaction };
    }

    // Coupons
    async getCoupons() {
        await this.delay();
        return { data: this.data.coupons };
    }

    async createCoupon(data) {
        await this.delay(400);
        const coupon = this.ops.addCoupon(data);
        return { data: coupon };
    }

    async updateCoupon(id, data) {
        await this.delay(400);
        this.ops.updateCoupon(id, data);
        const coupon = this.data.coupons.find(c => c.id === id);
        return { data: coupon };
    }

    async deleteCoupon(id) {
        await this.delay(300);
        this.ops.deleteCoupon(id);
        return { data: { message: 'Coupon deleted' } };
    }

    // Feedback
    async getFeedback() {
        await this.delay();
        return { data: this.data.feedback };
    }

    async createFeedback(data) {
        await this.delay(400);
        const feedback = this.ops.addFeedback(data);
        return { data: feedback };
    }

    // WhatsApp templates
    async getWhatsAppTemplates() {
        await this.delay();
        return { data: this.data.whatsappTemplates };
    }

    async createWhatsAppTemplate(data) {
        await this.delay(400);
        const template = this.ops.addWhatsAppTemplate(data);
        return { data: template };
    }

    async updateWhatsAppTemplate(id, data) {
        await this.delay(400);
        this.ops.updateWhatsAppTemplate(id, data);
        const template = this.data.whatsappTemplates.find(t => t.id === id);
        return { data: template };
    }

    async deleteWhatsAppTemplate(id) {
        await this.delay(300);
        this.ops.deleteWhatsAppTemplate(id);
        return { data: { message: 'Template deleted' } };
    }

    // Automation rules
    async getAutomationRules() {
        await this.delay();
        return { data: this.data.automationRules };
    }

    async getAutomationEvents() {
        await this.delay();
        return { data: this.data.whatsappAutomationEvents };
    }

    async createAutomationRule(data) {
        await this.delay(400);
        const rule = this.ops.addAutomationRule(data);
        return { data: rule };
    }

    async updateAutomationRule(id, data) {
        await this.delay(400);
        this.ops.updateAutomationRule(id, data);
        const rule = this.data.automationRules.find(r => r.id === id);
        return { data: rule };
    }

    async toggleAutomationRule(id) {
        await this.delay(300);
        const rule = this.data.automationRules.find(r => r.id === id);
        if (rule) {
            this.ops.updateAutomationRule(id, { is_enabled: !rule.is_enabled });
            return { data: this.data.automationRules.find(r => r.id === id) };
        }
        throw new Error('Rule not found');
    }

    async deleteAutomationRule(id) {
        await this.delay(300);
        this.ops.deleteAutomationRule(id);
        return { data: { message: 'Rule deleted' } };
    }

    // Loyalty settings
    async getLoyaltySettings() {
        await this.delay();
        return { data: this.data.loyaltySettings };
    }

    async updateLoyaltySettings(data) {
        await this.delay(400);
        this.ops.updateLoyaltySettings(data);
        return { data: this.data.loyaltySettings };
    }

    // Analytics
    async getAnalytics() {
        await this.delay();
        return { data: this.data.analytics };
    }

    // QR Code
    async generateQR() {
        await this.delay();
        return { 
            data: { 
                qr_data: `https://demo.restaurant.com/register?ref=${this.data.user.id}`,
                url: `https://demo.restaurant.com/register?ref=${this.data.user.id}`
            } 
        };
    }
}

// Create mock API client
export const createMockApiClient = (demoData, demoOperations) => {
    const mockApi = new MockApiService(demoData, demoOperations);

    return {
        get: async (url, config) => {
            const [endpoint, ...rest] = url.split('?');
            const params = rest.length > 0 ? parseQueryString(rest.join('?')) : (config?.params || {});

            // Auth endpoints
            if (endpoint === '/auth/me') return mockApi.authMe();
            
            // Customer endpoints
            if (endpoint === '/customers') return mockApi.getCustomers(params);
            if (endpoint.startsWith('/customers/')) {
                const id = endpoint.split('/')[2];
                return mockApi.getCustomer(id);
            }
            if (endpoint === '/customers/segments/stats') return mockApi.getSegmentStats();
            
            // Segment endpoints
            if (endpoint === '/segments') return mockApi.getSegments();
            
            // Points endpoints
            if (endpoint.startsWith('/points')) {
                const customerId = params.customer_id;
                return mockApi.getPointsTransactions(customerId);
            }
            
            // Wallet endpoints
            if (endpoint.startsWith('/wallet')) {
                const customerId = params.customer_id;
                return mockApi.getWalletTransactions(customerId);
            }
            
            // Coupon endpoints
            if (endpoint === '/coupons') return mockApi.getCoupons();
            
            // Feedback endpoints
            if (endpoint === '/feedback') return mockApi.getFeedback();
            
            // WhatsApp endpoints
            if (endpoint === '/whatsapp/templates') return mockApi.getWhatsAppTemplates();
            if (endpoint === '/whatsapp/automation') return mockApi.getAutomationRules();
            if (endpoint === '/whatsapp/automation/events') return mockApi.getAutomationEvents();
            
            // Loyalty settings
            if (endpoint === '/loyalty/settings') return mockApi.getLoyaltySettings();
            
            // Analytics
            if (endpoint === '/analytics/dashboard') return mockApi.getAnalytics();
            
            // QR
            if (endpoint === '/qr/generate') return mockApi.generateQR();

            return { data: [] };
        },

        post: async (url, data) => {
            const endpoint = url.split('?')[0];

            // Auth endpoints
            if (endpoint === '/auth/login') return mockApi.authLogin(data.email, data.password);
            
            // Customer endpoints
            if (endpoint === '/customers') return mockApi.createCustomer(data);
            
            // Segment endpoints
            if (endpoint === '/segments') return mockApi.createSegment(data);
            
            // Points endpoints
            if (endpoint === '/points') return mockApi.createPointsTransaction(data);
            
            // Wallet endpoints
            if (endpoint === '/wallet') return mockApi.createWalletTransaction(data);
            
            // Coupon endpoints
            if (endpoint === '/coupons') return mockApi.createCoupon(data);
            
            // Feedback endpoints
            if (endpoint === '/feedback') return mockApi.createFeedback(data);
            
            // WhatsApp endpoints
            if (endpoint === '/whatsapp/templates') return mockApi.createWhatsAppTemplate(data);
            if (endpoint === '/whatsapp/automation') return mockApi.createAutomationRule(data);
            if (endpoint.includes('/whatsapp/automation/') && endpoint.endsWith('/toggle')) {
                const id = endpoint.split('/')[3];
                return mockApi.toggleAutomationRule(id);
            }

            return { data: {} };
        },

        put: async (url, data) => {
            const endpoint = url.split('?')[0];

            // Customer endpoints
            if (endpoint.startsWith('/customers/')) {
                const id = endpoint.split('/')[2];
                return mockApi.updateCustomer(id, data);
            }
            
            // Coupon endpoints
            if (endpoint.startsWith('/coupons/')) {
                const id = endpoint.split('/')[2];
                return mockApi.updateCoupon(id, data);
            }
            
            // WhatsApp endpoints
            if (endpoint.startsWith('/whatsapp/templates/')) {
                const id = endpoint.split('/')[3];
                return mockApi.updateWhatsAppTemplate(id, data);
            }
            if (endpoint.startsWith('/whatsapp/automation/')) {
                const id = endpoint.split('/')[3];
                return mockApi.updateAutomationRule(id, data);
            }
            
            // Loyalty settings
            if (endpoint === '/loyalty/settings') return mockApi.updateLoyaltySettings(data);

            return { data: {} };
        },

        delete: async (url) => {
            const endpoint = url.split('?')[0];

            // Customer endpoints
            if (endpoint.startsWith('/customers/')) {
                const id = endpoint.split('/')[2];
                return mockApi.deleteCustomer(id);
            }
            
            // Segment endpoints
            if (endpoint.startsWith('/segments/')) {
                const id = endpoint.split('/')[2];
                return mockApi.deleteSegment(id);
            }
            
            // Coupon endpoints
            if (endpoint.startsWith('/coupons/')) {
                const id = endpoint.split('/')[2];
                return mockApi.deleteCoupon(id);
            }
            
            // WhatsApp endpoints
            if (endpoint.startsWith('/whatsapp/templates/')) {
                const id = endpoint.split('/')[3];
                return mockApi.deleteWhatsAppTemplate(id);
            }
            if (endpoint.startsWith('/whatsapp/automation/')) {
                const id = endpoint.split('/')[3];
                return mockApi.deleteAutomationRule(id);
            }

            return { data: {} };
        }
    };
};

// Helper to parse query string
function parseQueryString(queryString) {
    const params = {};
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
}
