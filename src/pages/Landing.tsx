import { Link } from 'react-router-dom';
import { Music, Zap, Globe, BarChart3, ArrowRight, Disc3, UserCircle, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const features = [
  { icon: Sparkles, title: 'Instant Registration', desc: 'Sign up in seconds and start distributing your music immediately. No waiting, no hassle.', isSpotify: false },
  { icon: UserCircle, title: 'Manage Your Artist Profile', desc: 'Customize your artist profile with bio, photos, and social links to connect with fans.', isSpotify: false },
  { icon: SpotifyIcon, title: 'Pitch to Spotify Editors', desc: 'Submit your tracks directly to Spotify\'s playlist editors for consideration on curated playlists.', isSpotify: true },
  { icon: BarChart3, title: 'Listener Analytics', desc: 'Deep insights into your audience demographics, listening habits, and geographic distribution.', isSpotify: false },
  { icon: Palette, title: 'Customize Your Profile', desc: 'Personalize your artist image with custom branding, colors, and professional profile management.', isSpotify: false },
  { icon: Globe, title: 'Global Distribution', desc: 'Deliver to 150+ DSPs including Spotify, Apple Music, Amazon, and more.', isSpotify: false },
  { icon: Zap, title: 'DDEX Compliant', desc: 'Industry-standard metadata delivery ensuring your releases are properly formatted.', isSpotify: false },
  { icon: Disc3, title: 'Release Management', desc: 'Manage singles, EPs, and albums with full metadata control and real-time updates.', isSpotify: false },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg">Distro Music</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/pricing">
              <Button variant="ghost" size="sm">Pricing</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Everything You Need to Succeed
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your Music, <span className="text-gradient">Everywhere</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of artists distributing their music worldwide. Pitch to Spotify editors, understand your audience, and grow your career—all from one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple px-8">
                Start Free Today <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
              <SpotifyIcon className="w-4 h-4" />
              Spotify Pitching
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm">
              <BarChart3 className="w-4 h-4" />
              Real-time Analytics
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-sm">
              <Palette className="w-4 h-4" />
              Profile Customization
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Unlimited Distribution, One Low Price
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-95">
            Pay only R459.99/year for unlimited uploads and get your music into stores 10-20x faster than any other distributor.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pricing">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8">
                View Pricing
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Start Free Trial
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>10-20x Faster Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>150+ Stores Worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Keep 100% of Royalties</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything Artists Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional tools to help you distribute, promote, and grow your music career
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.slice(0, 4).map((f) => (
              <div key={f.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {f.isSpotify ? (
                    <f.icon className="w-6 h-6 text-green-500" />
                  ) : (
                    <f.icon className="w-6 h-6 text-primary" />
                  )}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.slice(4).map((f) => (
              <div key={f.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {f.isSpotify ? (
                    <f.icon className="w-6 h-6 text-green-500" />
                  ) : (
                    <f.icon className="w-6 h-6 text-primary" />
                  )}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © 2026 Distro Music. All rights reserved.
      </footer>
    </div>
  );
}
