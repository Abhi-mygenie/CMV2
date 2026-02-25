import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { 
    Home, Users, QrCode, MessageSquare, Settings, 
    Plus, Search, ChevronRight, Star, TrendingUp,
    ArrowUpRight, ArrowDownRight, Gift, Phone, Mail,
    User, LogOut, Copy, Download, Check, X, Edit2, Trash2,
    Eye, EyeOff, Building2, Calendar, MapPin, Filter, Clock,
    AlertTriangle, ChevronDown, Tag, ChevronLeft, Percent, Save, Layers, Wallet, KeyRound
} from "lucide-react";
import { AuthProvider as AuthProviderComponent } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Country codes for phone
const COUNTRY_CODES = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+86", country: "China", flag: "🇨🇳" },
];

// Common allergies for restaurants
const COMMON_ALLERGIES = [
    "Gluten", "Dairy", "Eggs", "Peanuts", "Tree Nuts", 
    "Soy", "Fish", "Shellfish", "Sesame", "Mustard"
];

// Custom field 1 dropdown options (can be configured in POS later)
const CUSTOM_FIELD_1_OPTIONS = [
    "Dine-in",
    "Takeaway",
    "Delivery",
    "Corporate",
    "Event",
    "Other"
];

// Re-export useAuth from AuthContext
import { useAuth } from "@/contexts/AuthContext";

// Protected Route
const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
                <div className="animate-pulse text-[#F26B33] text-lg font-semibold">Loading...</div>
            </div>
        );
    }
    
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

// ============ AUTH PAGES ============

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const { login, demoLogin } = useAuth();
    const navigate = useNavigate();

    // Load saved credentials on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem("remembered_email");
        const savedPassword = localStorage.getItem("remembered_password");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Save or clear credentials based on remember me
            if (rememberMe) {
                localStorage.setItem("remembered_email", email);
                localStorage.setItem("remembered_password", password);
            } else {
                localStorage.removeItem("remembered_email");
                localStorage.removeItem("remembered_password");
            }
            await login(email, password);
            toast.success("Welcome back!");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setIsDemoLoading(true);
        try {
            await demoLogin();
            toast.success("Welcome to Demo Mode! 🎉");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Demo login failed");
        } finally {
            setIsDemoLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F7] flex flex-col justify-center p-6">
            <div className="max-w-sm mx-auto w-full">
                <div className="text-center mb-8">
                    <img 
                        src="https://customer-assets.emergentagent.com/job_dine-points-app/artifacts/acdjlx1x_mygenie_logo.svg" 
                        alt="MyGenie Logo" 
                        className="h-20 mx-auto"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="form-label">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="owner@restaurant.com"
                            className="h-12 rounded-xl"
                            required
                            data-testid="login-email-input"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="form-label">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="h-12 rounded-xl pr-12"
                                required
                                data-testid="login-password-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#52525B] transition-colors"
                                data-testid="toggle-password-visibility"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#F26B33] focus:ring-[#F26B33]"
                                data-testid="remember-me-checkbox"
                            />
                            <span className="text-sm text-[#52525B]">Remember me</span>
                        </label>
                        <button 
                            type="button"
                            onClick={() => toast.info("Please contact admin to reset your password")}
                            className="text-sm text-[#F26B33] font-medium hover:underline"
                            data-testid="forgot-password-btn"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-12 rounded-full bg-[#F26B33] hover:bg-[#D85A2A] text-white font-semibold active-scale"
                        disabled={isLoading}
                        data-testid="login-submit-btn"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#F9F9F7] text-[#52525B] font-medium">or</span>
                        </div>
                    </div>

                    {/* Demo Mode Button */}
                    <Button 
                        type="button"
                        onClick={handleDemoLogin}
                        className="w-full h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold active-scale shadow-lg"
                        disabled={isDemoLoading}
                        data-testid="demo-login-btn"
                    >
                        {isDemoLoading ? "Loading Demo..." : "🎭 Try Demo Mode"}
                    </Button>
                    <p className="text-xs text-center text-[#A1A1AA] mt-2">
                        Explore all features with pre-loaded demo data
                    </p>
                    
                    <div className="text-center mt-4">
                        <span className="text-sm text-[#52525B]">Don't have an account? </span>
                        <button 
                            type="button"
                            onClick={() => navigate("/register")}
                            className="text-sm text-[#F26B33] font-medium hover:underline"
                            data-testid="signup-link"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        restaurant_name: "",
        phone: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(formData);
            toast.success("Account created successfully!");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F7] flex flex-col justify-center p-6">
            <div className="max-w-sm mx-auto w-full">
                <div className="text-center mb-8">
                    <img 
                        src="https://customer-assets.emergentagent.com/job_dine-points-app/artifacts/acdjlx1x_mygenie_logo.svg" 
                        alt="MyGenie Logo" 
                        className="h-16 mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold text-[#1A1A1A] font-['Montserrat']">Join MyGenie</h1>
                    <p className="text-[#52525B] mt-2">Start your loyalty program today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="restaurant" className="form-label">Restaurant Name</Label>
                        <Input
                            id="restaurant"
                            value={formData.restaurant_name}
                            onChange={(e) => setFormData({...formData, restaurant_name: e.target.value})}
                            placeholder="Your Restaurant"
                            className="h-12 rounded-xl"
                            required
                            data-testid="register-restaurant-input"
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone" className="form-label">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="9876543210"
                            className="h-12 rounded-xl"
                            required
                            data-testid="register-phone-input"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email" className="form-label">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="owner@restaurant.com"
                            className="h-12 rounded-xl"
                            required
                            data-testid="register-email-input"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="form-label">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Create a password"
                            className="h-12 rounded-xl"
                            required
                            data-testid="register-password-input"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="w-full h-12 rounded-full bg-[#F26B33] hover:bg-[#D85A2A] text-white font-semibold active-scale"
                        disabled={isLoading}
                        data-testid="register-submit-btn"
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                </form>

                <p className="text-center mt-6 text-[#52525B]">
                    Already have an account?{" "}
                    <button 
                        onClick={() => navigate("/login")} 
                        className="text-[#F26B33] font-semibold"
                        data-testid="goto-login-btn"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
};

// ============ MAIN LAYOUT ============

// Demo Mode Banner Component
const DemoModeBanner = () => {
    const { isDemoMode } = useAuth();
    
    if (!isDemoMode) return null;
    
    return (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-center sticky top-0 z-50 shadow-md" data-testid="demo-mode-banner">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <span className="text-lg">🎭</span>
                <span>Demo Mode - Exploring with test data</span>
            </div>
        </div>
    );
};

const MobileLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const navItems = [
        { path: "/", icon: Home, label: "Home" },
        { path: "/customers", icon: Users, label: "Customers" },
        { path: "/segments", icon: Layers, label: "Segments" },
        { path: "/feedback", icon: MessageSquare, label: "Feedback" },
        { path: "/settings", icon: Settings, label: "Settings" }
    ];

    return (
        <div className="min-h-screen bg-[#F9F9F7] pb-20">
            <DemoModeBanner />
            {children}
            
            {/* Bottom Navigation */}
            <nav className="mobile-bottom-nav bottom-nav" data-testid="bottom-nav">
                <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`mobile-bottom-nav-item ${isActive ? "active" : ""}`}
                                data-testid={`nav-${item.label.toLowerCase()}`}
                            >
                                <Icon className="w-5 h-5" strokeWidth={1.5} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

// ============ DASHBOARD ============

const DashboardPage = () => {
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentCustomers, setRecentCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, customersRes] = await Promise.all([
                    api.get("/analytics/dashboard"),
                    api.get("/customers?limit=5")
                ]);
                setStats(statsRes.data);
                setRecentCustomers(customersRes.data);
            } catch (err) {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <MobileLayout>
                <div className="p-4 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-24 bg-gray-200 rounded-xl"></div>
                        <div className="h-24 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <div className="p-4 max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[#52525B] text-sm">Welcome back</p>
                        <h1 className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']" data-testid="restaurant-name">
                            {user?.restaurant_name}
                        </h1>
                    </div>
                    <Avatar className="w-10 h-10 bg-[#F26B33]">
                        <AvatarFallback className="bg-[#F26B33] text-white font-semibold">
                            {user?.restaurant_name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Hero Stats Card */}
                <Card className="loyalty-card-gradient text-white rounded-2xl mb-4 border-0 shadow-lg" data-testid="hero-stats-card">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">Total Customers</p>
                                <p className="text-4xl font-bold font-['Montserrat'] mt-1">{stats?.total_customers || 0}</p>
                            </div>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4 text-sm">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="font-medium">+{stats?.new_customers_7d || 0} this week</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="stats-card" data-testid="points-issued-card">
                        <div className="flex items-center gap-2 text-[#329937] mb-2">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Points Issued</span>
                        </div>
                        <p className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat'] points-display">
                            {stats?.total_points_issued?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="stats-card" data-testid="points-redeemed-card">
                        <div className="flex items-center gap-2 text-[#329937] mb-2">
                            <ArrowDownRight className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Redeemed</span>
                        </div>
                        <p className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat'] points-display">
                            {stats?.total_points_redeemed?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="stats-card" data-testid="active-customers-card">
                        <div className="flex items-center gap-2 text-[#F26B33] mb-2">
                            <Users className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Active (30d)</span>
                        </div>
                        <p className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']">
                            {stats?.active_customers_30d || 0}
                        </p>
                    </div>
                    <div className="stats-card" data-testid="avg-rating-card">
                        <div className="flex items-center gap-2 text-[#329937] mb-2">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-xs font-medium uppercase tracking-wider">Avg Rating</span>
                        </div>
                        <p className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']">
                            {stats?.avg_rating || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 font-['Montserrat']">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                        onClick={() => navigate("/customers", { state: { openAddModal: true }})}
                        className="quick-action-btn"
                        data-testid="quick-add-customer"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#F26B33]/10 flex items-center justify-center mb-2">
                            <Plus className="w-6 h-6 text-[#F26B33]" />
                        </div>
                        <span className="text-sm font-medium text-[#1A1A1A]">Add Customer</span>
                    </button>
                    <button 
                        onClick={() => navigate("/qr")}
                        className="quick-action-btn"
                        data-testid="quick-qr-code"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#329937]/10 flex items-center justify-center mb-2">
                            <QrCode className="w-6 h-6 text-[#329937]" />
                        </div>
                        <span className="text-sm font-medium text-[#1A1A1A]">Show QR</span>
                    </button>
                </div>

                {/* Recent Customers */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-[#1A1A1A] font-['Montserrat']">Recent Customers</h2>
                    <button 
                        onClick={() => navigate("/customers")}
                        className="text-sm text-[#F26B33] font-medium"
                        data-testid="view-all-customers"
                    >
                        View all
                    </button>
                </div>

                {recentCustomers.length === 0 ? (
                    <div className="empty-state">
                        <Users className="empty-state-icon" />
                        <p className="text-[#52525B]">No customers yet</p>
                        <Button 
                            onClick={() => navigate("/customers", { state: { openAddModal: true }})}
                            className="mt-4 bg-[#F26B33] hover:bg-[#D85A2A] rounded-full"
                            data-testid="add-first-customer"
                        >
                            Add your first customer
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentCustomers.map((customer) => (
                            <button
                                key={customer.id}
                                onClick={() => navigate(`/customers/${customer.id}`)}
                                className="customer-list-item w-full text-left"
                                data-testid={`customer-item-${customer.id}`}
                            >
                                <Avatar className="w-10 h-10 mr-3">
                                    <AvatarFallback className="bg-[#329937]/10 text-[#329937] font-semibold">
                                        {customer.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[#1A1A1A] truncate">{customer.name}</p>
                                    <p className="text-sm text-[#52525B]">{customer.phone}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-[#329937] points-display">{customer.total_points}</p>
                                    <Badge variant="outline" className={`tier-badge ${customer.tier.toLowerCase()}`}>
                                        {customer.tier}
                                    </Badge>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </MobileLayout>
    );
};

// ============ CUSTOMERS PAGE ============

const CustomersPage = () => {
    const { api, isDemoMode } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(location.state?.openAddModal || false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [segments, setSegments] = useState(null);
    const [filters, setFilters] = useState({
        tier: "all",
        customer_type: "all",
        last_visit_days: "all",
        city: "",
        sort_by: "created_at",
        sort_order: "desc"
    });
    const [newCustomer, setNewCustomer] = useState({ 
        name: "", 
        phone: "", 
        country_code: "+91",
        email: "", 
        notes: "",
        dob: "",
        anniversary: "",
        customer_type: "normal",
        gst_name: "",
        gst_number: "",
        address: "",
        city: "",
        pincode: "",
        allergies: [],
        custom_field_1: "",
        custom_field_2: "",
        custom_field_3: ""
    });
    const [editData, setEditData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showSaveSegmentDialog, setShowSaveSegmentDialog] = useState(false);
    const [segmentName, setSegmentName] = useState("");
    const [savedSegments, setSavedSegments] = useState([]);
    const [selectedSegment, setSelectedSegment] = useState(null);

    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (filters.tier && filters.tier !== "all") params.append("tier", filters.tier);
        if (filters.customer_type && filters.customer_type !== "all") params.append("customer_type", filters.customer_type);
        if (filters.last_visit_days && filters.last_visit_days !== "all") params.append("last_visit_days", filters.last_visit_days);
        if (filters.city) params.append("city", filters.city);
        if (filters.sort_by) params.append("sort_by", filters.sort_by);
        if (filters.sort_order) params.append("sort_order", filters.sort_order);
        return params.toString();
    };

    const fetchCustomers = async () => {
        try {
            const queryString = buildQueryString();
            const res = await api.get(`/customers${queryString ? `?${queryString}` : ""}`);
            setCustomers(res.data);
        } catch (err) {
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const syncFromMyGenie = async () => {
        setSyncing(true);
        try {
            const res = await api.post("/customers/sync-from-mygenie");
            toast.success(res.data.message || "Customers synced successfully!");
            await fetchCustomers(); // Refresh the list
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to sync customers from MyGenie");
        } finally {
            setSyncing(false);
        }
    };

    const saveAsSegment = async () => {
        if (!segmentName.trim()) {
            toast.error("Please enter a segment name");
            return;
        }

        try {
            const segmentFilters = {
                tier: filters.tier !== "all" ? filters.tier : undefined,
                customer_type: filters.customer_type !== "all" ? filters.customer_type : undefined,
                last_visit_days: filters.last_visit_days !== "all" ? filters.last_visit_days : undefined,
                city: filters.city || undefined,
                search: search || undefined
            };

            // Remove undefined values
            Object.keys(segmentFilters).forEach(key => 
                segmentFilters[key] === undefined && delete segmentFilters[key]
            );

            await api.post('/segments', {
                name: segmentName,
                filters: segmentFilters
            });

            toast.success(`Segment "${segmentName}" saved successfully!`);
            setShowSaveSegmentDialog(false);
            setSegmentName("");
            fetchSegments();
        } catch (err) {
            toast.error("Failed to save segment");
        }
    };

    const loadSegment = async (segment) => {
        setSelectedSegment(segment);
        const segmentFilters = segment.filters;
        
        setFilters({
            tier: segmentFilters.tier || "all",
            customer_type: segmentFilters.customer_type || "all",
            last_visit_days: segmentFilters.last_visit_days || "all",
            city: segmentFilters.city || "",
            sort_by: "created_at",
            sort_order: "desc"
        });
        setSearch(segmentFilters.search || "");
    };

    const deleteSegment = async (segmentId) => {
        if (!window.confirm("Are you sure you want to delete this segment?")) return;
        
        try {
            await api.delete(`/segments/${segmentId}`);
            toast.success("Segment deleted");
            fetchSegments();
            if (selectedSegment?.id === segmentId) {
                setSelectedSegment(null);
            }
        } catch (err) {
            toast.error("Failed to delete segment");
        }
    };

    const fetchSegments = async () => {
        try {
            // Fetch segment stats for analytics
            const statsRes = await api.get("/customers/segments/stats");
            setSegments(statsRes.data);
            
            // Fetch saved segments for filtering
            const segmentsRes = await api.get('/segments');
            setSavedSegments(segmentsRes.data);
        } catch (err) {
            console.error("Failed to load segments:", err);
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchSegments();
    }, [search, filters]);

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const customerData = {
                name: newCustomer.name,
                phone: newCustomer.phone,
                country_code: newCustomer.country_code,
                email: newCustomer.email || null,
                notes: newCustomer.notes || null,
                dob: newCustomer.dob || null,
                anniversary: newCustomer.anniversary || null,
                customer_type: newCustomer.customer_type,
                gst_name: newCustomer.customer_type === "corporate" ? newCustomer.gst_name || null : null,
                gst_number: newCustomer.customer_type === "corporate" ? newCustomer.gst_number || null : null,
                address: newCustomer.address || null,
                city: newCustomer.city || null,
                pincode: newCustomer.pincode || null,
                allergies: newCustomer.allergies.length > 0 ? newCustomer.allergies : null,
                custom_field_1: newCustomer.custom_field_1 || null,
                custom_field_2: newCustomer.custom_field_2 || null,
                custom_field_3: newCustomer.custom_field_3 || null
            };
            await api.post("/customers", customerData);
            toast.success("Customer added!");
            setShowAddModal(false);
            resetForm();
            fetchCustomers();
            fetchSegments();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to add customer");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setNewCustomer({ 
            name: "", phone: "", country_code: "+91", email: "", notes: "",
            dob: "", anniversary: "", customer_type: "normal",
            gst_name: "", gst_number: "",
            address: "", city: "", pincode: "",
            allergies: [],
            custom_field_1: "", custom_field_2: "", custom_field_3: ""
        });
    };

    const clearFilters = () => {
        setFilters({
            tier: "all",
            customer_type: "all",
            last_visit_days: "all",
            city: "",
            sort_by: "created_at",
            sort_order: "desc"
        });
    };

    const activeFiltersCount = [
        filters.tier !== "all" ? 1 : 0,
        filters.customer_type !== "all" ? 1 : 0,
        filters.last_visit_days !== "all" ? 1 : 0,
        filters.city ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    const toggleAllergy = (allergy) => {
        if (newCustomer.allergies.includes(allergy)) {
            setNewCustomer({...newCustomer, allergies: newCustomer.allergies.filter(a => a !== allergy)});
        } else {
            setNewCustomer({...newCustomer, allergies: [...newCustomer.allergies, allergy]});
        }
    };

    const openEditModal = (customer, e) => {
        e.stopPropagation(); // Prevent navigation to detail page
        setEditingCustomer(customer);
        setEditData({
            name: customer.name,
            phone: customer.phone,
            country_code: customer.country_code || "+91",
            email: customer.email || "",
            dob: customer.dob || "",
            anniversary: customer.anniversary || "",
            customer_type: customer.customer_type || "normal",
            gst_name: customer.gst_name || "",
            gst_number: customer.gst_number || "",
            address: customer.address || "",
            city: customer.city || "",
            pincode: customer.pincode || "",
            notes: customer.notes || ""
        });
        setShowEditModal(true);
    };

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/customers/${editingCustomer.id}`, editData);
            toast.success("Customer updated successfully!");
            setShowEditModal(false);
            setEditingCustomer(null);
            fetchCustomers();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to update customer");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MobileLayout>
            <div className="p-4 max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']" data-testid="customers-title">
                        Customers
                    </h1>
                    <div className="flex gap-2">
                        {/* Sync button only shows when NOT in demo mode AND no customers exist */}
                        {!isDemoMode && !loading && customers.length === 0 && (
                            <Button 
                                onClick={syncFromMyGenie}
                                disabled={syncing}
                                variant="outline"
                                className="rounded-full h-10 px-4 border-[#329937] text-[#329937] hover:bg-[#329937]/10"
                                data-testid="sync-mygenie-btn"
                            >
                                {syncing ? (
                                    <>⏳ Syncing...</>
                                ) : (
                                    <>🔄 Sync MyGenie</>
                                )}
                            </Button>
                        )}
                        <Button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-[#F26B33] hover:bg-[#D85A2A] rounded-full h-10 px-4"
                            data-testid="add-customer-btn"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                    </div>
                </div>

                {/* Search & Filter Row */}
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                        <Input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input pl-12"
                            data-testid="customer-search-input"
                        />
                    </div>
                    <Popover open={showFilters} onOpenChange={setShowFilters}>
                        <PopoverTrigger asChild>
                            <Button 
                                variant="outline" 
                                className={`h-12 px-3 rounded-xl relative ${activeFiltersCount > 0 ? 'border-[#F26B33] text-[#F26B33]' : ''}`}
                                data-testid="filter-btn"
                            >
                                <Filter className="w-5 h-5" />
                                {activeFiltersCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F26B33] text-white text-xs rounded-full flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="end">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-[#1A1A1A]">Filters</h3>
                                    {activeFiltersCount > 0 && (
                                        <button onClick={clearFilters} className="text-sm text-[#F26B33]">Clear all</button>
                                    )}
                                </div>
                                
                                <div>
                                    <Label className="text-xs text-[#52525B]">Tier</Label>
                                    <Select value={filters.tier} onValueChange={(v) => setFilters({...filters, tier: v})}>
                                        <SelectTrigger className="h-10 mt-1">
                                            <SelectValue placeholder="All tiers" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All tiers</SelectItem>
                                            <SelectItem value="Bronze">Bronze</SelectItem>
                                            <SelectItem value="Silver">Silver</SelectItem>
                                            <SelectItem value="Gold">Gold</SelectItem>
                                            <SelectItem value="Platinum">Platinum</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs text-[#52525B]">Customer Type</Label>
                                    <Select value={filters.customer_type} onValueChange={(v) => setFilters({...filters, customer_type: v})}>
                                        <SelectTrigger className="h-10 mt-1">
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All types</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="corporate">Corporate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs text-[#52525B]">Inactive For (Win-back)</Label>
                                    <Select value={filters.last_visit_days} onValueChange={(v) => setFilters({...filters, last_visit_days: v})}>
                                        <SelectTrigger className="h-10 mt-1">
                                            <SelectValue placeholder="All customers" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All customers</SelectItem>
                                            <SelectItem value="7">7+ days</SelectItem>
                                            <SelectItem value="14">14+ days</SelectItem>
                                            <SelectItem value="30">30+ days</SelectItem>
                                            <SelectItem value="60">60+ days</SelectItem>
                                            <SelectItem value="90">90+ days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs text-[#52525B]">Sort By</Label>
                                    <Select value={filters.sort_by} onValueChange={(v) => setFilters({...filters, sort_by: v})}>
                                        <SelectTrigger className="h-10 mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="created_at">Date Added</SelectItem>
                                            <SelectItem value="last_visit">Last Visit</SelectItem>
                                            <SelectItem value="total_spent">Total Spent</SelectItem>
                                            <SelectItem value="total_points">Points</SelectItem>
                                            <SelectItem value="name">Name</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {segments && (
                                    <div className="pt-2 border-t">
                                        <p className="text-xs font-semibold text-[#52525B] mb-2">Quick Segments</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge 
                                                variant="outline" 
                                                className="cursor-pointer hover:bg-[#F26B33]/10"
                                                onClick={() => setFilters({...filters, last_visit_days: "30"})}
                                            >
                                                <Clock className="w-3 h-3 mr-1" /> Inactive 30d ({segments.inactive_30_days})
                                            </Badge>
                                            <Badge 
                                                variant="outline" 
                                                className="cursor-pointer hover:bg-[#F26B33]/10"
                                                onClick={() => setFilters({...filters, tier: "Gold"})}
                                            >
                                                Gold ({segments.by_tier?.gold || 0})
                                            </Badge>
                                            <Badge 
                                                variant="outline" 
                                                className="cursor-pointer hover:bg-[#F26B33]/10"
                                                onClick={() => setFilters({...filters, customer_type: "corporate"})}
                                            >
                                                <Building2 className="w-3 h-3 mr-1" /> Corporate ({segments.by_type?.corporate || 0})
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {/* Save as Segment Button */}
                                {activeFiltersCount > 0 && (
                                    <div className="pt-3 border-t">
                                        <Button 
                                            onClick={() => {
                                                setShowSaveSegmentDialog(true);
                                                setShowFilters(false); // Close filter popup
                                            }}
                                            className="w-full h-9 text-xs bg-[#F26B33] hover:bg-[#D85A2A]"
                                            data-testid="save-segment-btn"
                                        >
                                            <Save className="w-3 h-3 mr-1" /> Save as Segment
                                        </Button>
                                    </div>
                                )}

                                {/* Saved Segments */}
                                {savedSegments.length > 0 && (
                                    <div className="pt-3 border-t">
                                        <p className="text-xs font-semibold text-[#52525B] mb-2">Saved Segments</p>
                                        <div className="space-y-2">
                                            {savedSegments.map(segment => (
                                                <div key={segment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                    <button
                                                        onClick={() => {
                                                            loadSegment(segment);
                                                            setShowFilters(false);
                                                        }}
                                                        className="flex-1 text-left"
                                                    >
                                                        <p className="text-xs font-medium text-[#1A1A1A]">{segment.name}</p>
                                                        <p className="text-[10px] text-[#52525B]">{segment.customer_count} customers</p>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSegment(segment.id)}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Save Segment Dialog */}
                {showSaveSegmentDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSaveSegmentDialog(false)}>
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-semibold mb-4">Save Segment</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Segment Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="e.g., VIP Customers"
                                        value={segmentName}
                                        onChange={(e) => setSegmentName(e.target.value)}
                                        className="mt-1 h-11 rounded-xl"
                                        data-testid="segment-name-input"
                                    />
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-[#52525B] mb-2">Current Filters:</p>
                                    <div className="space-y-1 text-xs text-[#1A1A1A]">
                                        {filters.tier !== "all" && <p>• Tier: {filters.tier}</p>}
                                        {filters.customer_type !== "all" && <p>• Type: {filters.customer_type}</p>}
                                        {filters.last_visit_days !== "all" && <p>• Last Visit: {filters.last_visit_days} days</p>}
                                        {filters.city && <p>• City: {filters.city}</p>}
                                        {search && <p>• Search: {search}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowSaveSegmentDialog(false);
                                            setSegmentName("");
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={saveAsSegment}
                                        className="flex-1 bg-[#F26B33] hover:bg-[#D85A2A]"
                                        data-testid="save-segment-confirm-btn"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Segment Stats Bar */}
                {segments && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        <div className="flex-shrink-0 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-[#52525B]">
                            Total: {segments.total}
                        </div>
                        <div className="flex-shrink-0 px-3 py-1.5 bg-amber-50 rounded-full text-xs font-medium text-amber-700">
                            Bronze: {segments.by_tier?.bronze || 0}
                        </div>
                        <div className="flex-shrink-0 px-3 py-1.5 bg-gray-200 rounded-full text-xs font-medium text-gray-700">
                            Silver: {segments.by_tier?.silver || 0}
                        </div>
                        <div className="flex-shrink-0 px-3 py-1.5 bg-yellow-50 rounded-full text-xs font-medium text-yellow-700">
                            Gold: {segments.by_tier?.gold || 0}
                        </div>
                    </div>
                )}

                {/* Customer List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="customer-list-item animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : customers.length === 0 ? (
                    <div className="empty-state">
                        <Users className="empty-state-icon" />
                        <p className="text-[#52525B]">{search || activeFiltersCount > 0 ? "No customers found" : "No customers yet"}</p>
                        {!search && activeFiltersCount === 0 && (
                            <Button 
                                onClick={() => setShowAddModal(true)}
                                className="mt-4 bg-[#F26B33] hover:bg-[#D85A2A] rounded-full"
                            >
                                Add your first customer
                            </Button>
                        )}
                        {activeFiltersCount > 0 && (
                            <Button 
                                onClick={clearFilters}
                                variant="outline"
                                className="mt-4 rounded-full"
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {customers.map((customer) => (
                            <div
                                key={customer.id}
                                className="customer-list-item w-full"
                                data-testid={`customer-row-${customer.id}`}
                            >
                                <Avatar className="w-10 h-10 mr-3">
                                    <AvatarFallback className={`font-semibold ${
                                        customer.customer_type === "corporate" 
                                            ? "bg-[#F26B33]/10 text-[#F26B33]" 
                                            : "bg-[#329937]/10 text-[#329937]"
                                    }`}>
                                        {customer.customer_type === "corporate" ? <Building2 className="w-5 h-5" /> : customer.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-[#1A1A1A] truncate">{customer.name}</p>
                                        <button
                                            onClick={(e) => openEditModal(customer, e)}
                                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#F26B33]/10 transition-colors"
                                            data-testid={`edit-customer-list-${customer.id}`}
                                        >
                                            <Edit2 className="w-3 h-3 text-[#52525B]" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-[#52525B]">{customer.country_code || '+91'} {customer.phone}</p>
                                </div>
                                <button 
                                    onClick={() => navigate(`/customers/${customer.id}`)}
                                    className="text-right flex items-center gap-3"
                                >
                                    <div className="text-right">
                                        <p className="font-semibold text-[#329937] points-display">{customer.total_points}</p>
                                        <Badge variant="outline" className={`tier-badge ${customer.tier.toLowerCase()}`}>
                                            {customer.tier}
                                        </Badge>
                                    </div>
                                    {customer.wallet_balance > 0 && (
                                        <div className="text-right border-l pl-3 border-gray-200">
                                            <p className="font-semibold text-[#F26B33]">₹{customer.wallet_balance.toLocaleString()}</p>
                                            <p className="text-[10px] text-[#A1A1AA]">Wallet</p>
                                        </div>
                                    )}
                                    <ChevronRight className="w-5 h-5 text-[#A1A1AA]" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <Dialog open={showAddModal} onOpenChange={(open) => { setShowAddModal(open); if (!open) resetForm(); }}>
                <DialogContent className="max-w-md mx-4 rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="font-['Montserrat']">Add New Customer</DialogTitle>
                        <DialogDescription>Enter customer details to start their loyalty journey.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddCustomer} className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[calc(90vh-200px)] pr-4">
                            <div className="space-y-4 py-4">
                                {/* Basic Info */}
                                <div>
                                    <Label htmlFor="name" className="form-label">Name *</Label>
                                    <Input
                                        id="name"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                        placeholder="Customer name"
                                        className="h-12 rounded-xl"
                                        required
                                        data-testid="new-customer-name"
                                    />
                                </div>
                                
                                {/* Phone with Country Code */}
                                <div>
                                    <Label htmlFor="phone" className="form-label">Phone *</Label>
                                    <div className="flex gap-2">
                                        <Select 
                                            value={newCustomer.country_code} 
                                            onValueChange={(v) => setNewCustomer({...newCustomer, country_code: v})}
                                        >
                                            <SelectTrigger className="w-28 h-12 rounded-xl" data-testid="country-code-select">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {COUNTRY_CODES.map(cc => (
                                                    <SelectItem key={cc.code} value={cc.code}>
                                                        {cc.flag} {cc.code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={newCustomer.phone}
                                            onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value.replace(/\D/g, '')})}
                                            placeholder="9876543210"
                                            className="h-12 rounded-xl flex-1"
                                            required
                                            maxLength={10}
                                            data-testid="new-customer-phone"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email" className="form-label">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                        placeholder="customer@email.com"
                                        className="h-12 rounded-xl"
                                        data-testid="new-customer-email"
                                    />
                                </div>

                                {/* Date Fields */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="dob" className="form-label flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" /> Date of Birth
                                        </Label>
                                        <Input
                                            id="dob"
                                            type="date"
                                            value={newCustomer.dob}
                                            onChange={(e) => setNewCustomer({...newCustomer, dob: e.target.value})}
                                            className="h-12 rounded-xl"
                                            data-testid="new-customer-dob"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="anniversary" className="form-label flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" /> Anniversary
                                        </Label>
                                        <Input
                                            id="anniversary"
                                            type="date"
                                            value={newCustomer.anniversary}
                                            onChange={(e) => setNewCustomer({...newCustomer, anniversary: e.target.value})}
                                            className="h-12 rounded-xl"
                                            data-testid="new-customer-anniversary"
                                        />
                                    </div>
                                </div>

                                {/* Customer Type */}
                                <div>
                                    <Label className="form-label">Customer Type</Label>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setNewCustomer({...newCustomer, customer_type: "normal", gst_name: "", gst_number: ""})}
                                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all flex items-center justify-center gap-2 ${
                                                newCustomer.customer_type === "normal"
                                                    ? "bg-[#329937] text-white border-[#329937]"
                                                    : "bg-white text-[#52525B] border-gray-200 hover:border-[#329937]"
                                            }`}
                                            data-testid="customer-type-normal"
                                        >
                                            <User className="w-4 h-4" /> Normal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewCustomer({...newCustomer, customer_type: "corporate"})}
                                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all flex items-center justify-center gap-2 ${
                                                newCustomer.customer_type === "corporate"
                                                    ? "bg-[#F26B33] text-white border-[#F26B33]"
                                                    : "bg-white text-[#52525B] border-gray-200 hover:border-[#F26B33]"
                                            }`}
                                            data-testid="customer-type-corporate"
                                        >
                                            <Building2 className="w-4 h-4" /> Corporate
                                        </button>
                                    </div>
                                </div>

                                {/* GST Fields (for Corporate) */}
                                {newCustomer.customer_type === "corporate" && (
                                    <div className="space-y-4 p-4 bg-[#F26B33]/5 rounded-xl border border-[#F26B33]/20">
                                        <p className="text-xs font-semibold text-[#F26B33] uppercase tracking-wider">GST Details</p>
                                        <div>
                                            <Label htmlFor="gst_name" className="form-label">GST Name</Label>
                                            <Input
                                                id="gst_name"
                                                value={newCustomer.gst_name}
                                                onChange={(e) => setNewCustomer({...newCustomer, gst_name: e.target.value})}
                                                placeholder="Company/Business name"
                                                className="h-12 rounded-xl"
                                                data-testid="new-customer-gst-name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gst_number" className="form-label">GST Number</Label>
                                            <Input
                                                id="gst_number"
                                                value={newCustomer.gst_number}
                                                onChange={(e) => setNewCustomer({...newCustomer, gst_number: e.target.value.toUpperCase()})}
                                                placeholder="22AAAAA0000A1Z5"
                                                className="h-12 rounded-xl font-mono"
                                                maxLength={15}
                                                data-testid="new-customer-gst-number"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Allergies */}
                                <div>
                                    <Label className="form-label flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" /> Allergies
                                    </Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {COMMON_ALLERGIES.map((allergy) => (
                                            <button
                                                key={allergy}
                                                type="button"
                                                onClick={() => toggleAllergy(allergy)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                                    newCustomer.allergies.includes(allergy)
                                                        ? "bg-red-500 text-white border-red-500"
                                                        : "bg-white text-[#52525B] border-gray-200 hover:border-red-300"
                                                }`}
                                                data-testid={`allergy-${allergy.toLowerCase()}`}
                                            >
                                                {allergy}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address Section */}
                                <div className="space-y-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" /> Delivery Address (Optional)
                                    </p>
                                    <div>
                                        <Label htmlFor="address" className="form-label">Address</Label>
                                        <Textarea
                                            id="address"
                                            value={newCustomer.address}
                                            onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                                            placeholder="House/Flat No., Building, Street..."
                                            className="rounded-xl resize-none"
                                            rows={2}
                                            data-testid="new-customer-address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label htmlFor="city" className="form-label">City</Label>
                                            <Input
                                                id="city"
                                                value={newCustomer.city}
                                                onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                                                placeholder="City"
                                                className="h-10 rounded-lg"
                                                data-testid="new-customer-city"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="pincode" className="form-label">Pincode</Label>
                                            <Input
                                                id="pincode"
                                                value={newCustomer.pincode}
                                                onChange={(e) => setNewCustomer({...newCustomer, pincode: e.target.value.replace(/\D/g, '')})}
                                                placeholder="400001"
                                                className="h-10 rounded-lg"
                                                maxLength={6}
                                                data-testid="new-customer-pincode"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Fields - Always show 3 fields */}
                                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Additional Information</p>
                                    
                                    {/* Custom Field 1 - Dropdown */}
                                    <div>
                                        <Label className="form-label">Preference Type</Label>
                                        <Select 
                                            value={newCustomer.custom_field_1} 
                                            onValueChange={(v) => setNewCustomer({...newCustomer, custom_field_1: v})}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl" data-testid="new-customer-custom-1">
                                                <SelectValue placeholder="Select preference" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CUSTOM_FIELD_1_OPTIONS.map(opt => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Custom Field 2 - Text */}
                                    <div>
                                        <Label htmlFor="custom2" className="form-label">Department / Table</Label>
                                        <Input
                                            id="custom2"
                                            value={newCustomer.custom_field_2}
                                            onChange={(e) => setNewCustomer({...newCustomer, custom_field_2: e.target.value})}
                                            placeholder="e.g., HR, Table 5, VIP Section"
                                            className="h-12 rounded-xl"
                                            data-testid="new-customer-custom-2"
                                        />
                                    </div>

                                    {/* Custom Field 3 - Text */}
                                    <div>
                                        <Label htmlFor="custom3" className="form-label">Special Instructions</Label>
                                        <Input
                                            id="custom3"
                                            value={newCustomer.custom_field_3}
                                            onChange={(e) => setNewCustomer({...newCustomer, custom_field_3: e.target.value})}
                                            placeholder="Any special requests..."
                                            className="h-12 rounded-xl"
                                            data-testid="new-customer-custom-3"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <Label htmlFor="notes" className="form-label">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={newCustomer.notes}
                                        onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                                        placeholder="Any special notes..."
                                        className="rounded-xl resize-none"
                                        rows={2}
                                        data-testid="new-customer-notes"
                                    />
                                </div>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="gap-2 pt-4 border-t">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => { setShowAddModal(false); resetForm(); }}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-[#F26B33] hover:bg-[#D85A2A] rounded-full"
                                disabled={submitting}
                                data-testid="submit-new-customer"
                            >
                                {submitting ? "Adding..." : "Add Customer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Customer Modal */}
            <Dialog open={showEditModal} onOpenChange={(open) => { setShowEditModal(open); if (!open) setEditingCustomer(null); }}>
                <DialogContent className="max-w-md mx-4 rounded-2xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="font-['Montserrat']">Edit Customer</DialogTitle>
                        <DialogDescription>Update customer details</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCustomer}>
                        <ScrollArea className="h-[60vh] pr-4">
                            <div className="space-y-4 py-2">
                                <div>
                                    <Label className="form-label">Name *</Label>
                                    <Input
                                        value={editData.name || ""}
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        placeholder="Customer name"
                                        className="h-11 rounded-xl"
                                        required
                                        data-testid="edit-list-name-input"
                                    />
                                </div>
                                
                                <div>
                                    <Label className="form-label">Phone Number * (Unique)</Label>
                                    <div className="flex gap-2">
                                        <Select 
                                            value={editData.country_code || "+91"} 
                                            onValueChange={(v) => setEditData({...editData, country_code: v})}
                                        >
                                            <SelectTrigger className="w-24 h-11 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="+91">+91</SelectItem>
                                                <SelectItem value="+1">+1</SelectItem>
                                                <SelectItem value="+44">+44</SelectItem>
                                                <SelectItem value="+971">+971</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            value={editData.phone || ""}
                                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                            placeholder="9876543210"
                                            className="flex-1 h-11 rounded-xl"
                                            required
                                            data-testid="edit-list-phone-input"
                                        />
                                    </div>
                                    <p className="text-xs text-[#52525B] mt-1">Phone number must be unique</p>
                                </div>

                                <div>
                                    <Label className="form-label">Email</Label>
                                    <Input
                                        type="email"
                                        value={editData.email || ""}
                                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                                        placeholder="customer@email.com"
                                        className="h-11 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="form-label">Date of Birth</Label>
                                        <Input
                                            type="date"
                                            value={editData.dob || ""}
                                            onChange={(e) => setEditData({...editData, dob: e.target.value})}
                                            className="h-11 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <Label className="form-label">Anniversary</Label>
                                        <Input
                                            type="date"
                                            value={editData.anniversary || ""}
                                            onChange={(e) => setEditData({...editData, anniversary: e.target.value})}
                                            className="h-11 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="form-label">Customer Type</Label>
                                    <Select 
                                        value={editData.customer_type || "normal"} 
                                        onValueChange={(v) => setEditData({...editData, customer_type: v})}
                                    >
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="corporate">Corporate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {editData.customer_type === "corporate" && (
                                    <>
                                        <div>
                                            <Label className="form-label">GST Name</Label>
                                            <Input
                                                value={editData.gst_name || ""}
                                                onChange={(e) => setEditData({...editData, gst_name: e.target.value})}
                                                placeholder="Company Name"
                                                className="h-11 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label className="form-label">GST Number</Label>
                                            <Input
                                                value={editData.gst_number || ""}
                                                onChange={(e) => setEditData({...editData, gst_number: e.target.value})}
                                                placeholder="29ABCDE1234F1Z5"
                                                className="h-11 rounded-xl"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <Label className="form-label">City</Label>
                                    <Input
                                        value={editData.city || ""}
                                        onChange={(e) => setEditData({...editData, city: e.target.value})}
                                        placeholder="Mumbai"
                                        className="h-11 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <Label className="form-label">Address</Label>
                                    <Input
                                        value={editData.address || ""}
                                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                                        placeholder="Full address"
                                        className="h-11 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <Label className="form-label">Notes</Label>
                                    <Input
                                        value={editData.notes || ""}
                                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                                        placeholder="Any special notes..."
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="mt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => { setShowEditModal(false); setEditingCustomer(null); }}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="rounded-full bg-[#F26B33] hover:bg-[#D85A2A]"
                                disabled={submitting}
                                data-testid="save-edit-list-btn"
                            >
                                {submitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MobileLayout>
    );
};

// ============ CUSTOMER DETAIL PAGE ============

const CustomerDetailPage = () => {
    const { id } = useParams();
    const { api } = useAuth();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [walletTransactions, setWalletTransactions] = useState([]);
    const [expiringPoints, setExpiringPoints] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("points");
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [pointsAction, setPointsAction] = useState("earn");
    const [walletAction, setWalletAction] = useState("credit");
    const [pointsData, setPointsData] = useState({ points: "", bill_amount: "", description: "" });
    const [walletData, setWalletData] = useState({ amount: "", bonus: "", bonusType: "wallet", description: "", payment_method: "cash" });
    const [editData, setEditData] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [customerRes, txRes, walletTxRes, expiringRes] = await Promise.all([
                api.get(`/customers/${id}`),
                api.get(`/points/transactions/${id}`),
                api.get(`/wallet/transactions/${id}`),
                api.get(`/points/expiring/${id}`)
            ]);
            setCustomer(customerRes.data);
            setTransactions(txRes.data);
            setWalletTransactions(walletTxRes.data);
            setExpiringPoints(expiringRes.data);
        } catch (err) {
            toast.error("Customer not found");
            navigate("/customers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handlePointsTransaction = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/points/transaction", {
                customer_id: id,
                points: parseInt(pointsData.points),
                transaction_type: pointsAction,
                description: pointsData.description || `${pointsAction === "bonus" ? "Bonus points" : "Points redeemed"}`,
                bill_amount: null
            });
            toast.success(`Points ${pointsAction === "bonus" ? "awarded" : "redeemed"} successfully!`);
            setShowPointsModal(false);
            setPointsData({ points: "", bill_amount: "", description: "" });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Transaction failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleWalletTransaction = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const paidAmount = parseFloat(walletData.amount);
            const bonusAmount = walletAction === "credit" && walletData.bonus ? parseFloat(walletData.bonus) : 0;
            const bonusType = walletData.bonusType || "wallet";
            
            // Credit wallet with paid amount (+ bonus if bonus goes to wallet)
            const walletCredit = bonusType === "wallet" ? paidAmount + bonusAmount : paidAmount;
            
            await api.post("/wallet/transaction", {
                customer_id: id,
                amount: walletAction === "credit" ? walletCredit : paidAmount,
                transaction_type: walletAction,
                description: walletData.description || (walletAction === "credit" 
                    ? (bonusAmount > 0 && bonusType === "wallet" ? `Paid ₹${paidAmount} + Bonus ₹${bonusAmount}` : "Wallet recharge")
                    : "Payment made"),
                payment_method: walletData.payment_method
            });
            
            // If bonus goes to points, add points separately
            if (walletAction === "credit" && bonusAmount > 0 && bonusType === "points") {
                await api.post("/points/transaction", {
                    customer_id: id,
                    points: bonusAmount,
                    transaction_type: "bonus",
                    description: `Bonus points on wallet recharge of ₹${paidAmount}`
                });
            }
            
            if (walletAction === "credit" && bonusAmount > 0) {
                if (bonusType === "wallet") {
                    toast.success(`₹${walletCredit} added to wallet (₹${paidAmount} paid + ₹${bonusAmount} bonus)!`);
                } else {
                    toast.success(`₹${paidAmount} added to wallet + ${bonusAmount} bonus points!`);
                }
            } else {
                toast.success(`₹${paidAmount} ${walletAction === "credit" ? "added to" : "deducted from"} wallet!`);
            }
            setShowWalletModal(false);
            setWalletData({ amount: "", bonus: "", bonusType: "wallet", description: "", payment_method: "cash" });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Transaction failed");
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = () => {
        setEditData({
            name: customer.name,
            phone: customer.phone,
            country_code: customer.country_code || "+91",
            email: customer.email || "",
            dob: customer.dob || "",
            anniversary: customer.anniversary || "",
            customer_type: customer.customer_type || "normal",
            gst_name: customer.gst_name || "",
            gst_number: customer.gst_number || "",
            address: customer.address || "",
            city: customer.city || "",
            pincode: customer.pincode || "",
            allergies: customer.allergies || [],
            notes: customer.notes || ""
        });
        setShowEditModal(true);
    };

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/customers/${id}`, editData);
            toast.success("Customer updated successfully!");
            setShowEditModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to update customer");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <MobileLayout>
                <div className="p-4 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <div className="p-4 max-w-lg mx-auto">
                {/* Back Button */}
                <button 
                    onClick={() => navigate("/customers")}
                    className="flex items-center text-[#52525B] mb-4"
                    data-testid="back-to-customers"
                >
                    <ChevronRight className="w-5 h-5 rotate-180 mr-1" />
                    Back to Customers
                </button>

                {/* Customer Card */}
                <Card className="rounded-2xl mb-4 overflow-hidden border-0 shadow-md" data-testid="customer-profile-card">
                    <div className="loyalty-card-gradient p-5 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold font-['Montserrat']">{customer.name}</h1>
                                <div className="flex items-center gap-2 mt-1 text-white/80">
                                    <Phone className="w-4 h-4" />
                                    <span>{customer.phone}</span>
                                </div>
                                {customer.email && (
                                    <div className="flex items-center gap-2 mt-1 text-white/80">
                                        <Mail className="w-4 h-4" />
                                        <span>{customer.email}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={openEditModal}
                                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                                    data-testid="edit-customer-btn"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <Badge className={`tier-badge ${customer.tier.toLowerCase()} bg-white/20 border-0`}>
                                    {customer.tier}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    {/* Points & Wallet Summary */}
                    <CardContent className="p-4 bg-white">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-3 bg-[#329937]/10 rounded-xl">
                                <p className="text-xs text-[#52525B] uppercase tracking-wider">Points</p>
                                <p className="text-3xl font-bold text-[#329937] font-['Montserrat'] points-display" data-testid="customer-points">
                                    {customer.total_points.toLocaleString()}
                                </p>
                            </div>
                            <div className="text-center p-3 bg-[#F26B33]/10 rounded-xl">
                                <p className="text-xs text-[#52525B] uppercase tracking-wider">Wallet</p>
                                <p className="text-3xl font-bold text-[#F26B33] font-['Montserrat']" data-testid="customer-wallet">
                                    ₹{customer.wallet_balance?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>
                        
                        {/* Expiring Points Warning */}
                        {expiringPoints && expiringPoints.expiring_soon > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4" data-testid="expiring-points-warning">
                                <div className="flex items-start gap-2">
                                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-xs font-bold">!</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-amber-800">
                                            {expiringPoints.expiring_soon} points expiring soon
                                        </p>
                                        <p className="text-xs text-amber-600 mt-0.5">
                                            {expiringPoints.expiring_date && 
                                                `Expires on ${new Date(expiringPoints.expiring_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button 
                                onClick={() => { setPointsAction("bonus"); setShowPointsModal(true); }}
                                className="h-11 bg-[#329937] hover:bg-[#287A2D] rounded-full text-sm"
                                data-testid="add-points-btn"
                            >
                                <Gift className="w-4 h-4 mr-1" /> Give Bonus
                            </Button>
                            <Button 
                                onClick={() => { setWalletAction("credit"); setShowWalletModal(true); }}
                                className="h-11 bg-[#F26B33] hover:bg-[#D85A2A] rounded-full text-sm"
                                data-testid="add-wallet-btn"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Money
                            </Button>
                        </div>
                        {/* HIDDEN: Redeem and Use Wallet functionality - commented out as per requirement */}
                        {/* 
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <Button 
                                onClick={() => { setPointsAction("redeem"); setShowPointsModal(true); }}
                                variant="outline"
                                className="h-11 border-[#329937] text-[#329937] hover:bg-[#329937]/10 rounded-full text-sm"
                                disabled={customer.total_points === 0}
                                data-testid="redeem-points-btn"
                            >
                                <Gift className="w-4 h-4 mr-1" /> Redeem
                            </Button>
                            <Button 
                                onClick={() => { setWalletAction("debit"); setShowWalletModal(true); }}
                                variant="outline"
                                className="h-11 border-[#F26B33] text-[#F26B33] hover:bg-[#F26B33]/10 rounded-full text-sm"
                                disabled={!customer.wallet_balance || customer.wallet_balance === 0}
                                data-testid="debit-wallet-btn"
                            >
                                <ArrowDownRight className="w-4 h-4 mr-1" /> Use Wallet
                            </Button>
                        </div>
                        */}
                    </CardContent>
                </Card>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="stats-card text-center">
                        <p className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']">{customer.total_visits}</p>
                        <p className="text-xs text-[#52525B] uppercase tracking-wider">Visits</p>
                    </div>
                    <div className="stats-card text-center">
                        <p className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']">₹{customer.total_spent.toLocaleString()}</p>
                        <p className="text-xs text-[#52525B] uppercase tracking-wider">Total Spent</p>
                    </div>
                    <div className="stats-card text-center">
                        <p className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']">
                            {customer.last_visit ? new Date(customer.last_visit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "N/A"}
                        </p>
                        <p className="text-xs text-[#52525B] uppercase tracking-wider">Last Visit</p>
                    </div>
                </div>

                {/* Tabs for Points & Wallet History */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="points" data-testid="points-tab">Points History</TabsTrigger>
                        <TabsTrigger value="wallet" data-testid="wallet-tab">Wallet History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="points">
                        {transactions.length === 0 ? (
                            <div className="stats-card text-center py-8">
                                <p className="text-[#52525B]">No points transactions yet</p>
                            </div>
                        ) : (
                            <Card className="rounded-xl border-0 shadow-sm">
                                <CardContent className="p-4">
                                    {transactions.map((tx, index) => (
                                        <div key={tx.id} className={`transaction-item ${index === 0 ? "opacity-0 animate-fade-in" : ""}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    tx.transaction_type === "redeem" ? "bg-red-100" : "bg-green-100"
                                                }`}>
                                                    {tx.transaction_type === "redeem" ? (
                                                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                                                    ) : (
                                                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#1A1A1A] text-sm">{tx.description}</p>
                                                    <p className="text-xs text-[#A1A1AA]">
                                                        {new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`font-semibold points-display ${
                                                tx.transaction_type === "redeem" ? "transaction-redeem" : "transaction-earn"
                                            }`}>
                                                {tx.transaction_type === "redeem" ? "-" : "+"}{tx.points}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                    
                    <TabsContent value="wallet">
                        {walletTransactions.length === 0 ? (
                            <div className="stats-card text-center py-8">
                                <p className="text-[#52525B]">No wallet transactions yet</p>
                            </div>
                        ) : (
                            <Card className="rounded-xl border-0 shadow-sm">
                                <CardContent className="p-4">
                                    {walletTransactions.map((tx, index) => (
                                        <div key={tx.id} className={`transaction-item ${index === 0 ? "opacity-0 animate-fade-in" : ""}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    tx.transaction_type === "debit" ? "bg-red-100" : "bg-green-100"
                                                }`}>
                                                    {tx.transaction_type === "debit" ? (
                                                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                                                    ) : (
                                                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#1A1A1A] text-sm">{tx.description}</p>
                                                    <p className="text-xs text-[#A1A1AA]">
                                                        {tx.payment_method && <span className="uppercase">{tx.payment_method} • </span>}
                                                        {new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`font-semibold ${
                                                tx.transaction_type === "debit" ? "text-red-600" : "text-green-600"
                                            }`}>
                                                {tx.transaction_type === "debit" ? "-" : "+"}₹{tx.amount}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Points Modal */}
            <Dialog open={showPointsModal} onOpenChange={setShowPointsModal}>
                <DialogContent className="max-w-sm mx-4 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-['Montserrat']">
                            {pointsAction === "bonus" ? "Give Bonus Points" : "Redeem Points"}
                            {/* HIDDEN: Redeem button is hidden from UI but modal still works if triggered */}
                        </DialogTitle>
                        <DialogDescription>
                            {pointsAction === "bonus" 
                                ? "Award bonus points as a reward or gift" 
                                : `Available: ${customer?.total_points} points`
                            }
                            {/* HIDDEN: Redeem functionality - pointsAction="redeem" case still works but button is hidden from UI */}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePointsTransaction}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="points" className="form-label">Points *</Label>
                                <Input
                                    id="points"
                                    type="number"
                                    min="1"
                                    max={pointsAction === "redeem" ? customer?.total_points : undefined}
                                    value={pointsData.points}
                                    onChange={(e) => setPointsData({...pointsData, points: e.target.value})}
                                    placeholder="Enter points"
                                    className="h-12 rounded-xl"
                                    required
                                    data-testid="points-amount-input"
                                />
                            </div>
                            <div>
                                <Label htmlFor="desc" className="form-label">Reason / Note *</Label>
                                <Input
                                    id="desc"
                                    value={pointsData.description}
                                    onChange={(e) => setPointsData({...pointsData, description: e.target.value})}
                                    placeholder={pointsAction === "bonus" ? "Birthday gift, Loyalty reward, etc." : "Discount applied"}
                                    className="h-12 rounded-xl"
                                    required
                                    data-testid="points-description-input"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowPointsModal(false)}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className={`rounded-full ${pointsAction === "bonus" ? "bg-[#329937] hover:bg-[#287A2D]" : "bg-[#F26B33] hover:bg-[#D85A2A]"}`}
                                disabled={submitting}
                                data-testid="submit-points-btn"
                            >
                                {submitting ? "Processing..." : pointsAction === "bonus" ? "Give Points" : "Redeem"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Wallet Modal */}
            <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
                <DialogContent className="max-w-sm mx-4 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-['Montserrat']">
                            {walletAction === "credit" ? "Add Money to Wallet" : "Use Wallet Balance"}
                            {/* HIDDEN: Use Wallet button is hidden from UI but modal still works if triggered */}
                        </DialogTitle>
                        <DialogDescription>
                            Current balance: ₹{customer?.wallet_balance?.toLocaleString() || 0}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleWalletTransaction}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="amount" className="form-label">
                                    {walletAction === "credit" ? "Amount Paid (₹) *" : "Amount (₹) *"}
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="1"
                                    max={walletAction === "debit" ? customer?.wallet_balance : undefined}
                                    value={walletData.amount}
                                    onChange={(e) => setWalletData({...walletData, amount: e.target.value})}
                                    placeholder="Enter amount"
                                    className="h-12 rounded-xl"
                                    required
                                    data-testid="wallet-amount-input"
                                />
                            </div>
                            {walletAction === "credit" && (
                                <>
                                    <div>
                                        <Label htmlFor="bonus" className="form-label">Bonus Amount</Label>
                                        <Input
                                            id="bonus"
                                            type="number"
                                            min="0"
                                            value={walletData.bonus}
                                            onChange={(e) => setWalletData({...walletData, bonus: e.target.value})}
                                            placeholder="0"
                                            className="h-12 rounded-xl"
                                            data-testid="wallet-bonus-input"
                                        />
                                    </div>
                                    
                                    {/* Bonus Type Selector */}
                                    {walletData.bonus && parseFloat(walletData.bonus) > 0 && (
                                        <div>
                                            <Label className="form-label">Give Bonus As</Label>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setWalletData({...walletData, bonusType: "wallet"})}
                                                    className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                                                        walletData.bonusType === "wallet" 
                                                            ? "bg-[#329937]/10 text-[#329937] border-[#329937]" 
                                                            : "bg-white text-[#52525B] border-gray-200 hover:border-[#329937]"
                                                    }`}
                                                    data-testid="bonus-type-wallet"
                                                >
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Wallet className="w-5 h-5" />
                                                        <span>Wallet Balance</span>
                                                        <span className="text-xs opacity-70">+₹{walletData.bonus}</span>
                                                    </div>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setWalletData({...walletData, bonusType: "points"})}
                                                    className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                                                        walletData.bonusType === "points" 
                                                            ? "bg-[#F26B33]/10 text-[#F26B33] border-[#F26B33]" 
                                                            : "bg-white text-[#52525B] border-gray-200 hover:border-[#F26B33]"
                                                    }`}
                                                    data-testid="bonus-type-points"
                                                >
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Gift className="w-5 h-5" />
                                                        <span>Loyalty Points</span>
                                                        <span className="text-xs opacity-70">+{walletData.bonus} pts</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Total Credit Preview */}
                                    {walletData.amount && (
                                        <div className="p-3 bg-[#329937]/10 rounded-xl border border-[#329937]/20">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[#52525B]">Amount Paid:</span>
                                                <span className="font-medium">₹{walletData.amount}</span>
                                            </div>
                                            {walletData.bonus && parseFloat(walletData.bonus) > 0 && (
                                                <>
                                                    <div className="flex justify-between items-center text-sm mt-1">
                                                        <span className="text-[#52525B]">Bonus ({walletData.bonusType === "wallet" ? "Wallet" : "Points"}):</span>
                                                        <span className={`font-medium ${walletData.bonusType === "wallet" ? "text-[#329937]" : "text-[#F26B33]"}`}>
                                                            {walletData.bonusType === "wallet" ? `+₹${walletData.bonus}` : `+${walletData.bonus} pts`}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                            <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-[#329937]/20">
                                                <span className="font-semibold text-[#1A1A1A]">Wallet Credit:</span>
                                                <span className="font-bold text-[#329937]">
                                                    ₹{walletData.bonusType === "wallet" 
                                                        ? (parseFloat(walletData.amount || 0) + parseFloat(walletData.bonus || 0)).toLocaleString()
                                                        : parseFloat(walletData.amount || 0).toLocaleString()
                                                    }
                                                </span>
                                            </div>
                                            {walletData.bonus && parseFloat(walletData.bonus) > 0 && walletData.bonusType === "points" && (
                                                <div className="flex justify-between items-center text-sm mt-1">
                                                    <span className="font-semibold text-[#1A1A1A]">Points Credit:</span>
                                                    <span className="font-bold text-[#F26B33]">+{walletData.bonus} pts</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div>
                                        <Label className="form-label">Payment Method</Label>
                                        <div className="flex gap-2 mt-2">
                                            {["cash", "upi", "card"].map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setWalletData({...walletData, payment_method: method})}
                                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                                                        walletData.payment_method === method 
                                                            ? "bg-[#F26B33] text-white border-[#F26B33]" 
                                                            : "bg-white text-[#52525B] border-gray-200 hover:border-[#F26B33]"
                                                    }`}
                                                    data-testid={`payment-method-${method}`}
                                                >
                                                    {method.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div>
                                <Label htmlFor="wallet-desc" className="form-label">Description</Label>
                                <Input
                                    id="wallet-desc"
                                    value={walletData.description}
                                    onChange={(e) => setWalletData({...walletData, description: e.target.value})}
                                    placeholder={walletAction === "credit" ? "Wallet recharge" : "Bill payment"}
                                    className="h-12 rounded-xl"
                                    data-testid="wallet-description-input"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowWalletModal(false)}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className={`rounded-full ${walletAction === "credit" ? "bg-[#329937] hover:bg-[#287A2D]" : "bg-[#F26B33] hover:bg-[#D85A2A]"}`}
                                disabled={submitting}
                                data-testid="submit-wallet-btn"
                            >
                                {submitting ? "Processing..." : walletAction === "credit" ? "Add Money" : "Use Balance"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Customer Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-md mx-4 rounded-2xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="font-['Montserrat']">Edit Customer</DialogTitle>
                        <DialogDescription>Update customer details</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCustomer}>
                        <ScrollArea className="h-[60vh] pr-4">
                            <div className="space-y-4 py-2">
                                <div>
                                    <Label className="form-label">Name *</Label>
                                    <Input
                                        value={editData.name || ""}
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        placeholder="Customer name"
                                        className="h-11 rounded-xl"
                                        required
                                        data-testid="edit-name-input"
                                    />
                                </div>
                                
                                <div>
                                    <Label className="form-label">Phone Number * (Unique)</Label>
                                    <div className="flex gap-2">
                                        <Select 
                                            value={editData.country_code || "+91"} 
                                            onValueChange={(v) => setEditData({...editData, country_code: v})}
                                        >
                                            <SelectTrigger className="w-24 h-11 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="+91">+91</SelectItem>
                                                <SelectItem value="+1">+1</SelectItem>
                                                <SelectItem value="+44">+44</SelectItem>
                                                <SelectItem value="+971">+971</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            value={editData.phone || ""}
                                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                            placeholder="9876543210"
                                            className="flex-1 h-11 rounded-xl"
                                            required
                                            data-testid="edit-phone-input"
                                        />
                                    </div>
                                    <p className="text-xs text-[#52525B] mt-1">Phone number must be unique</p>
                                </div>

                                <div>
                                    <Label className="form-label">Email</Label>
                                    <Input
                                        type="email"
                                        value={editData.email || ""}
                                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                                        placeholder="customer@email.com"
                                        className="h-11 rounded-xl"
                                        data-testid="edit-email-input"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="form-label">Date of Birth</Label>
                                        <Input
                                            type="date"
                                            value={editData.dob || ""}
                                            onChange={(e) => setEditData({...editData, dob: e.target.value})}
                                            className="h-11 rounded-xl"
                                            data-testid="edit-dob-input"
                                        />
                                    </div>
                                    <div>
                                        <Label className="form-label">Anniversary</Label>
                                        <Input
                                            type="date"
                                            value={editData.anniversary || ""}
                                            onChange={(e) => setEditData({...editData, anniversary: e.target.value})}
                                            className="h-11 rounded-xl"
                                            data-testid="edit-anniversary-input"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="form-label">Customer Type</Label>
                                    <Select 
                                        value={editData.customer_type || "normal"} 
                                        onValueChange={(v) => setEditData({...editData, customer_type: v})}
                                    >
                                        <SelectTrigger className="h-11 rounded-xl" data-testid="edit-customer-type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="corporate">Corporate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {editData.customer_type === "corporate" && (
                                    <>
                                        <div>
                                            <Label className="form-label">GST Name</Label>
                                            <Input
                                                value={editData.gst_name || ""}
                                                onChange={(e) => setEditData({...editData, gst_name: e.target.value})}
                                                placeholder="Company Name"
                                                className="h-11 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label className="form-label">GST Number</Label>
                                            <Input
                                                value={editData.gst_number || ""}
                                                onChange={(e) => setEditData({...editData, gst_number: e.target.value})}
                                                placeholder="29ABCDE1234F1Z5"
                                                className="h-11 rounded-xl"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <Label className="form-label">City</Label>
                                    <Input
                                        value={editData.city || ""}
                                        onChange={(e) => setEditData({...editData, city: e.target.value})}
                                        placeholder="Mumbai"
                                        className="h-11 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <Label className="form-label">Address</Label>
                                    <Input
                                        value={editData.address || ""}
                                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                                        placeholder="Full address"
                                        className="h-11 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <Label className="form-label">Notes</Label>
                                    <Input
                                        value={editData.notes || ""}
                                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                                        placeholder="Any special notes..."
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="mt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowEditModal(false)}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="rounded-full bg-[#F26B33] hover:bg-[#D85A2A]"
                                disabled={submitting}
                                data-testid="save-edit-btn"
                            >
                                {submitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MobileLayout>
    );
};

// ============ QR CODE PAGE ============

const QRCodePage = () => {
    const { api, user } = useAuth();
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchQR = async () => {
            try {
                const res = await api.get("/qr/generate");
                setQrData(res.data);
            } catch (err) {
                toast.error("Failed to generate QR code");
            } finally {
                setLoading(false);
            }
        };
        fetchQR();
    }, []);

    const copyLink = () => {
        navigator.clipboard.writeText(qrData.registration_url);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadQR = () => {
        const link = document.createElement("a");
        link.download = `${user?.restaurant_name}-qr.png`;
        link.href = qrData.qr_code;
        link.click();
        toast.success("QR Code downloaded!");
    };

    return (
        <MobileLayout>
            <div className="p-4 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-['Montserrat']" data-testid="qr-page-title">
                    Customer QR Code
                </h1>
                <p className="text-[#52525B] mb-6">Let customers scan to join your loyalty program</p>

                {loading ? (
                    <div className="qr-container animate-pulse flex items-center justify-center" style={{height: 300}}>
                        <div className="w-48 h-48 bg-gray-200 rounded-xl"></div>
                    </div>
                ) : qrData ? (
                    <div className="space-y-4">
                        <div className="qr-container text-center" data-testid="qr-code-container">
                            <p className="text-lg font-semibold text-[#1A1A1A] mb-4 font-['Montserrat']">{user?.restaurant_name}</p>
                            <img 
                                src={qrData.qr_code} 
                                alt="QR Code" 
                                className="mx-auto w-48 h-48"
                                data-testid="qr-code-image"
                            />
                            <p className="text-sm text-[#52525B] mt-4">Scan to join our loyalty program</p>
                        </div>

                        <div className="flex gap-3">
                            <Button 
                                onClick={copyLink}
                                variant="outline"
                                className="flex-1 h-12 rounded-full"
                                data-testid="copy-qr-link-btn"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? "Copied!" : "Copy Link"}
                            </Button>
                            <Button 
                                onClick={downloadQR}
                                className="flex-1 h-12 bg-[#F26B33] hover:bg-[#D85A2A] rounded-full"
                                data-testid="download-qr-btn"
                            >
                                <Download className="w-4 h-4 mr-2" /> Download
                            </Button>
                        </div>

                        <Card className="rounded-xl border-0 shadow-sm bg-[#FEF3C7]">
                            <CardContent className="p-4">
                                <p className="text-sm text-[#92400E]">
                                    <strong>Tip:</strong> Print this QR code and place it at your billing counter for easy customer sign-ups!
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-[#52525B]">Failed to generate QR code</p>
                    </div>
                )}
            </div>
        </MobileLayout>
    );
};

// ============ FEEDBACK PAGE ============

const FeedbackPage = () => {
    const { api } = useAuth();
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFeedback, setNewFeedback] = useState({ customer_name: "", customer_phone: "", rating: 5, message: "" });
    const [submitting, setSubmitting] = useState(false);

    const fetchFeedback = async () => {
        try {
            const res = await api.get("/feedback");
            setFeedbackList(res.data);
        } catch (err) {
            toast.error("Failed to load feedback");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const handleAddFeedback = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/feedback", newFeedback);
            toast.success("Feedback recorded!");
            setShowAddModal(false);
            setNewFeedback({ customer_name: "", customer_phone: "", rating: 5, message: "" });
            fetchFeedback();
        } catch (err) {
            toast.error("Failed to add feedback");
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolve = async (feedbackId) => {
        try {
            await api.put(`/feedback/${feedbackId}/resolve`);
            toast.success("Feedback resolved");
            fetchFeedback();
        } catch (err) {
            toast.error("Failed to resolve");
        }
    };

    const StarRating = ({ rating, onChange, readonly = false }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange && onChange(star)}
                    className={`${readonly ? "" : "active-scale"}`}
                >
                    <Star 
                        className={`w-6 h-6 ${star <= rating ? "fill-[#329937] text-[#329937]" : "text-gray-300"}`} 
                    />
                </button>
            ))}
        </div>
    );

    return (
        <MobileLayout>
            <div className="p-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']" data-testid="feedback-title">
                        Feedback
                    </h1>
                    <Button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#F26B33] hover:bg-[#D85A2A] rounded-full h-10 px-4"
                        data-testid="add-feedback-btn"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="stats-card animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : feedbackList.length === 0 ? (
                    <div className="empty-state">
                        <MessageSquare className="empty-state-icon" />
                        <p className="text-[#52525B]">No feedback yet</p>
                        <Button 
                            onClick={() => setShowAddModal(true)}
                            className="mt-4 bg-[#F26B33] hover:bg-[#D85A2A] rounded-full"
                        >
                            Record first feedback
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {feedbackList.map((fb) => (
                            <Card key={fb.id} className="rounded-xl border-0 shadow-sm" data-testid={`feedback-item-${fb.id}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-[#1A1A1A]">{fb.customer_name}</p>
                                            <p className="text-sm text-[#52525B]">{fb.customer_phone}</p>
                                        </div>
                                        <Badge variant={fb.status === "resolved" ? "outline" : "default"} 
                                            className={fb.status === "pending" ? "bg-[#329937]" : ""}>
                                            {fb.status}
                                        </Badge>
                                    </div>
                                    <StarRating rating={fb.rating} readonly />
                                    {fb.message && (
                                        <p className="text-[#52525B] mt-2 text-sm">{fb.message}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                        <p className="text-xs text-[#A1A1AA]">
                                            {new Date(fb.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        {fb.status === "pending" && (
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => handleResolve(fb.id)}
                                                className="h-8 rounded-full text-xs"
                                                data-testid={`resolve-feedback-${fb.id}`}
                                            >
                                                <Check className="w-3 h-3 mr-1" /> Resolve
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Feedback Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="max-w-sm mx-4 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-['Montserrat']">Record Feedback</DialogTitle>
                        <DialogDescription>Capture customer feedback</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddFeedback}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="form-label">Name *</Label>
                                <Input
                                    value={newFeedback.customer_name}
                                    onChange={(e) => setNewFeedback({...newFeedback, customer_name: e.target.value})}
                                    placeholder="Customer name"
                                    className="h-12 rounded-xl"
                                    required
                                    data-testid="feedback-customer-name"
                                />
                            </div>
                            <div>
                                <Label className="form-label">Phone *</Label>
                                <Input
                                    type="tel"
                                    value={newFeedback.customer_phone}
                                    onChange={(e) => setNewFeedback({...newFeedback, customer_phone: e.target.value})}
                                    placeholder="9876543210"
                                    className="h-12 rounded-xl"
                                    required
                                    data-testid="feedback-customer-phone"
                                />
                            </div>
                            <div>
                                <Label className="form-label">Rating *</Label>
                                <div className="mt-2">
                                    <StarRating 
                                        rating={newFeedback.rating} 
                                        onChange={(r) => setNewFeedback({...newFeedback, rating: r})}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="form-label">Message</Label>
                                <Textarea
                                    value={newFeedback.message}
                                    onChange={(e) => setNewFeedback({...newFeedback, message: e.target.value})}
                                    placeholder="Customer feedback..."
                                    className="rounded-xl resize-none"
                                    rows={3}
                                    data-testid="feedback-message"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-full">
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-[#F26B33] hover:bg-[#D85A2A] rounded-full"
                                disabled={submitting}
                                data-testid="submit-feedback-btn"
                            >
                                {submitting ? "Saving..." : "Save Feedback"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MobileLayout>
    );
};

// ============ COUPONS PAGE ============

const CouponsPage = () => {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        start_date: "",
        end_date: "",
        usage_limit: "",
        per_user_limit: "1",
        min_order_value: "0",
        max_discount: "",
        specific_users: [],
        applicable_channels: ["delivery", "takeaway", "dine_in"],
        description: ""
    });
    const [showSpecificUsers, setShowSpecificUsers] = useState(false);

    const fetchCoupons = async () => {
        try {
            const res = await api.get("/coupons");
            setCoupons(res.data);
        } catch (err) {
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await api.get("/customers?limit=500");
            setCustomers(res.data);
        } catch (err) {
            console.error("Failed to load customers");
        }
    };

    useEffect(() => {
        fetchCoupons();
        fetchCustomers();
    }, []);

    const resetForm = () => {
        setNewCoupon({
            code: "",
            discount_type: "percentage",
            discount_value: "",
            start_date: "",
            end_date: "",
            usage_limit: "",
            per_user_limit: "1",
            min_order_value: "0",
            max_discount: "",
            specific_users: [],
            applicable_channels: ["delivery", "takeaway", "dine_in"],
            description: ""
        });
        setShowSpecificUsers(false);
        setEditingCoupon(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const couponData = {
                code: newCoupon.code,
                discount_type: newCoupon.discount_type,
                discount_value: parseFloat(newCoupon.discount_value),
                start_date: newCoupon.start_date,
                end_date: newCoupon.end_date,
                usage_limit: newCoupon.usage_limit ? parseInt(newCoupon.usage_limit) : null,
                per_user_limit: parseInt(newCoupon.per_user_limit) || 1,
                min_order_value: parseFloat(newCoupon.min_order_value) || 0,
                max_discount: newCoupon.max_discount ? parseFloat(newCoupon.max_discount) : null,
                specific_users: showSpecificUsers && newCoupon.specific_users.length > 0 ? newCoupon.specific_users : null,
                applicable_channels: newCoupon.applicable_channels,
                description: newCoupon.description || null
            };

            if (editingCoupon) {
                await api.put(`/coupons/${editingCoupon.id}`, couponData);
                toast.success("Coupon updated!");
            } else {
                await api.post("/coupons", couponData);
                toast.success("Coupon created!");
            }
            setShowAddModal(false);
            resetForm();
            fetchCoupons();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to save coupon");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setNewCoupon({
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value.toString(),
            start_date: coupon.start_date.split("T")[0],
            end_date: coupon.end_date.split("T")[0],
            usage_limit: coupon.usage_limit?.toString() || "",
            per_user_limit: coupon.per_user_limit.toString(),
            min_order_value: coupon.min_order_value.toString(),
            max_discount: coupon.max_discount?.toString() || "",
            specific_users: coupon.specific_users || [],
            applicable_channels: coupon.applicable_channels,
            description: coupon.description || ""
        });
        setShowSpecificUsers(coupon.specific_users && coupon.specific_users.length > 0);
        setShowAddModal(true);
    };

    const handleDelete = async (couponId) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await api.delete(`/coupons/${couponId}`);
            toast.success("Coupon deleted");
            fetchCoupons();
        } catch (err) {
            toast.error("Failed to delete coupon");
        }
    };

    const toggleChannel = (channel) => {
        if (newCoupon.applicable_channels.includes(channel)) {
            setNewCoupon({
                ...newCoupon,
                applicable_channels: newCoupon.applicable_channels.filter(c => c !== channel)
            });
        } else {
            setNewCoupon({
                ...newCoupon,
                applicable_channels: [...newCoupon.applicable_channels, channel]
            });
        }
    };

    const toggleUser = (userId) => {
        if (newCoupon.specific_users.includes(userId)) {
            setNewCoupon({
                ...newCoupon,
                specific_users: newCoupon.specific_users.filter(id => id !== userId)
            });
        } else {
            setNewCoupon({
                ...newCoupon,
                specific_users: [...newCoupon.specific_users, userId]
            });
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    const isCouponActive = (coupon) => {
        const now = new Date();
        const start = new Date(coupon.start_date);
        const end = new Date(coupon.end_date);
        return coupon.is_active && now >= start && now <= end;
    };

    return (
        <MobileLayout>
            <div className="p-4 max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']" data-testid="coupons-title">
                        Coupons
                    </h1>
                    <Button
                        onClick={() => { resetForm(); setShowAddModal(true); }}
                        className="h-10 rounded-full bg-[#F26B33] hover:bg-[#D85A2A] px-4"
                        data-testid="add-coupon-btn"
                    >
                        <Plus className="w-4 h-4 mr-1" /> New
                    </Button>
                </div>
                <p className="text-sm text-[#52525B] mb-4">Manage promotional coupons</p>

                {/* Content */}
                {loading ? (
                    <div className="space-y-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-40"></div>
                            </div>
                        ))}
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="text-center py-12">
                        <Tag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-[#52525B] mb-4">No coupons yet</p>
                        <Button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-[#F26B33] hover:bg-[#D85A2A] rounded-full"
                        >
                            Create your first coupon
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {coupons.map((coupon) => (
                            <Card 
                                key={coupon.id}
                                className={`rounded-xl border ${isCouponActive(coupon) ? 'border-[#329937]/30 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                data-testid={`coupon-card-${coupon.id}`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-[#1A1A1A] text-lg">{coupon.code}</p>
                                                {isCouponActive(coupon) && (
                                                    <Badge className="bg-[#329937]/10 text-[#329937] text-xs border-0">Active</Badge>
                                                )}
                                                {!coupon.is_active && (
                                                    <Badge variant="outline" className="text-xs text-gray-500">Inactive</Badge>
                                                )}
                                                {coupon.is_active && new Date(coupon.end_date) < new Date() && (
                                                    <Badge variant="outline" className="text-xs text-red-500 border-red-200">Expired</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-[#F26B33] font-medium mt-1">
                                                {coupon.discount_type === "percentage" 
                                                    ? `${coupon.discount_value}% off` 
                                                    : `₹${coupon.discount_value} off`}
                                                {coupon.max_discount && coupon.discount_type === "percentage" && 
                                                    ` (max ₹${coupon.max_discount})`}
                                            </p>
                                            <p className="text-xs text-[#A1A1AA] mt-1">
                                                {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                                                <Badge variant="outline" className="text-xs bg-gray-50">
                                                    Used: {coupon.total_used}{coupon.usage_limit ? `/${coupon.usage_limit}` : ''}
                                                </Badge>
                                                {coupon.applicable_channels.map(ch => (
                                                    <Badge key={ch} variant="outline" className="text-xs capitalize bg-white">
                                                        {ch.replace("_", " ")}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(coupon)}
                                                className="h-9 w-9 p-0 text-[#52525B] hover:text-[#F26B33] hover:bg-[#F26B33]/10"
                                                data-testid={`edit-coupon-${coupon.id}`}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(coupon.id)}
                                                className="h-9 w-9 p-0 text-[#52525B] hover:text-red-600 hover:bg-red-50"
                                                data-testid={`delete-coupon-${coupon.id}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Coupon Modal */}
            <Dialog open={showAddModal} onOpenChange={(open) => { setShowAddModal(open); if (!open) resetForm(); }}>
                <DialogContent className="max-w-md mx-4 rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="font-['Montserrat']">
                            {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCoupon ? "Update coupon details" : "Add a new promotional coupon"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[calc(90vh-200px)] pr-4">
                            <div className="space-y-4">
                                
                                <div>
                                    <Label className="form-label">Coupon Code</Label>
                                    <Input
                                        value={newCoupon.code}
                                        onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                                        placeholder="e.g., SAVE10, WELCOME20"
                                        className="h-12 rounded-xl uppercase"
                                        required
                                        data-testid="coupon-code-input"
                                    />
                                </div>

                                <div>
                                    <Label className="form-label">Discount Type</Label>
                                    <Select 
                                        value={newCoupon.discount_type} 
                                        onValueChange={(v) => setNewCoupon({...newCoupon, discount_type: v})}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl" data-testid="discount-type-select">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                            <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="form-label">Discount Value</Label>
                                    <Input
                                        type="number"
                                        value={newCoupon.discount_value}
                                        onChange={(e) => setNewCoupon({...newCoupon, discount_value: e.target.value})}
                                        placeholder={newCoupon.discount_type === "percentage" ? "10" : "100"}
                                        className="h-12 rounded-xl"
                                        required
                                        min="0"
                                        max={newCoupon.discount_type === "percentage" ? "100" : undefined}
                                        data-testid="discount-value-input"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="form-label">Start Date</Label>
                                        <Input
                                            type="date"
                                            value={newCoupon.start_date}
                                            onChange={(e) => setNewCoupon({...newCoupon, start_date: e.target.value})}
                                            className="h-12 rounded-xl"
                                            required
                                            data-testid="start-date-input"
                                        />
                                    </div>
                                    <div>
                                        <Label className="form-label">End Date</Label>
                                        <Input
                                            type="date"
                                            value={newCoupon.end_date}
                                            onChange={(e) => setNewCoupon({...newCoupon, end_date: e.target.value})}
                                            className="h-12 rounded-xl"
                                            required
                                            data-testid="end-date-input"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="form-label">Usage Limit</Label>
                                        <Input
                                            type="number"
                                            value={newCoupon.usage_limit}
                                            onChange={(e) => setNewCoupon({...newCoupon, usage_limit: e.target.value})}
                                            placeholder="Unlimited"
                                            className="h-12 rounded-xl"
                                            min="1"
                                            data-testid="usage-limit-input"
                                        />
                                    </div>
                                    <div>
                                        <Label className="form-label">Per User Limit</Label>
                                        <Input
                                            type="number"
                                            value={newCoupon.per_user_limit}
                                            onChange={(e) => setNewCoupon({...newCoupon, per_user_limit: e.target.value})}
                                            placeholder="1"
                                            className="h-12 rounded-xl"
                                            min="1"
                                            data-testid="per-user-limit-input"
                                        />
                                    </div>
                                </div>

                                {newCoupon.discount_type === "percentage" && (
                                    <div>
                                        <Label className="form-label">Max Discount (₹)</Label>
                                        <Input
                                            type="number"
                                            value={newCoupon.max_discount}
                                            onChange={(e) => setNewCoupon({...newCoupon, max_discount: e.target.value})}
                                            placeholder="No limit"
                                            className="h-12 rounded-xl"
                                            min="0"
                                            data-testid="max-discount-input"
                                        />
                                    </div>
                                )}

                                <div>
                                    <Label className="form-label">Min Order Value (₹)</Label>
                                    <Input
                                        type="number"
                                        value={newCoupon.min_order_value}
                                        onChange={(e) => setNewCoupon({...newCoupon, min_order_value: e.target.value})}
                                        placeholder="0"
                                        className="h-12 rounded-xl"
                                        min="0"
                                        data-testid="min-order-input"
                                    />
                                </div>

                                {/* Specific Users */}
                                <div className="flex items-center justify-between py-2">
                                    <Label className="form-label mb-0">Select Specific Users</Label>
                                    <Checkbox
                                        checked={showSpecificUsers}
                                        onCheckedChange={setShowSpecificUsers}
                                        data-testid="specific-users-checkbox"
                                    />
                                </div>

                                {showSpecificUsers && (
                                    <div className="max-h-40 overflow-y-auto border rounded-xl p-3 space-y-2">
                                        {customers.length === 0 ? (
                                            <p className="text-sm text-[#52525B]">No customers found</p>
                                        ) : (
                                            customers.map(customer => (
                                                <label key={customer.id} className="flex items-center gap-2 cursor-pointer">
                                                    <Checkbox
                                                        checked={newCoupon.specific_users.includes(customer.id)}
                                                        onCheckedChange={() => toggleUser(customer.id)}
                                                    />
                                                    <span className="text-sm">{customer.name} ({customer.phone})</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Applicable Channels */}
                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-[#1A1A1A]">Applicable Channels</p>
                                        <button
                                            type="button"
                                            onClick={() => setNewCoupon({
                                                ...newCoupon, 
                                                applicable_channels: newCoupon.applicable_channels.length === 3 
                                                    ? [] 
                                                    : ["delivery", "takeaway", "dine_in"]
                                            })}
                                            className="text-xs text-[#F26B33]"
                                        >
                                            {newCoupon.applicable_channels.length === 3 ? "Deselect All" : "Select All"}
                                        </button>
                                    </div>
                                    <p className="text-xs text-[#52525B]">Channel Name</p>
                                    {[
                                        { id: "delivery", label: "Delivery" },
                                        { id: "takeaway", label: "Takeaway" },
                                        { id: "dine_in", label: "Dine In" }
                                    ].map(channel => (
                                        <label key={channel.id} className="flex items-center justify-between py-2">
                                            <span className="text-sm text-[#52525B]">{channel.label}</span>
                                            <Checkbox
                                                checked={newCoupon.applicable_channels.includes(channel.id)}
                                                onCheckedChange={() => toggleChannel(channel.id)}
                                                data-testid={`channel-${channel.id}`}
                                            />
                                        </label>
                                    ))}
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="form-label">Description (Optional)</Label>
                                    <Textarea
                                        value={newCoupon.description}
                                        onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                                        placeholder="Internal note about this coupon..."
                                        className="rounded-xl resize-none"
                                        rows={2}
                                        data-testid="coupon-description"
                                    />
                                </div>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="pt-4 border-t">
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-[#F26B33] hover:bg-[#D85A2A] rounded-full"
                                disabled={submitting}
                                data-testid="save-coupon-btn"
                            >
                                {submitting ? "Saving..." : (editingCoupon ? "Update Coupon" : "Create Coupon")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MobileLayout>
    );
};

// ============ SETTINGS PAGE ============

// ============ SEGMENTS PAGE ============
const SegmentsPage = () => {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [segments, setSegments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSegment, setSelectedSegment] = useState(null);
    const [showSendMessage, setShowSendMessage] = useState(false);
    const [messageTemplate, setMessageTemplate] = useState("");
    const [selectedCampaign, setSelectedCampaign] = useState("");
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingSegment, setEditingSegment] = useState(null);
    const [segmentName, setSegmentName] = useState("");
    const [templateVariables, setTemplateVariables] = useState({});

    // Sample campaigns - in real app, fetch from API
    const campaigns = [
        { id: "new_year", name: "New Year Sale 2026" },
        { id: "weekend_special", name: "Weekend Special" },
        { id: "loyalty_boost", name: "Loyalty Boost" },
        { id: "win_back", name: "Win-back Campaign" },
        { id: "birthday_club", name: "Birthday Club" }
    ];

    // Enhanced templates with media and variables
    const templates = [
        { 
            id: "welcome", 
            name: "Welcome Message", 
            message: "Hi {{name}}! Welcome to our loyalty program. You've earned {{points}} points! Use code {{coupon_code}} for {{discount}}% off on your next visit.",
            variables: ["coupon_code", "discount"],
            mediaType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
        },
        { 
            id: "birthday", 
            name: "Birthday Offer", 
            message: "Happy Birthday {{name}}! 🎂 Get {{discount}}% off + bonus {{bonus_points}} points! Valid till {{valid_date}}. Use code: {{coupon_code}}",
            variables: ["discount", "bonus_points", "valid_date", "coupon_code"],
            mediaType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop"
        },
        { 
            id: "winback", 
            name: "Win-back Campaign", 
            message: "We miss you {{name}}! It's been a while since your last visit. Come back and get {{bonus_points}} bonus points + {{discount}}% off! Offer valid for {{valid_days}} days.",
            variables: ["bonus_points", "discount", "valid_days"],
            mediaType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
        },
        { 
            id: "promo", 
            name: "Promotional Offer", 
            message: "Special offer for you {{name}}! {{offer_title}} - Get {{discount}}% off this {{offer_period}}! Min order: ₹{{min_order}}. Code: {{coupon_code}}",
            variables: ["offer_title", "discount", "offer_period", "min_order", "coupon_code"],
            mediaType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
        },
        { 
            id: "points_expiry", 
            name: "Points Expiry Reminder", 
            message: "Hi {{name}}, your {{expiring_points}} points worth ₹{{points_value}} are expiring on {{expiry_date}}! Visit us soon to redeem them.",
            variables: ["expiring_points", "points_value", "expiry_date"],
            mediaType: null,
            mediaUrl: null
        },
        { 
            id: "new_dish", 
            name: "New Menu Launch", 
            message: "Hey {{name}}! 🍽️ We've launched {{dish_name}}! Be among the first to try it. Special launch price: ₹{{price}}. Available from {{launch_date}}.",
            variables: ["dish_name", "price", "launch_date"],
            mediaType: "video",
            mediaUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"
        }
    ];

    // Get current selected template
    const currentTemplate = templates.find(t => t.id === messageTemplate);

    // Generate preview with filled variables
    const getPreviewMessage = () => {
        if (!currentTemplate) return "";
        let preview = currentTemplate.message;
        // Replace static variables
        preview = preview.replace(/\{\{name\}\}/g, "John Doe");
        preview = preview.replace(/\{\{points\}\}/g, "500");
        // Replace dynamic variables with user input
        Object.keys(templateVariables).forEach(key => {
            preview = preview.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), templateVariables[key] || `[${key}]`);
        });
        return preview;
    };

    // Handle template change - reset variables
    const handleTemplateChange = (templateId) => {
        setMessageTemplate(templateId);
        const template = templates.find(t => t.id === templateId);
        if (template?.variables) {
            const initialVars = {};
            template.variables.forEach(v => { initialVars[v] = ""; });
            setTemplateVariables(initialVars);
        } else {
            setTemplateVariables({});
        }
    };

    useEffect(() => {
        fetchSegments();
    }, []);

    const fetchSegments = async () => {
        try {
            const res = await api.get('/segments');
            setSegments(res.data);
        } catch (err) {
            toast.error("Failed to load segments");
        } finally {
            setLoading(false);
        }
    };

    const deleteSegment = async (segmentId) => {
        if (!window.confirm("Are you sure you want to delete this segment?")) return;
        
        try {
            await api.delete(`/segments/${segmentId}`);
            toast.success("Segment deleted");
            fetchSegments();
        } catch (err) {
            toast.error("Failed to delete segment");
        }
    };

    const updateSegment = async () => {
        if (!segmentName.trim()) {
            toast.error("Please enter a segment name");
            return;
        }

        try {
            await api.put(`/segments/${editingSegment.id}`, {
                name: segmentName
            });
            toast.success("Segment updated");
            setShowEditDialog(false);
            setEditingSegment(null);
            setSegmentName("");
            fetchSegments();
        } catch (err) {
            toast.error("Failed to update segment");
        }
    };

    const viewSegmentCustomers = async (segment) => {
        setSelectedSegment(segment);
        try {
            const res = await api.get(`/segments/${segment.id}/customers`);
            setSelectedSegment({...segment, customers: res.data});
        } catch (err) {
            toast.error("Failed to load customers");
        }
    };

    if (loading) {
        return (
            <MobileLayout>
                <div className="p-4 max-w-lg mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-[#52525B]">Loading segments...</p>
                    </div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <div className="p-4 max-w-lg mx-auto" data-testid="segments-page">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']" data-testid="segments-title">
                            Segments
                        </h1>
                        <p className="text-sm text-[#52525B] mt-1">Manage saved customer segments</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/customers')}
                        className="text-[#F26B33] border-[#F26B33]"
                        data-testid="create-segment-btn"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        New
                    </Button>
                </div>

                {/* Segments List */}
                {segments.length === 0 ? (
                    <Card className="p-8 text-center rounded-2xl" data-testid="empty-segments">
                        <div className="text-[#52525B]">
                            <Layers className="w-12 h-12 mx-auto mb-4 text-[#F26B33]" />
                            <p className="font-medium mb-2">No segments yet</p>
                            <p className="text-sm mb-4">Create segments from the Customers page by applying filters and saving them</p>
                            <Button 
                                onClick={() => navigate('/customers')}
                                className="bg-[#F26B33] hover:bg-[#D85A2A] rounded-full"
                            >
                                Go to Customers
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-3" data-testid="segments-list">
                        {segments.map(segment => (
                            <Card key={segment.id} className="rounded-xl hover:shadow-md transition-shadow" data-testid={`segment-card-${segment.id}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-[#1A1A1A]" data-testid={`segment-name-${segment.id}`}>{segment.name}</h3>
                                                <Badge className="bg-[#F26B33]/10 text-[#F26B33] hover:bg-[#F26B33]/20">
                                                    {segment.customer_count} customers
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-[#52525B]">
                                                Created {new Date(segment.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Filter Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {segment.filters.tier && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                Tier: {segment.filters.tier}
                                            </span>
                                        )}
                                        {segment.filters.city && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                City: {segment.filters.city}
                                            </span>
                                        )}
                                        {segment.filters.customer_type && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                Type: {segment.filters.customer_type}
                                            </span>
                                        )}
                                        {segment.filters.last_visit_days && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                Inactive: {segment.filters.last_visit_days}+ days
                                            </span>
                                        )}
                                        {segment.filters.search && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                Search: {segment.filters.search}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => viewSegmentCustomers(segment)}
                                            className="flex-1 h-9"
                                            data-testid={`view-segment-${segment.id}`}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditingSegment(segment);
                                                setSegmentName(segment.name);
                                                setShowEditDialog(true);
                                            }}
                                            className="h-9"
                                            data-testid={`edit-segment-${segment.id}`}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                viewSegmentCustomers(segment);
                                                setShowSendMessage(true);
                                            }}
                                            className="h-9 bg-[#25D366] text-white hover:bg-[#20BD5A] border-[#25D366]"
                                            data-testid={`whatsapp-segment-${segment.id}`}
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => deleteSegment(segment.id)}
                                            className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            data-testid={`delete-segment-${segment.id}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* View Customers Modal */}
                {selectedSegment && !showSendMessage && (
                    <Dialog open={true} onOpenChange={() => setSelectedSegment(null)}>
                        <DialogContent className="max-w-md mx-4 rounded-2xl max-h-[80vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                                <DialogTitle className="font-['Montserrat']">Customers in "{selectedSegment.name}"</DialogTitle>
                                <DialogDescription>
                                    {selectedSegment.customer_count} customers match this segment
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="flex-1 max-h-[50vh]">
                                {selectedSegment.customers ? (
                                    <div className="space-y-2 pr-4">
                                        {selectedSegment.customers.length === 0 ? (
                                            <p className="text-center text-[#52525B] py-4">No customers in this segment</p>
                                        ) : (
                                            selectedSegment.customers.map(customer => (
                                                <button
                                                    key={customer.id}
                                                    onClick={() => {
                                                        setSelectedSegment(null);
                                                        navigate(`/customers/${customer.id}`);
                                                    }}
                                                    className="w-full p-3 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors text-left"
                                                    data-testid={`segment-customer-${customer.id}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-9 h-9">
                                                            <AvatarFallback className="bg-[#329937]/10 text-[#329937] text-sm font-semibold">
                                                                {customer.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-[#1A1A1A] text-sm">{customer.name}</p>
                                                            <p className="text-xs text-[#52525B]">{customer.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-[#F26B33]">{customer.total_points} pts</p>
                                                        <Badge variant="outline" className={`tier-badge ${customer.tier.toLowerCase()} text-xs`}>
                                                            {customer.tier}
                                                        </Badge>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-center text-[#52525B] py-8">Loading customers...</p>
                                )}
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Send Message Modal */}
                {showSendMessage && selectedSegment && (
                    <Dialog open={true} onOpenChange={() => {
                        setShowSendMessage(false);
                        setSelectedSegment(null);
                        setSelectedCampaign("");
                        setMessageTemplate("");
                        setTemplateVariables({});
                    }}>
                        <DialogContent className="max-w-lg mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="font-['Montserrat'] flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Send WhatsApp Message
                                </DialogTitle>
                                <DialogDescription>
                                    Send to {selectedSegment.customer_count} customers in "{selectedSegment.name}"
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Campaign Dropdown */}
                                <div>
                                    <Label className="text-sm font-medium">Choose Campaign</Label>
                                    <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                                        <SelectTrigger className="h-11 rounded-xl mt-1" data-testid="campaign-select">
                                            <SelectValue placeholder="Select a campaign..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {campaigns.map(campaign => (
                                                <SelectItem key={campaign.id} value={campaign.id}>
                                                    {campaign.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Template Dropdown */}
                                <div>
                                    <Label className="text-sm font-medium">Choose Template</Label>
                                    <Select value={messageTemplate} onValueChange={handleTemplateChange}>
                                        <SelectTrigger className="h-11 rounded-xl mt-1" data-testid="template-select">
                                            <SelectValue placeholder="Select a template..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templates.map(template => (
                                                <SelectItem key={template.id} value={template.id}>
                                                    <div className="flex items-center gap-2">
                                                        {template.mediaType === "image" && <span>🖼️</span>}
                                                        {template.mediaType === "video" && <span>🎬</span>}
                                                        {!template.mediaType && <span>📝</span>}
                                                        {template.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Template Variables */}
                                {currentTemplate?.variables && currentTemplate.variables.length > 0 && (
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Template Variables</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {currentTemplate.variables.map(variable => (
                                                <div key={variable}>
                                                    <Label className="text-xs text-[#52525B] capitalize">
                                                        {variable.replace(/_/g, ' ')}
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        value={templateVariables[variable] || ""}
                                                        onChange={(e) => setTemplateVariables({
                                                            ...templateVariables,
                                                            [variable]: e.target.value
                                                        })}
                                                        placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                                                        className="h-9 rounded-lg mt-1 text-sm"
                                                        data-testid={`var-${variable}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Complete Template Preview with Media */}
                                {messageTemplate && (
                                    <div className="rounded-xl border overflow-hidden bg-[#E5DDD5]">
                                        <div className="p-2">
                                            <p className="text-xs font-medium text-[#52525B] mb-2 bg-white/80 rounded px-2 py-1 inline-block">
                                                📱 Message Preview
                                            </p>
                                            
                                            {/* WhatsApp Style Message Bubble */}
                                            <div className="bg-[#DCF8C6] rounded-lg p-3 max-w-[85%] ml-auto shadow-sm">
                                                {/* Media Preview */}
                                                {currentTemplate?.mediaType === "image" && currentTemplate.mediaUrl && (
                                                    <div className="mb-2 rounded-lg overflow-hidden">
                                                        <img 
                                                            src={currentTemplate.mediaUrl} 
                                                            alt="Template media" 
                                                            className="w-full h-40 object-cover"
                                                        />
                                                    </div>
                                                )}
                                                {currentTemplate?.mediaType === "video" && currentTemplate.mediaUrl && (
                                                    <div className="mb-2 rounded-lg overflow-hidden bg-black relative">
                                                        <div className="w-full h-32 flex items-center justify-center bg-gray-900">
                                                            <div className="text-center text-white">
                                                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M8 5v14l11-7z"/>
                                                                    </svg>
                                                                </div>
                                                                <p className="text-xs">Video Attachment</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Message Text */}
                                                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                                    {getPreviewMessage()}
                                                </p>
                                                
                                                {/* Timestamp */}
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <span className="text-[10px] text-gray-500">
                                                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                    <p className="text-xs text-amber-800">
                                        <strong>⚠️ Coming Soon:</strong> WhatsApp Business API integration is in development.
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowSendMessage(false);
                                            setSelectedSegment(null);
                                            setSelectedCampaign("");
                                            setMessageTemplate("");
                                            setTemplateVariables({});
                                        }}
                                        className="flex-1 rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            toast.info("WhatsApp integration coming soon!");
                                            setShowSendMessage(false);
                                            setSelectedSegment(null);
                                            setSelectedCampaign("");
                                            setMessageTemplate("");
                                            setTemplateVariables({});
                                        }}
                                        className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] rounded-xl"
                                        disabled={!messageTemplate || !selectedCampaign}
                                    >
                                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        Send via WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Edit Segment Modal */}
                {showEditDialog && editingSegment && (
                    <Dialog open={true} onOpenChange={() => setShowEditDialog(false)}>
                        <DialogContent className="max-w-sm mx-4 rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="font-['Montserrat']">Edit Segment</DialogTitle>
                                <DialogDescription>Update the segment name</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Segment Name</Label>
                                    <Input
                                        type="text"
                                        value={segmentName}
                                        onChange={(e) => setSegmentName(e.target.value)}
                                        className="h-11 rounded-xl mt-1"
                                        placeholder="Enter segment name"
                                        data-testid="edit-segment-name-input"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowEditDialog(false);
                                            setEditingSegment(null);
                                            setSegmentName("");
                                        }}
                                        className="flex-1 rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={updateSegment}
                                        className="flex-1 bg-[#F26B33] hover:bg-[#D85A2A] rounded-xl"
                                        data-testid="save-segment-btn"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </MobileLayout>
    );
};

// ============ SETTINGS PAGE ============
const SettingsPage = () => {
    const { user, api, logout } = useAuth();
    const navigate = useNavigate();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get("/loyalty/settings");
                setSettings(res.data);
            } catch (err) {
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put("/loyalty/settings", settings);
            toast.success("Settings saved!");
        } catch (err) {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        toast.success("Logged out successfully");
    };

    return (
        <MobileLayout>
            <div className="p-4 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6 font-['Montserrat']" data-testid="settings-title">
                    Settings
                </h1>

                {/* Profile Section */}
                <Card className="rounded-xl border-0 shadow-sm mb-4" data-testid="profile-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-14 h-14 bg-[#F26B33]">
                                <AvatarFallback className="bg-[#F26B33] text-white text-xl font-semibold">
                                    {user?.restaurant_name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-[#1A1A1A] text-lg">{user?.restaurant_name}</p>
                                <p className="text-sm text-[#52525B]">{user?.email}</p>
                                <p className="text-sm text-[#52525B]">{user?.phone}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button 
                        onClick={() => navigate("/coupons")}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        data-testid="go-to-coupons"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#F26B33]/10 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-[#F26B33]" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-[#1A1A1A]">Coupons</p>
                            <p className="text-xs text-[#52525B]">Manage discounts</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => navigate("/whatsapp-automation")}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        data-testid="go-to-whatsapp"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-[#25D366]" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-[#1A1A1A]">WhatsApp</p>
                            <p className="text-xs text-[#52525B]">Templates & automation</p>
                        </div>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button 
                        onClick={() => document.getElementById('loyalty-settings')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        data-testid="go-to-loyalty-settings"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#329937]/10 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-[#329937]" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-[#1A1A1A]">Loyalty</p>
                            <p className="text-xs text-[#52525B]">Points & tiers</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => navigate("/qr")}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        data-testid="go-to-qr"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                            <QrCode className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-[#1A1A1A]">QR Code</p>
                            <p className="text-xs text-[#52525B]">Customer sign-up</p>
                        </div>
                    </button>
                </div>

                {loading ? (
                    <div className="stats-card animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                ) : settings && (
                    <>
                        {/* Points Earning Settings */}
                        <h2 id="loyalty-settings" className="text-lg font-semibold text-[#1A1A1A] mb-3 font-['Montserrat']">Points Earning</h2>
                        <Card className="rounded-xl border-0 shadow-sm mb-4" data-testid="earning-settings-card">
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <Label className="form-label">Minimum Order Value (₹)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={settings.min_order_value}
                                        onChange={(e) => setSettings({...settings, min_order_value: parseFloat(e.target.value)})}
                                        className="h-12 rounded-xl"
                                        data-testid="min-order-value-input"
                                    />
                                    <p className="text-xs text-[#52525B] mt-1">Customer must spend at least this amount to earn points</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tier-wise Earning Rates */}
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 font-['Montserrat']">Earning % by Tier</h2>
                        <Card className="rounded-xl border-0 shadow-sm mb-4" data-testid="tier-earning-card">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="form-label flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                                            Bronze (%)
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="100"
                                            value={settings.bronze_earn_percent}
                                            onChange={(e) => setSettings({...settings, bronze_earn_percent: parseFloat(e.target.value)})}
                                            className="h-12 rounded-xl"
                                            data-testid="bronze-percent-input"
                                        />
                                    </div>
                                    <div>
                                        <Label className="form-label flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                                            Silver (%)
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="100"
                                            value={settings.silver_earn_percent}
                                            onChange={(e) => setSettings({...settings, silver_earn_percent: parseFloat(e.target.value)})}
                                            className="h-12 rounded-xl"
                                            data-testid="silver-percent-input"
                                        />
                                    </div>
                                    <div>
                                        <Label className="form-label flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                            Gold (%)
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="100"
                                            value={settings.gold_earn_percent}
                                            onChange={(e) => setSettings({...settings, gold_earn_percent: parseFloat(e.target.value)})}
                                            className="h-12 rounded-xl"
                                            data-testid="gold-percent-input"
                                        />
                                    </div>
                                    <div>
                                        <Label className="form-label flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                            Platinum (%)
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="100"
                                            value={settings.platinum_earn_percent}
                                            onChange={(e) => setSettings({...settings, platinum_earn_percent: parseFloat(e.target.value)})}
                                            className="h-12 rounded-xl"
                                            data-testid="platinum-percent-input"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-[#52525B] mt-3">Higher tier customers earn more points per order</p>
                            </CardContent>
                        </Card>

                        {/* Redemption Settings */}
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 font-['Montserrat']">Points Redemption</h2>
                        <Card className="rounded-xl border-0 shadow-sm mb-4" data-testid="redemption-settings-card">
                            <CardContent className="p-4 space-y-4">
                                <div className="bg-[#329937]/10 p-3 rounded-lg">
                                    <p className="text-sm text-[#329937] font-medium">1 Point = ₹{settings.redemption_value}</p>
                                    <p className="text-xs text-[#52525B] mt-1">
                                        Example: {settings.bronze_earn_percent}% on ₹1000 = {Math.round(1000 * settings.bronze_earn_percent / 100)} points = ₹{Math.round(1000 * settings.bronze_earn_percent / 100 * settings.redemption_value)} discount
                                    </p>
                                </div>
                                <div>
                                    <Label className="form-label">Point Value (₹ per point)</Label>
                                    <Input
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        value={settings.redemption_value}
                                        onChange={(e) => setSettings({...settings, redemption_value: parseFloat(e.target.value)})}
                                        className="h-12 rounded-xl"
                                        data-testid="redemption-value-input"
                                    />
                                </div>
                                <div>
                                    <Label className="form-label">Minimum Points to Redeem</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={settings.min_redemption_points}
                                        onChange={(e) => setSettings({...settings, min_redemption_points: parseInt(e.target.value)})}
                                        className="h-12 rounded-xl"
                                        data-testid="min-redemption-input"
                                    />
                                    <p className="text-xs text-[#52525B] mt-1">Customer needs at least ₹{settings.min_redemption_points} worth points</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="form-label">Max % of Bill</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={settings.max_redemption_percent || 50}
                                            onChange={(e) => setSettings({...settings, max_redemption_percent: parseFloat(e.target.value)})}
                                            className="h-12 rounded-xl"
                                            data-testid="max-redemption-percent-input"
                                        />
                                        <p className="text-xs text-[#52525B] mt-1">Max {settings.max_redemption_percent || 50}% of bill</p>
                                    </div>
                                    <div>
                                        <Label className="form-label">Max ₹ Amount</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={settings.max_redemption_amount || 500}
                                            onChange={(e) => setSettings({...settings, max_redemption_amount: parseFloat(e.target.value)})}
                                            className="h-12 rounded-xl"
                                            data-testid="max-redemption-amount-input"
                                        />
                                        <p className="text-xs text-[#52525B] mt-1">Max ₹{settings.max_redemption_amount || 500} per order</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Points Expiry Settings */}
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 font-['Montserrat']">Points Expiry</h2>
                        <Card className="rounded-xl border-0 shadow-sm mb-4" data-testid="expiry-settings-card">
                            <CardContent className="p-4 space-y-4">
                                <div className={`p-3 rounded-lg ${settings.points_expiry_months === 0 ? 'bg-gray-100' : 'bg-[#F26B33]/10'}`}>
                                    <p className="text-sm font-medium" style={{color: settings.points_expiry_months === 0 ? '#52525B' : '#F26B33'}}>
                                        {settings.points_expiry_months === 0 
                                            ? "Points Never Expire" 
                                            : `Points expire after ${settings.points_expiry_months} months`
                                        }
                                    </p>
                                    {settings.points_expiry_months > 0 && (
                                        <p className="text-xs text-[#52525B] mt-1">
                                            Customers will be reminded {settings.expiry_reminder_days || 30} days before expiry
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label className="form-label">Expiry Period (months)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="24"
                                        value={settings.points_expiry_months ?? 6}
                                        onChange={(e) => setSettings({...settings, points_expiry_months: parseInt(e.target.value)})}
                                        className="h-12 rounded-xl"
                                        data-testid="expiry-months-input"
                                    />
                                    <p className="text-xs text-[#52525B] mt-1">Set to 0 for no expiry</p>
                                </div>
                                {(settings.points_expiry_months ?? 6) > 0 && (
                                    <div>
                                        <Label className="form-label">Reminder Before (days)</Label>
                                        <Input
                                            type="number"
                                            min="7"
                                            max="90"
                                            value={settings.expiry_reminder_days || 30}
                                            onChange={(e) => setSettings({...settings, expiry_reminder_days: parseInt(e.target.value)})}
                                            className="h-12 rounded-xl"
                                            data-testid="expiry-reminder-input"
                                        />
                                        <p className="text-xs text-[#52525B] mt-1">Send reminder X days before points expire</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tier Thresholds */}
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 font-['Montserrat']">Tier Thresholds</h2>
                        <Card className="rounded-xl border-0 shadow-sm mb-4" data-testid="tier-settings-card">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label className="form-label text-xs">Silver</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={settings.tier_silver_min}
                                            onChange={(e) => setSettings({...settings, tier_silver_min: parseInt(e.target.value)})}
                                            className="h-10 rounded-lg text-sm"
                                            data-testid="tier-silver-input"
                                        />
                                    </div>
                                    <div>
                                        <Label className="form-label text-xs">Gold</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={settings.tier_gold_min}
                                            onChange={(e) => setSettings({...settings, tier_gold_min: parseInt(e.target.value)})}
                                            className="h-10 rounded-lg text-sm"
                                            data-testid="tier-gold-input"
                                        />
                                    </div>
                                    <div>
                                        <Label className="form-label text-xs">Platinum</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={settings.tier_platinum_min}
                                            onChange={(e) => setSettings({...settings, tier_platinum_min: parseInt(e.target.value)})}
                                            className="h-10 rounded-lg text-sm"
                                            data-testid="tier-platinum-input"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-[#52525B] mt-3">Points needed to upgrade customer tier</p>
                            </CardContent>
                        </Card>

                        {/* Bonus Features Section */}
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 mt-6 font-['Montserrat']">🎁 Bonus Features</h2>
                        
                        {/* First Visit Bonus */}
                        <Card className="rounded-xl border-0 shadow-sm mb-4">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-[#1A1A1A]">First Visit Bonus</p>
                                        <p className="text-xs text-[#52525B]">Welcome new customers</p>
                                    </div>
                                    <Switch
                                        checked={settings.first_visit_bonus_enabled ?? true}
                                        onCheckedChange={(checked) => setSettings({...settings, first_visit_bonus_enabled: checked})}
                                        data-testid="first-visit-toggle"
                                    />
                                </div>
                                {settings.first_visit_bonus_enabled && (
                                    <div>
                                        <Label className="form-label">Bonus Points</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={settings.first_visit_bonus_points ?? 50}
                                            onChange={(e) => setSettings({...settings, first_visit_bonus_points: parseInt(e.target.value)})}
                                            className="h-12 rounded-xl"
                                            data-testid="first-visit-points-input"
                                        />
                                        <p className="text-xs text-[#52525B] mt-1">Points awarded on customer's first purchase</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Birthday Bonus */}
                        <Card className="rounded-xl border-0 shadow-sm mb-4">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-[#1A1A1A]">Birthday Bonus 🎂</p>
                                        <p className="text-xs text-[#52525B]">Celebrate customer birthdays</p>
                                    </div>
                                    <Switch
                                        checked={settings.birthday_bonus_enabled ?? true}
                                        onCheckedChange={(checked) => setSettings({...settings, birthday_bonus_enabled: checked})}
                                        data-testid="birthday-toggle"
                                    />
                                </div>
                                {settings.birthday_bonus_enabled && (
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="form-label">Bonus Points</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={settings.birthday_bonus_points ?? 100}
                                                onChange={(e) => setSettings({...settings, birthday_bonus_points: parseInt(e.target.value)})}
                                                className="h-12 rounded-xl"
                                                data-testid="birthday-points-input"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="form-label text-xs">Days Before</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="30"
                                                    value={settings.birthday_bonus_days_before ?? 0}
                                                    onChange={(e) => setSettings({...settings, birthday_bonus_days_before: parseInt(e.target.value)})}
                                                    className="h-10 rounded-lg text-sm"
                                                    data-testid="birthday-days-before"
                                                />
                                            </div>
                                            <div>
                                                <Label className="form-label text-xs">Days After</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="30"
                                                    value={settings.birthday_bonus_days_after ?? 7}
                                                    onChange={(e) => setSettings({...settings, birthday_bonus_days_after: parseInt(e.target.value)})}
                                                    className="h-10 rounded-lg text-sm"
                                                    data-testid="birthday-days-after"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#52525B]">Bonus valid for specified days around customer's birthday</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Anniversary Bonus */}
                        <Card className="rounded-xl border-0 shadow-sm mb-4">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-[#1A1A1A]">Anniversary Bonus 🎉</p>
                                        <p className="text-xs text-[#52525B]">Celebrate anniversaries</p>
                                    </div>
                                    <Switch
                                        checked={settings.anniversary_bonus_enabled ?? true}
                                        onCheckedChange={(checked) => setSettings({...settings, anniversary_bonus_enabled: checked})}
                                        data-testid="anniversary-toggle"
                                    />
                                </div>
                                {settings.anniversary_bonus_enabled && (
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="form-label">Bonus Points</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={settings.anniversary_bonus_points ?? 150}
                                                onChange={(e) => setSettings({...settings, anniversary_bonus_points: parseInt(e.target.value)})}
                                                className="h-12 rounded-xl"
                                                data-testid="anniversary-points-input"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="form-label text-xs">Days Before</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="30"
                                                    value={settings.anniversary_bonus_days_before ?? 0}
                                                    onChange={(e) => setSettings({...settings, anniversary_bonus_days_before: parseInt(e.target.value)})}
                                                    className="h-10 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="form-label text-xs">Days After</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="30"
                                                    value={settings.anniversary_bonus_days_after ?? 7}
                                                    onChange={(e) => setSettings({...settings, anniversary_bonus_days_after: parseInt(e.target.value)})}
                                                    className="h-10 rounded-lg text-sm"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#52525B]">Bonus valid for specified days around anniversary date</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Off-Peak Hours Bonus */}
                        <Card className="rounded-xl border-0 shadow-sm mb-4">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-[#1A1A1A]">Off-Peak Hours Bonus ⏰</p>
                                        <p className="text-xs text-[#52525B]">Drive traffic during slow hours</p>
                                    </div>
                                    <Switch
                                        checked={settings.off_peak_bonus_enabled ?? false}
                                        onCheckedChange={(checked) => setSettings({...settings, off_peak_bonus_enabled: checked})}
                                        data-testid="off-peak-toggle"
                                    />
                                </div>
                                {settings.off_peak_bonus_enabled && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="form-label">Start Time</Label>
                                                <Input
                                                    type="time"
                                                    value={settings.off_peak_start_time ?? "14:00"}
                                                    onChange={(e) => setSettings({...settings, off_peak_start_time: e.target.value})}
                                                    className="h-12 rounded-xl"
                                                    data-testid="off-peak-start"
                                                />
                                            </div>
                                            <div>
                                                <Label className="form-label">End Time</Label>
                                                <Input
                                                    type="time"
                                                    value={settings.off_peak_end_time ?? "17:00"}
                                                    onChange={(e) => setSettings({...settings, off_peak_end_time: e.target.value})}
                                                    className="h-12 rounded-xl"
                                                    data-testid="off-peak-end"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="form-label">Bonus Type</Label>
                                            <Select
                                                value={settings.off_peak_bonus_type ?? "multiplier"}
                                                onValueChange={(value) => setSettings({...settings, off_peak_bonus_type: value})}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl" data-testid="bonus-type-select">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="multiplier">Multiplier (e.g., 2x points)</SelectItem>
                                                    <SelectItem value="flat">Flat Bonus (e.g., +50 points)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="form-label">
                                                {settings.off_peak_bonus_type === "multiplier" ? "Multiplier (e.g., 2.0 for 2x)" : "Flat Points"}
                                            </Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step={settings.off_peak_bonus_type === "multiplier" ? "0.5" : "1"}
                                                value={settings.off_peak_bonus_value ?? 2.0}
                                                onChange={(e) => setSettings({...settings, off_peak_bonus_value: parseFloat(e.target.value)})}
                                                className="h-12 rounded-xl"
                                                data-testid="off-peak-value"
                                            />
                                            <p className="text-xs text-[#52525B] mt-1">
                                                {settings.off_peak_bonus_type === "multiplier" 
                                                    ? "Points will be multiplied by this value" 
                                                    : "Fixed points added to base points"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Feedback/Review Bonus */}
                        <Card className="rounded-xl border-0 shadow-sm mb-4">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-[#1A1A1A]">Feedback Bonus ⭐</p>
                                        <p className="text-xs text-[#52525B]">Reward customers for reviews</p>
                                    </div>
                                    <Switch
                                        checked={settings.feedback_bonus_enabled ?? true}
                                        onCheckedChange={(checked) => setSettings({...settings, feedback_bonus_enabled: checked})}
                                        data-testid="feedback-toggle"
                                    />
                                </div>
                                {settings.feedback_bonus_enabled && (
                                    <div>
                                        <Label className="form-label">Bonus Points</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={settings.feedback_bonus_points ?? 25}
                                            onChange={(e) => setSettings({...settings, feedback_bonus_points: parseInt(e.target.value)})}
                                            className="h-12 rounded-xl"
                                            data-testid="feedback-points-input"
                                        />
                                        <p className="text-xs text-[#52525B] mt-1">Points awarded once when customer submits feedback (one-time bonus)</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <Button 
                            onClick={handleSave}
                            className="w-full h-12 bg-[#F26B33] hover:bg-[#D85A2A] rounded-full mb-4"
                            disabled={saving}
                            data-testid="save-settings-btn"
                        >
                            {saving ? "Saving..." : "Save All Settings"}
                        </Button>
                    </>
                )}

                {/* Logout */}
                <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full h-12 rounded-full border-red-500 text-red-500 hover:bg-red-50"
                    data-testid="logout-btn"
                >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
            </div>
        </MobileLayout>
    );
};

// ============ WHATSAPP AUTOMATION PAGE ============

const WhatsAppAutomationPage = () => {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [automationRules, setAutomationRules] = useState([]);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("settings");
    const [whatsappApiKey, setWhatsappApiKey] = useState("");
    const [savingApiKey, setSavingApiKey] = useState(false);
    
    // Template form state
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [templateForm, setTemplateForm] = useState({
        name: "",
        message: "",
        media_type: null,
        media_url: "",
        variables: []
    });
    
    // Automation rule form state
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [ruleForm, setRuleForm] = useState({
        event_type: "",
        template_id: "",
        is_enabled: true,
        delay_minutes: 0
    });

    // Available template variables
    const availableVariables = [
        { key: "customer_name", label: "Customer Name", example: "John" },
        { key: "points_balance", label: "Points Balance", example: "1,250" },
        { key: "points_earned", label: "Points Earned", example: "50" },
        { key: "points_redeemed", label: "Points Redeemed", example: "100" },
        { key: "wallet_balance", label: "Wallet Balance", example: "₹500" },
        { key: "amount", label: "Amount", example: "₹1,000" },
        { key: "tier", label: "Customer Tier", example: "Gold" },
        { key: "restaurant_name", label: "Restaurant Name", example: "Demo Restaurant" },
        { key: "coupon_code", label: "Coupon Code", example: "SAVE20" },
        { key: "expiry_date", label: "Expiry Date", example: "31 Dec 2025" }
    ];

    // Event labels for better display
    const eventLabels = {
        "points_earned": "Points Earned (Purchase)",
        "points_redeemed": "Points Redeemed",
        "bonus_points": "Bonus Points Given",
        "wallet_credit": "Wallet Top-up",
        "wallet_debit": "Wallet Payment",
        "birthday": "Birthday Wish",
        "anniversary": "Anniversary Wish",
        "first_visit": "First Visit Welcome",
        "tier_upgrade": "Tier Upgrade",
        "coupon_earned": "Coupon Received",
        "points_expiring": "Points Expiring Reminder",
        "feedback_received": "Feedback Thank You",
        "inactive_reminder": "Win-back Message"
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [templatesRes, rulesRes, eventsRes, apiKeyRes] = await Promise.all([
                api.get("/whatsapp/templates"),
                api.get("/whatsapp/automation"),
                api.get("/whatsapp/automation/events"),
                api.get("/whatsapp/api-key")
            ]);
            setTemplates(templatesRes.data);
            setAutomationRules(rulesRes.data);
            setAvailableEvents(eventsRes.data.events || []);
            setWhatsappApiKey(apiKeyRes.data.authkey_api_key || "");
        } catch (err) {
            toast.error("Failed to load WhatsApp settings");
        } finally {
            setLoading(false);
        }
    };

    // Template CRUD
    const handleSaveApiKey = async () => {
        setSavingApiKey(true);
        try {
            await api.put("/whatsapp/api-key", { authkey_api_key: whatsappApiKey });
            toast.success("WhatsApp API key saved!");
        } catch (err) {
            toast.error("Failed to save API key");
        } finally {
            setSavingApiKey(false);
        }
    };

    const handleSaveTemplate = async () => {
        try {
            if (editingTemplate) {
                await api.put(`/whatsapp/templates/${editingTemplate.id}`, templateForm);
                toast.success("Template updated!");
            } else {
                await api.post("/whatsapp/templates", templateForm);
                toast.success("Template created!");
            }
            setShowTemplateModal(false);
            setEditingTemplate(null);
            setTemplateForm({ name: "", message: "", media_type: null, media_url: "", variables: [] });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to save template");
        }
    };

    const handleEditTemplate = (template) => {
        setEditingTemplate(template);
        setTemplateForm({
            name: template.name,
            message: template.message,
            media_type: template.media_type || null,
            media_url: template.media_url || "",
            variables: template.variables || []
        });
        setShowTemplateModal(true);
    };

    const handleDeleteTemplate = async (templateId) => {
        if (!window.confirm("Are you sure you want to delete this template?")) return;
        try {
            await api.delete(`/whatsapp/templates/${templateId}`);
            toast.success("Template deleted!");
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to delete template");
        }
    };

    // Automation Rule CRUD
    const handleSaveRule = async () => {
        try {
            if (editingRule) {
                await api.put(`/whatsapp/automation/${editingRule.id}`, ruleForm);
                toast.success("Automation rule updated!");
            } else {
                await api.post("/whatsapp/automation", ruleForm);
                toast.success("Automation rule created!");
            }
            setShowRuleModal(false);
            setEditingRule(null);
            setRuleForm({ event_type: "", template_id: "", is_enabled: true, delay_minutes: 0 });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to save rule");
        }
    };

    const handleEditRule = (rule) => {
        setEditingRule(rule);
        setRuleForm({
            event_type: rule.event_type,
            template_id: rule.template_id,
            is_enabled: rule.is_enabled,
            delay_minutes: rule.delay_minutes || 0
        });
        setShowRuleModal(true);
    };

    const handleDeleteRule = async (ruleId) => {
        if (!window.confirm("Are you sure you want to delete this automation rule?")) return;
        try {
            await api.delete(`/whatsapp/automation/${ruleId}`);
            toast.success("Automation rule deleted!");
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to delete rule");
        }
    };

    const handleToggleRule = async (ruleId) => {
        try {
            await api.post(`/whatsapp/automation/${ruleId}/toggle`);
            fetchData();
        } catch (err) {
            toast.error("Failed to toggle rule");
        }
    };

    const toggleVariable = (varKey) => {
        setTemplateForm(prev => ({
            ...prev,
            variables: prev.variables.includes(varKey)
                ? prev.variables.filter(v => v !== varKey)
                : [...prev.variables, varKey]
        }));
    };

    const insertVariableInMessage = (varKey) => {
        setTemplateForm(prev => ({
            ...prev,
            message: prev.message + `{{${varKey}}}`
        }));
        if (!templateForm.variables.includes(varKey)) {
            toggleVariable(varKey);
        }
    };

    // Get template name by ID
    const getTemplateName = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        return template?.name || "Unknown Template";
    };

    // Preview message with variable placeholders highlighted
    const renderPreviewMessage = (message) => {
        if (!message) return "";
        return message.replace(/\{\{(\w+)\}\}/g, (match, varKey) => {
            const varInfo = availableVariables.find(v => v.key === varKey);
            return `[${varInfo?.example || varKey}]`;
        });
    };

    if (loading) {
        return (
            <MobileLayout>
                <div className="p-4 max-w-lg mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <div className="p-4 max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button 
                        onClick={() => navigate("/settings")}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        data-testid="back-btn"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']" data-testid="whatsapp-title">
                            WhatsApp Automation
                        </h1>
                        <p className="text-sm text-[#52525B]">Templates & event triggers</p>
                    </div>
                </div>

                {/* Info Banner */}
                <Card className="rounded-xl border-0 shadow-sm mb-4 bg-[#25D366]/10">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <MessageSquare className="w-5 h-5 text-[#25D366] mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-[#1A1A1A]">Automated WhatsApp Messages</p>
                                <p className="text-xs text-[#52525B] mt-1">
                                    Create message templates and configure which events trigger automatic WhatsApp messages to your customers.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                    <TabsList className="w-full grid grid-cols-3 h-12 bg-gray-100 rounded-xl p-1">
                        <TabsTrigger 
                            value="settings" 
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            data-testid="whatsapp-settings-tab"
                        >
                            Settings
                        </TabsTrigger>
                        <TabsTrigger 
                            value="templates" 
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            data-testid="templates-tab"
                        >
                            Templates ({templates.length})
                        </TabsTrigger>
                        <TabsTrigger 
                            value="automation" 
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            data-testid="automation-tab"
                        >
                            Automation ({automationRules.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Templates Tab */}
                    <TabsContent value="templates" className="mt-4">
                        <Button 
                            onClick={() => {
                                setEditingTemplate(null);
                                setTemplateForm({ name: "", message: "", media_type: null, media_url: "", variables: [] });
                                setShowTemplateModal(true);
                            }}
                            className="w-full h-12 bg-[#25D366] hover:bg-[#20BD5A] rounded-xl mb-4"
                            data-testid="add-template-btn"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Create New Template
                        </Button>

                        {templates.length === 0 ? (
                            <Card className="rounded-xl border-0 shadow-sm">
                                <CardContent className="p-8 text-center">
                                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-[#52525B]">No templates yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Create your first message template</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {templates.map(template => (
                                    <Card key={template.id} className="rounded-xl border-0 shadow-sm" data-testid={`template-${template.id}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-semibold text-[#1A1A1A]">{template.name}</p>
                                                    {template.variables?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {template.variables.map(v => (
                                                                <Badge key={v} variant="outline" className="text-xs">
                                                                    {`{{${v}}}`}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        onClick={() => handleEditTemplate(template)}
                                                        className="p-2 hover:bg-gray-100 rounded-full"
                                                        data-testid={`edit-template-${template.id}`}
                                                    >
                                                        <Edit2 className="w-4 h-4 text-[#52525B]" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteTemplate(template.id)}
                                                        className="p-2 hover:bg-red-50 rounded-full"
                                                        data-testid={`delete-template-${template.id}`}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-[#52525B] whitespace-pre-wrap">{template.message}</p>
                                            </div>
                                            {template.media_type && (
                                                <p className="text-xs text-[#52525B] mt-2 flex items-center gap-1">
                                                    📎 {template.media_type} attached
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Automation Tab */}
                    <TabsContent value="automation" className="mt-4">
                        {templates.length === 0 ? (
                            <Card className="rounded-xl border-0 shadow-sm">
                                <CardContent className="p-8 text-center">
                                    <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                                    <p className="text-[#52525B]">Create templates first</p>
                                    <p className="text-xs text-gray-400 mt-1">You need at least one template to create automation rules</p>
                                    <Button 
                                        onClick={() => setActiveTab("templates")}
                                        variant="outline"
                                        className="mt-4"
                                    >
                                        Go to Templates
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <Button 
                                    onClick={() => {
                                        setEditingRule(null);
                                        setRuleForm({ event_type: "", template_id: "", is_enabled: true, delay_minutes: 0 });
                                        setShowRuleModal(true);
                                    }}
                                    className="w-full h-12 bg-[#F26B33] hover:bg-[#D85A2A] rounded-xl mb-4"
                                    data-testid="add-rule-btn"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Automation Rule
                                </Button>

                                {automationRules.length === 0 ? (
                                    <Card className="rounded-xl border-0 shadow-sm">
                                        <CardContent className="p-8 text-center">
                                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-[#52525B]">No automation rules yet</p>
                                            <p className="text-xs text-gray-400 mt-1">Set up automatic messages for events</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="space-y-3">
                                        {automationRules.map(rule => (
                                            <Card key={rule.id} className="rounded-xl border-0 shadow-sm" data-testid={`rule-${rule.id}`}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Badge className={`${rule.is_enabled ? 'bg-[#25D366]' : 'bg-gray-400'} text-white`}>
                                                                    {rule.is_enabled ? "Active" : "Inactive"}
                                                                </Badge>
                                                                {rule.delay_minutes > 0 && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {rule.delay_minutes}m delay
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="font-semibold text-[#1A1A1A]">
                                                                {eventLabels[rule.event_type] || rule.event_type}
                                                            </p>
                                                            <p className="text-sm text-[#52525B] mt-1 flex items-center gap-1">
                                                                <ChevronRight className="w-3 h-3" />
                                                                Template: <span className="font-medium">{getTemplateName(rule.template_id)}</span>
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Switch 
                                                                checked={rule.is_enabled}
                                                                onCheckedChange={() => handleToggleRule(rule.id)}
                                                                data-testid={`toggle-rule-${rule.id}`}
                                                            />
                                                            <button 
                                                                onClick={() => handleEditRule(rule)}
                                                                className="p-2 hover:bg-gray-100 rounded-full"
                                                                data-testid={`edit-rule-${rule.id}`}
                                                            >
                                                                <Edit2 className="w-4 h-4 text-[#52525B]" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteRule(rule.id)}
                                                                className="p-2 hover:bg-red-50 rounded-full"
                                                                data-testid={`delete-rule-${rule.id}`}
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* Available Events Guide */}
                                <Card className="rounded-xl border-0 shadow-sm mt-6">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-semibold">Available Events</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <ScrollArea className="h-48">
                                            <div className="space-y-2">
                                                {availableEvents.map(event => {
                                                    const hasRule = automationRules.some(r => r.event_type === event.event);
                                                    return (
                                                        <div key={event.event} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                                            <div>
                                                                <p className="text-sm font-medium text-[#1A1A1A]">{eventLabels[event.event] || event.event}</p>
                                                                <p className="text-xs text-[#52525B]">{event.description}</p>
                                                            </div>
                                                            {hasRule ? (
                                                                <Badge className="bg-[#25D366] text-white text-xs">Configured</Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-xs">Not set</Badge>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="mt-4">
                        <Card className="rounded-xl border-0 shadow-sm" data-testid="whatsapp-api-key-card">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                                        <KeyRound className="w-5 h-5 text-[#25D366]" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#1A1A1A]">WhatsApp API Key</p>
                                        <p className="text-xs text-[#52525B] mt-1">
                                            Enter your AuthKey.io API key to authenticate and send WhatsApp messages to customers.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="form-label">API Key</Label>
                                    <Input
                                        type="password"
                                        value={whatsappApiKey}
                                        onChange={(e) => setWhatsappApiKey(e.target.value)}
                                        placeholder="Enter your AuthKey.io API key"
                                        className="h-12 rounded-xl font-mono"
                                        data-testid="whatsapp-api-key-input"
                                    />
                                </div>
                                <Button
                                    onClick={handleSaveApiKey}
                                    disabled={savingApiKey}
                                    className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white"
                                    data-testid="save-whatsapp-api-key-btn"
                                >
                                    {savingApiKey ? "Saving..." : "Save API Key"}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Template Modal */}
                <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
                            <DialogDescription>
                                Create a reusable message template with dynamic variables.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label className="form-label">Template Name</Label>
                                <Input 
                                    value={templateForm.name}
                                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                                    placeholder="e.g., Welcome Message, Points Update"
                                    className="h-12 rounded-xl"
                                    data-testid="template-name-input"
                                />
                            </div>
                            
                            <div>
                                <Label className="form-label">Message</Label>
                                <Textarea 
                                    value={templateForm.message}
                                    onChange={(e) => setTemplateForm({...templateForm, message: e.target.value})}
                                    placeholder="Hi {{customer_name}}, you've earned {{points_earned}} points!"
                                    className="min-h-[120px] rounded-xl"
                                    data-testid="template-message-input"
                                />
                                <p className="text-xs text-[#52525B] mt-1">Use {"{{variable}}"} to insert dynamic content</p>
                            </div>

                            <div>
                                <Label className="form-label mb-2 block">Insert Variables</Label>
                                <div className="flex flex-wrap gap-2">
                                    {availableVariables.map(v => (
                                        <button
                                            key={v.key}
                                            type="button"
                                            onClick={() => insertVariableInMessage(v.key)}
                                            className={`px-2 py-1 text-xs rounded-lg border transition-colors ${
                                                templateForm.variables.includes(v.key) 
                                                    ? 'bg-[#25D366] text-white border-[#25D366]' 
                                                    : 'bg-white text-[#52525B] border-gray-200 hover:border-[#25D366]'
                                            }`}
                                            data-testid={`var-${v.key}`}
                                        >
                                            {v.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label className="form-label">Media Type (Optional)</Label>
                                <Select 
                                    value={templateForm.media_type || "none"}
                                    onValueChange={(v) => setTemplateForm({...templateForm, media_type: v === "none" ? null : v})}
                                >
                                    <SelectTrigger className="h-12 rounded-xl" data-testid="media-type-select">
                                        <SelectValue placeholder="No media" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No media</SelectItem>
                                        <SelectItem value="image">Image</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="document">Document</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {templateForm.media_type && (
                                <div>
                                    <Label className="form-label">Media URL</Label>
                                    <Input 
                                        value={templateForm.media_url}
                                        onChange={(e) => setTemplateForm({...templateForm, media_url: e.target.value})}
                                        placeholder="https://example.com/image.jpg"
                                        className="h-12 rounded-xl"
                                        data-testid="media-url-input"
                                    />
                                </div>
                            )}

                            {/* Preview */}
                            {templateForm.message && (
                                <div>
                                    <Label className="form-label">Preview</Label>
                                    <div className="bg-[#DCF8C6] p-3 rounded-lg rounded-tl-none">
                                        <p className="text-sm whitespace-pre-wrap">{renderPreviewMessage(templateForm.message)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSaveTemplate}
                                className="bg-[#25D366] hover:bg-[#20BD5A]"
                                disabled={!templateForm.name || !templateForm.message}
                                data-testid="save-template-btn"
                            >
                                {editingTemplate ? "Update" : "Create"} Template
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Automation Rule Modal */}
                <Dialog open={showRuleModal} onOpenChange={setShowRuleModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingRule ? "Edit Automation Rule" : "Add Automation Rule"}</DialogTitle>
                            <DialogDescription>
                                Configure when to automatically send WhatsApp messages.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label className="form-label">Trigger Event</Label>
                                <Select 
                                    value={ruleForm.event_type}
                                    onValueChange={(v) => setRuleForm({...ruleForm, event_type: v})}
                                    disabled={!!editingRule}
                                >
                                    <SelectTrigger className="h-12 rounded-xl" data-testid="event-type-select">
                                        <SelectValue placeholder="Select an event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableEvents.map(event => {
                                            const hasRule = automationRules.some(r => r.event_type === event.event && r.id !== editingRule?.id);
                                            return (
                                                <SelectItem 
                                                    key={event.event} 
                                                    value={event.event}
                                                    disabled={hasRule}
                                                >
                                                    {eventLabels[event.event] || event.event}
                                                    {hasRule && " (already configured)"}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="form-label">Message Template</Label>
                                <Select 
                                    value={ruleForm.template_id}
                                    onValueChange={(v) => setRuleForm({...ruleForm, template_id: v})}
                                >
                                    <SelectTrigger className="h-12 rounded-xl" data-testid="template-select">
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map(template => (
                                            <SelectItem key={template.id} value={template.id}>
                                                {template.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="form-label">Delay (minutes)</Label>
                                <Input 
                                    type="number"
                                    min="0"
                                    value={ruleForm.delay_minutes}
                                    onChange={(e) => setRuleForm({...ruleForm, delay_minutes: parseInt(e.target.value) || 0})}
                                    className="h-12 rounded-xl"
                                    data-testid="delay-input"
                                />
                                <p className="text-xs text-[#52525B] mt-1">0 = send immediately, or delay by X minutes</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="form-label">Enable Rule</Label>
                                <Switch 
                                    checked={ruleForm.is_enabled}
                                    onCheckedChange={(checked) => setRuleForm({...ruleForm, is_enabled: checked})}
                                    data-testid="enable-rule-switch"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setShowRuleModal(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSaveRule}
                                className="bg-[#F26B33] hover:bg-[#D85A2A]"
                                disabled={!ruleForm.event_type || !ruleForm.template_id}
                                data-testid="save-rule-btn"
                            >
                                {editingRule ? "Update" : "Create"} Rule
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MobileLayout>
    );
};

// ============ PUBLIC CUSTOMER REGISTRATION ============

const CustomerRegistrationPage = () => {
    const { restaurantId } = useParams();
    const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
    const [restaurantName, setRestaurantName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${API}/qr/register/${restaurantId}`, formData);
            setSuccess(true);
            toast.success("Registration successful!");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center p-6">
                <div className="w-20 h-20 bg-[#329937] rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#1A1A1A] text-center font-['Montserrat']">Welcome!</h1>
                <p className="text-[#52525B] text-center mt-2">You're now part of our loyalty program.</p>
                <p className="text-[#52525B] text-center mt-1">Earn points on every visit!</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F9F7] flex flex-col justify-center p-6">
            <div className="max-w-sm mx-auto w-full">
                <div className="text-center mb-8">
                    <img 
                        src="https://customer-assets.emergentagent.com/job_dine-points-app/artifacts/acdjlx1x_mygenie_logo.svg" 
                        alt="MyGenie Logo" 
                        className="h-16 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-['Montserrat']">Join Our Loyalty Program</h1>
                    <p className="text-[#52525B] mt-2">Earn points on every purchase</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="form-label">Your Name *</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Enter your name"
                            className="h-12 rounded-xl"
                            required
                            data-testid="public-reg-name"
                        />
                    </div>
                    <div>
                        <Label className="form-label">Phone Number *</Label>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="9876543210"
                            className="h-12 rounded-xl"
                            required
                            data-testid="public-reg-phone"
                        />
                    </div>
                    <div>
                        <Label className="form-label">Email (optional)</Label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="your@email.com"
                            className="h-12 rounded-xl"
                            data-testid="public-reg-email"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="w-full h-12 rounded-full bg-[#F26B33] hover:bg-[#D85A2A] text-white font-semibold active-scale"
                        disabled={submitting}
                        data-testid="public-reg-submit"
                    >
                        {submitting ? "Joining..." : "Join Now"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

// ============ MAIN APP ============

// Demo Mode Entry Component
function App() {
    return (
        <AuthProviderComponent>
            <div className="App">
                <Toaster position="top-center" richColors />
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/register-customer/:restaurantId" element={<CustomerRegistrationPage />} />

                        {/* Protected Routes */}
                        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
                        <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetailPage /></ProtectedRoute>} />
                        <Route path="/segments" element={<ProtectedRoute><SegmentsPage /></ProtectedRoute>} />
                        <Route path="/qr" element={<ProtectedRoute><QRCodePage /></ProtectedRoute>} />
                        <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
                        <Route path="/coupons" element={<ProtectedRoute><CouponsPage /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                        <Route path="/whatsapp-automation" element={<ProtectedRoute><WhatsAppAutomationPage /></ProtectedRoute>} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </AuthProviderComponent>
    );
}

export default App;
