import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { HelpCircle, MessageSquare, Mail, BookOpen, Video, FileText, Send } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { toast } from 'sonner';

export default function HelpSupport() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ subject: '', message: '', category: '' });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first release?',
          a: 'Navigate to the Releases page and click "New Release". Fill in the required metadata (title, artist name, type), upload your cover art, and add your audio files. Once complete, submit for distribution.'
        },
        {
          q: 'What file formats are supported for audio?',
          a: 'We support WAV and FLAC formats with a minimum sample rate of 44.1kHz and 16-bit depth. Files should be properly mastered and meet industry standards.'
        },
        {
          q: 'What are the cover art requirements?',
          a: 'Cover art must be 3000x3000 pixels minimum, JPG or PNG format, under 10MB. It should not contain logos, text, or promotional elements that violate platform guidelines.'
        },
        {
          q: 'How long does distribution take?',
          a: 'Most platforms process releases within 2-5 business days. We recommend submitting at least 2 weeks before your desired release date to ensure availability on all platforms.'
        }
      ]
    },
    {
      category: 'Distribution & Delivery',
      questions: [
        {
          q: 'Which platforms do you distribute to?',
          a: 'We distribute to 150+ digital service providers including Spotify, Apple Music, Amazon Music, YouTube Music, Tidal, Deezer, TikTok, Instagram, and many more worldwide.'
        },
        {
          q: 'Can I schedule my release for a future date?',
          a: 'Yes! You can set a release date when creating your release. We recommend scheduling at least 2 weeks in advance to ensure all platforms have your music available on the desired date.'
        },
        {
          q: 'What happens if a delivery fails?',
          a: 'If a delivery fails, you\'ll receive a notification explaining the reason. Common issues include metadata errors, cover art violations, or content policy concerns. You can fix the issue and resubmit from the Distribution page.'
        },
        {
          q: 'Can I take down my release?',
          a: 'Yes, you can request a takedown from the Distribution page for any of your releases. Takedowns typically process within 2-5 business days across all platforms.'
        }
      ]
    },
    {
      category: 'Earnings & Payouts',
      questions: [
        {
          q: 'How and when do I get paid?',
          a: 'Payments are made via direct deposit on the 15th of each month for accounts that have reached the $50 minimum payout threshold. You must have your payment details configured in Settings.'
        },
        {
          q: 'What is the payout threshold?',
          a: 'The minimum payout threshold is $50. Once your earnings reach this amount, you\'ll be eligible for payout on the next payment date.'
        },
        {
          q: 'How long does it take to see earnings data?',
          a: 'Streaming data typically appears 1-2 days after streams occur, but complete reporting can take up to 45 days depending on the platform. We display data as soon as we receive it.'
        },
        {
          q: 'What is the revenue split?',
          a: 'You keep 100% of your earnings. We don\'t take any commission on your streaming revenue.'
        }
      ]
    },
    {
      category: 'ISRC & UPC Codes',
      questions: [
        {
          q: 'Do you provide ISRC and UPC codes?',
          a: 'Yes! We automatically generate ISRC codes for your tracks and UPC codes for your releases if you don\'t already have them. These are included at no additional cost.'
        },
        {
          q: 'Can I use my existing ISRC/UPC codes?',
          a: 'Yes, if you already have codes, you can enter them during the release creation process. Make sure they haven\'t been used for previous releases.'
        },
        {
          q: 'What is an ISRC code?',
          a: 'ISRC (International Standard Recording Code) is a unique identifier for your recording. It helps track your music across platforms and ensures you get paid for streams.'
        },
        {
          q: 'What is a UPC code?',
          a: 'UPC (Universal Product Code) is a unique identifier for your release (album/EP/single). It\'s required for distribution to most platforms and helps with inventory tracking.'
        }
      ]
    },
    {
      category: 'Account & Settings',
      questions: [
        {
          q: 'How do I change my email or password?',
          a: 'You can update your account settings from the Settings page. For password changes, click the "Change" button in the Account Actions section.'
        },
        {
          q: 'Can I have multiple artists on one account?',
          a: 'Yes! You can create releases for multiple artists from a single account. The artist name is set per-release, allowing you to manage music for yourself and other artists.'
        },
        {
          q: 'How do I add a label to my releases?',
          a: 'Enter your label name in the "Label" field when creating a release. This will appear as the copyright holder across all platforms.'
        }
      ]
    }
  ];

  const resources = [
    { title: 'Getting Started Guide', description: 'Learn the basics of distributing your music', icon: BookOpen, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { title: 'Video Tutorials', description: 'Watch step-by-step walkthroughs', icon: Video, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { title: 'Release Guidelines', description: 'Ensure your releases meet platform standards', icon: FileText, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { title: 'Contact Support', description: 'Get personalized help from our team', icon: MessageSquare, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Help & Support</h1>
        <p className="text-sm text-muted-foreground mt-1">Find answers and get help with your music distribution</p>
      </div>

      {/* Quick Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {resources.map((resource) => (
          <Card key={resource.title} className="border-border hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${resource.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <resource.icon className={`w-5 h-5 ${resource.color}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{resource.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
              </CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-4">
                {faqs.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">{category.category}</h3>
                    {category.questions.map((faq, idx) => (
                      <AccordionItem key={idx} value={`${category.category}-${idx}`} className="border-border">
                        <AccordionTrigger className="text-sm font-medium hover:text-primary">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Contact Support
              </CardTitle>
              <CardDescription>Can't find what you need? Send us a message.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="distribution">Distribution Issue</option>
                    <option value="payments">Payment & Earnings</option>
                    <option value="technical">Technical Problem</option>
                    <option value="account">Account Settings</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2" disabled={loading}>
                  <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">We typically respond within 24 hours on business days.</p>
                <p className="text-xs text-muted-foreground">For urgent issues, include your release ID and screenshots if applicable.</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-display">Support Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Response Time</span>
                <span className="font-medium">2-4 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Satisfaction Rate</span>
                <span className="font-medium">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issues Resolved</span>
                <span className="font-medium">95% on first contact</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
