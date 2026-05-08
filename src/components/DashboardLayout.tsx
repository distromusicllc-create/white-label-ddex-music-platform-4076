import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, LayoutDashboard, Disc3, BarChart3, Plus, LogOut, Menu, X, DollarSign, Settings, HelpCircle, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', isSpotify: false },
  { to: '/dashboard/releases', icon: Disc3, label: 'Releases', isSpotify: false },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics', isSpotify: false },
  { to: '/dashboard/earnings', icon: DollarSign, label: 'Earnings', isSpotify: false },
  { to: '/dashboard/spotify-pitching', icon: SpotifyIcon, label: 'Spotify Pitching', isSpotify: true },
  { to: '/pricing', icon: CreditCard, label: 'Upgrade Plan', isSpotify: false },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings', isSpotify: false },
  { to: '/dashboard/help', icon: HelpCircle, label: 'Help', isSpotify: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col transition-transform md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
          <Music className="w-5 h-5 text-primary" />
          <span className="font-display font-bold">Distro Music</span>
          <button className="ml-auto md:hidden" onClick={() => setMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.to
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              {item.isSpotify ? (
                <item.icon className="w-4 h-4 text-green-500" />
              ) : (
                <item.icon className="w-4 h-4" />
              )}
              {item.label}
            </Link>
          ))}
          <Link
            to="/dashboard/releases/new"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary hover:bg-sidebar-accent/50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Release
          </Link>
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground truncate mb-2">{user?.email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64">
        <header className="h-16 flex items-center px-6 border-b border-border md:hidden">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 font-display font-bold">Distro Music</span>
        </header>
        <main className="p-6 md:p-8 max-w-6xl">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}
