import { Link } from 'react-router-dom';
import { Music, Zap, Globe, BarChart3, ArrowRight, Disc3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Globe, title: 'Global Distribution', desc: 'Deliver to 150+ DSPs including Spotify, Apple Music, Amazon, and more.' },
  { icon: Zap, title: 'DDEX Compliant', desc: 'Industry-standard metadata delivery ensuring your releases are properly formatted.' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track streams, revenue, and audience growth across all platforms.' },
  { icon: Disc3, title: 'Release Management', desc: 'Manage singles, EPs, and albums with full metadata control.' },
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
            <Zap className="w-3.5 h-3.5" />
            DDEX-Compliant Distribution
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Distribute Your Music <span className="text-gradient">Worldwide</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Get your music on every major streaming platform with industry-standard DDEX delivery, real-time analytics, and full creative control.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple px-8">
                Start Distributing <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
              <f.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © 2026 Distro Music. All rights reserved.
      </footer>
    </div>
  );
}
