// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   MessageSquare,
//   Settings,
//   Menu,
//   X,
//   Mic,
//   Search,
//   Bell,
//   User,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface AppShellProps {
//   children: React.ReactNode;
// }

// export function AppShell({ children }: AppShellProps) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const pathname = usePathname();

//   const navigation = [
//     { name: "Dashboard", href: "/", icon: LayoutDashboard },
//     { name: "Meetings", href: "/meetings", icon: Mic },
//     { name: "Chat", href: "/chat", icon: MessageSquare }, // Assuming these routes might exist or be planned
//     { name: "Settings", href: "/settings", icon: Settings },
//   ];

//   return (
//     <div className="min-h-screen bg-background flex flex-col md:flex-row">
//       {/* Mobile Header */}
//       <header className="md:hidden flex items-center justify-between p-4 border-b bg-card z-20 sticky top-0">
//         <div className="flex items-center gap-2 font-bold text-xl text-primary">
//           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
//             <Mic className="w-5 h-5 text-primary" />
//           </div>
//           MeetingMate
//         </div>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         >
//           {isSidebarOpen ? <X /> : <Menu />}
//         </Button>
//       </header>

//       {/* Sidebar Overlay (Mobile) */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={cn(
//           "fixed md:sticky top-0 left-0 z-40 h-screen w-[280px] bg-card border-r transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <div className="p-6 flex items-center gap-3 font-bold text-2xl text-primary">
//           <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
//             <Mic className="w-6 h-6 text-primary-foreground" />
//           </div>
//           MeetingMate
//         </div>

//         <div className="px-4 py-2">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full h-10 pl-9 pr-4 rounded-lg bg-secondary/50 border-none text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
//             />
//           </div>
//         </div>

//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//           <div className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
//             Main Menu
//           </div>
//           {navigation.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 onClick={() => setIsSidebarOpen(false)}
//                 className={cn(
//                   "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
//                   isActive
//                     ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
//                     : "text-muted-foreground hover:bg-secondary hover:text-foreground"
//                 )}
//               >
//                 <item.icon
//                   className={cn(
//                     "w-5 h-5 transition-transform group-hover:scale-110",
//                     isActive
//                       ? "text-primary-foreground"
//                       : "text-muted-foreground group-hover:text-foreground"
//                   )}
//                 />
//                 {item.name}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t bg-card/50">
//           <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer group">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
//               <User className="w-5 h-5" />
//             </div>
//             <div className="flex-1 overflow-hidden">
//               <p className="text-sm font-semibold truncate">Arnob Sen</p>
//               <p className="text-xs text-muted-foreground truncate">
//                 arnob@example.com
//               </p>
//             </div>
//             <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 min-w-0 overflow-y-auto h-screen bg-background/50">
//         {/* Desktop Header for Breadcrumbs/Actions (Optional, keeping simple for now) */}
//         <div className="hidden md:flex items-center justify-between p-6 pb-0 max-w-7xl mx-auto">
//           <div className="text-sm breadcrumbs text-muted-foreground">
//             <span className="hover:text-foreground cursor-pointer transition-colors">
//               Workspace
//             </span>
//             <span className="mx-2">/</span>
//             <span className="font-medium text-foreground">Dashboard</span>
//           </div>
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" className="rounded-full">
//               <Bell className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>

//         <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Menu,
  X,
  Mic,
  Search,
  Bell,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Meetings", href: "/meetings", icon: Mic },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b bg-card">
        <div className="flex items-center gap-2 font-semibold">
          <Mic className="w-5 h-5" />
          MeetingMate
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 z-30 h-screen bg-card border-r flex flex-col transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-[260px]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand + Collapse */}
        <div className="h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 font-semibold overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            {!isCollapsed && <span>MeetingMate</span>}
          </div>

          {/* Desktop collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Search (hidden when collapsed) */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-secondary font-medium"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t">
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 text-sm overflow-hidden">
                <p className="font-medium truncate">Arnob Sen</p>
                <p className="text-xs text-muted-foreground truncate">
                  arnob@example.com
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-8 py-4">
          <span className="text-sm text-muted-foreground">Dashboard</span>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Page Content */}
        <div className="px-4 md:px-8 pb-8">{children}</div>
      </main>
    </div>
  );
}
