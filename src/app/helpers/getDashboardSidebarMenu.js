import {
  Home,
  Users,
  Building2,
  CreditCard,
  FileSpreadsheet,
  PlusCircle,
  Settings,
  SettingsIcon,
  Pen,
  FileText,
  Wrench,
  MessageSquare,
  User,
  Bell,
  HeartPlus,
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
  { title: "Leases", href: "/dashboard/owner/leases", icon: FileText },
  { title: "Add New Property", href: "/dashboard/owner/properties/add", icon: PlusCircle },

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
  { title: "Blogs", href: "/dashboard/admin/blog", icon: Pen },

  // Finance
  { title: "All Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },

  // Tools
  { title: "Export CSV", href: "/dashboard/admin/export", icon: FileSpreadsheet },
  { title: "Settings", href: "/dashboard/admin/setting", icon: SettingsIcon },
];

//
// ================================
// TENANT MENU
// ================================
//

const tenantMenu = [
  { title: "Dashboard", href: "/dashboard", icon: Home },

  { title: "My Properties", href: "/dashboard/tenant/properties", icon: Building2 },
  { title: "Leases", href: "/dashboard/tenant/leases", icon: FileText },
  { title: "Payments", href: "/dashboard/tenant/payments", icon: CreditCard },
  // { title: "Maintenance", href: "/dashboard/tenant/maintenance", icon: Wrench },
  // { title: "Favorites", href: "/dashboard/tenant/favorite", icon: HeartPlus },
  { title: "Profile", href: "/dashboard/tenant/profile", icon: User }
];

//
// ================================
// EXPORT FUNCTION
// ================================
//

export function getDashboardSideMenu(role) {
  if (role === "admin" || role === "super_admin") return adminMenu;
  if (role === "owner") return ownerMenu;
  if (role === "tenant") return tenantMenu;

  return [];
}
