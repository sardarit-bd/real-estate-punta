import {
    Home,
    Users,
    UserCog,
    Building2,
    Star,
    CreditCard,
    BarChart3,
    FileSpreadsheet,
    ClipboardList,
    LineChart,
    FolderTree,
    DollarSign,
    PlusCircle,
    Edit,
    Trash2,
    Settings,
} from "lucide-react";

//
// ================================
// OWNER MENU
// ================================
//

const ownerMenu = [
    { title: "Dashboard", href: "/dashboard", icon: Home },

    // Property Management
    { title: "My Properties", href: "/dashboard/owner/properties", icon: Building2 },
    { title: "Add New Property", href: "/dashboard/owner/properties/add", icon: PlusCircle },
    { title: "Featured Listings", href: "/dashboard/owner/featured", icon: Star },

    // Payments
    { title: "My Payments", href: "/dashboard/owner/payments", icon: CreditCard },

    // Profile
    { title: "My Account", href: "/dashboard/profile", icon: Settings },
];

//
// ================================
// ADMIN MENU
// ================================
//

const adminMenu = [
    { title: "Dashboard", href: "/dashboard", icon: Home },

    // KPI + Analytics Dashboard
    { title: "Analytics & KPIs", href: "/dashboard/admin/analytics", icon: LineChart },

    // User Management
    { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },

    // Property Moderation
    { title: "Manage Properties", href: "/dashboard/admin/properties", icon: Building2 },
    { title: "Categories / Property Types", href: "/dashboard/admin/categories", icon: FolderTree },

    // Payment Reporting
    { title: "Payment Analytics", href: "/dashboard/admin/payment-analytics", icon: DollarSign },
    { title: "All Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },

    // CSV Export
    { title: "Export CSV", href: "/dashboard/admin/export", icon: FileSpreadsheet },

    // Reports
    { title: "Reports & Logs", href: "/dashboard/admin/reports", icon: ClipboardList },
];

//
// ================================
// EXPORT FUNCTION
// ================================
//

export function getDashboardSideMenu(role) {
    if (role === "admin") return adminMenu;
    if (role === "owner") return ownerMenu;
    return []; // Public users have no dashboard
}
