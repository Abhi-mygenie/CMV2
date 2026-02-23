export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Country codes for phone
export const COUNTRY_CODES = [
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
export const COMMON_ALLERGIES = [
    "Gluten", "Dairy", "Eggs", "Peanuts", "Tree Nuts", 
    "Soy", "Fish", "Shellfish", "Sesame", "Mustard"
];

// Custom field 1 dropdown options
export const CUSTOM_FIELD_1_OPTIONS = [
    "Dine-in",
    "Takeaway",
    "Delivery",
    "Corporate",
    "Event",
    "Other"
];
