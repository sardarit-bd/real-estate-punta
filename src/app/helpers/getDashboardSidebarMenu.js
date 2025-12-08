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
    SettingsIcon,
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
    // { title: "Featured Listings", href: "/dashboard/owner/featured", icon: Star },

    // Payments
    { title: "My Payments", href: "/dashboard/owner/payments", icon: CreditCard },

    // Profile
    { title: "My Account", href: "/dashboard/owner/profile", icon: Settings },
];

//
// ================================
// ADMIN MENU
// ================================
//

const adminMenu = [
    { title: "Dashboard", href: "/dashboard", icon: Home },

    // User Management
    { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },

    // Property Moderation
    { title: "Manage Properties", href: "/dashboard/admin/properties", icon: Building2 },

    { title: "All Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },

    // CSV Export
    { title: "Export CSV", href: "/dashboard/admin/export", icon: FileSpreadsheet },
    {title: "Settings", href: "/dashboard/admin/setting", icon: SettingsIcon}

    // Reports
    // { title: "Reports & Logs", href: "/dashboard/admin/reports", icon: ClipboardList },
];

//
// ================================
// EXPORT FUNCTION
// ================================
//

export function getDashboardSideMenu(role) {
    if (role === "admin" || role == 'super_admin') return adminMenu;
    if (role === "owner") return ownerMenu;
    return []; // Public users have no dashboard
}
