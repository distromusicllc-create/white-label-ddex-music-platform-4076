import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Sparkles, Zap, Globe, Music, TrendingUp, DollarSign } from "lucide-react";

const platforms = [
  "Spotify", "Apple Music", "TikTok", "Pandora", "Amazon", 
  "Instagram", "YouTube Music", "Tidal", "iHeartRadio", "Deezer",
  "and 150+ more stores"
];

const features = [
  { text: "Unlimited album & song uploads", included: true },
  { text: "Fastest delivery to stores (10-20x faster)", included: true },
  { text: "All major streaming platforms", included: true },
  { text: "150+ digital stores worldwide", included: true },
  { text: "FREE ISRC & UPC codes", included: true },
  { text: "Spotify pitching tools", included: true },
  { text: "Real-time analytics", included: true },
  { text: "Daily trend reports", included: true },
  { text: "YouTube Content ID", included: true },
  { text: "Custom release date scheduling", included: true },
  { text: "No hidden fees", included: true },
  { text: "Keep 100% of your royalties", included: true },
  { text: "Instant TikTok distribution", included: true },
  { text: "Advanced analytics dashboard", included: true },
  { text: "Priority customer support", included: true },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8" />
            <span className="text-lg font-semibold">LIMITED TIME OFFER</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Unlimited Music Distribution
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95">
            Upload unlimited albums & songs for a full year — just R459.99
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">10-20x Faster Than Other Distributors</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="font-semibold">150+ Stores Worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-10">
        <Card className="shadow-2xl border-2 border-purple-200">
          <CardHeader className="text-center pb-8">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full px-4 py-1 text-sm font-semibold mb-4">
              BEST VALUE
            </div>
            <CardTitle className="text-4xl font-bold">Annual Unlimited</CardTitle>
            <CardDescription className="text-lg">Everything you need to distribute your music</CardDescription>
            <div className="mt-6">
              <span className="text-6xl font-bold text-purple-600">R459.99</span>
              <span className="text-2xl text-gray-600">/year</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">That's less than R39 per month!</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={feature.included ? "text-gray-700" : "text-gray-400 line-through"}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                Your Music Goes To:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((platform, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    {platform}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              Get Started Now — R459.99/year
            </Button>
            <p className="text-sm text-gray-500 text-center">
              30-day money-back guarantee • No hidden fees • Cancel anytime
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Artists Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                We're 10-20x faster than other distributors. Your music hits stores in days, not weeks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Best Price</CardTitle>
              <CardDescription>
                Unlimited uploads for one low annual fee. No per-release fees or hidden costs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Maximum Reach</CardTitle>
              <CardDescription>
                Access to 150+ stores and streaming platforms globally. Reach fans everywhere.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How We Compare</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="font-semibold">Feature</div>
                <div className="font-semibold text-purple-600">DistroMusic</div>
                <div className="font-semibold text-gray-500">Others</div>

                <div className="py-3 text-gray-700">Annual Price</div>
                <div className="py-3 font-bold text-2xl text-purple-600">R459.99</div>
                <div className="py-3 text-gray-500">R800-R1,200+</div>

                <div className="py-3 text-gray-700">Uploads</div>
                <div className="py-3 font-semibold text-green-600">Unlimited</div>
                <div className="py-3 text-gray-500">Limited</div>

                <div className="py-3 text-gray-700">Delivery Speed</div>
                <div className="py-3 font-semibold text-green-600">10-20x Faster</div>
                <div className="py-3 text-gray-500">Slow</div>

                <div className="py-3 text-gray-700">Royalties</div>
                <div className="py-3 font-semibold text-green-600">Keep 100%</div>
                <div className="py-3 text-gray-500">Commission taken</div>

                <div className="py-3 text-gray-700">Stores</div>
                <div className="py-3 font-semibold text-green-600">150+</div>
                <div className="py-3 text-gray-500">Fewer</div>

                <div className="py-3 text-gray-700">ISRC/UPC Codes</div>
                <div className="py-3 font-semibold text-green-600">FREE</div>
                <div className="py-3 text-gray-500">Extra cost</div>

                <div className="py-3 text-gray-700">Hidden Fees</div>
                <div className="py-3 font-semibold text-green-600">None</div>
                <div className="py-3 text-gray-500">Often</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Share Your Music With the World?</h2>
          <p className="text-xl mb-8 opacity-95">
            Join thousands of artists who distribute their music faster and more affordably
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 h-14 px-8 text-lg font-semibold">
            Start Distributing Today — R459.99/year
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
