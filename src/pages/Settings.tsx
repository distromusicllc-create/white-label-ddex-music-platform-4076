import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, Mail, MapPin, Save, Key, Upload, Instagram, Twitter, Youtube, Globe as GlobeIcon, Music2, Link2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {content} from '@/lib/shared/kliv-content.js';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profile, setProfile] = useState({
    artistName: '',
    labelName: '',
    contactEmail: user?.email || '',
    phone: '',
    website: '',
    bio: '',
    profileImage: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      youtube: '',
      soundcloud: '',
      bandcamp: '',
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate saving - in real app, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await content.uploadFile(file, '/content/profile-images/');
      setProfile(prev => ({ ...prev, profileImage: result.path }));
      toast.success('Profile image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const updateField = (field: string, value: string) => setProfile(prev => ({ ...prev, [field]: value }));
  
  const updateSocial = (platform: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your artist profile and label settings</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Profile Image */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" /> Profile Image
            </CardTitle>
            <CardDescription>Upload your artist profile photo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Music2 className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="profileImage" className="cursor-pointer">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  <Button type="button" variant="outline" size="sm" disabled={uploadingImage} asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </span>
                  </Button>
                </Label>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 1000x1000px JPG or PNG. Max 5MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Profile Information
            </CardTitle>
            <CardDescription>Your public artist profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="artistName">Artist Name *</Label>
                <Input
                  id="artistName"
                  value={profile.artistName}
                  onChange={e => updateField('artistName', e.target.value)}
                  placeholder="Your artist or band name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="labelName">Label Name</Label>
                <Input
                  id="labelName"
                  value={profile.labelName}
                  onChange={e => updateField('labelName', e.target.value)}
                  placeholder="Your label (if applicable)"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Artist Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={e => updateField('bio', e.target.value)}
                placeholder="Tell your fans about your music, influences, and journey..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This bio will be visible on your public profile and streaming platforms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" /> Social Links
            </CardTitle>
            <CardDescription>Connect your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" /> Instagram
                </Label>
                <Input
                  id="instagram"
                  value={profile.socialLinks.instagram}
                  onChange={e => updateSocial('instagram', e.target.value)}
                  placeholder="@yourusername"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" /> Twitter/X
                </Label>
                <Input
                  id="twitter"
                  value={profile.socialLinks.twitter}
                  onChange={e => updateSocial('twitter', e.target.value)}
                  placeholder="@yourusername"
                />
              </div>
              <div>
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" /> YouTube
                </Label>
                <Input
                  id="youtube"
                  value={profile.socialLinks.youtube}
                  onChange={e => updateSocial('youtube', e.target.value)}
                  placeholder="Your channel URL"
                />
              </div>
              <div>
                <Label htmlFor="soundcloud">SoundCloud</Label>
                <Input
                  id="soundcloud"
                  value={profile.socialLinks.soundcloud}
                  onChange={e => updateSocial('soundcloud', e.target.value)}
                  placeholder="Your profile URL"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="bandcamp">Bandcamp</Label>
                <Input
                  id="bandcamp"
                  value={profile.socialLinks.bandcamp}
                  onChange={e => updateSocial('bandcamp', e.target.value)}
                  placeholder="Your bandcamp URL"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Contact Information
            </CardTitle>
            <CardDescription>How we can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={profile.contactEmail}
                  onChange={e => updateField('contactEmail', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="website" className="flex items-center gap-2">
                <GlobeIcon className="w-4 h-4" /> Website
              </Label>
              <Input
                id="website"
                type="url"
                value={profile.website}
                onChange={e => updateField('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Location
            </CardTitle>
            <CardDescription>Your physical address for payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={e => updateField('address', e.target.value)}
                placeholder="123 Music Street"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={e => updateField('city', e.target.value)}
                  placeholder="Los Angeles"
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={profile.state}
                  onChange={e => updateField('state', e.target.value)}
                  placeholder="CA"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  value={profile.zipCode}
                  onChange={e => updateField('zipCode', e.target.value)}
                  placeholder="90001"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <select
                id="country"
                value={profile.country}
                onChange={e => updateField('country', e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                required
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="AU">Australia</option>
                <option value="JP">Japan</option>
                <option value="BR">Brazil</option>
                <option value="MX">Mexico</option>
                <option value="IT">Italy</option>
                <option value="ES">Spain</option>
                <option value="NL">Netherlands</option>
                <option value="SE">Sweden</option>
                <option value="NO">Norway</option>
                <option value="DK">Denmark</option>
                <option value="FI">Finland</option>
                <option value="CH">Switzerland</option>
                <option value="AT">Austria</option>
                <option value="BE">Belgium</option>
                <option value="IE">Ireland</option>
                <option value="PT">Portugal</option>
                <option value="GR">Greece</option>
                <option value="PL">Poland</option>
                <option value="CZ">Czech Republic</option>
                <option value="HU">Hungary</option>
                <option value="RO">Romania</option>
                <option value="RU">Russia</option>
                <option value="UA">Ukraine</option>
                <option value="TR">Turkey</option>
                <option value="IL">Israel</option>
                <option value="AE">United Arab Emirates</option>
                <option value="SA">Saudi Arabia</option>
                <option value="ZA">South Africa</option>
                <option value="IN">India</option>
                <option value="SG">Singapore</option>
                <option value="MY">Malaysia</option>
                <option value="TH">Thailand</option>
                <option value="PH">Philippines</option>
                <option value="ID">Indonesia</option>
                <option value="VN">Vietnam</option>
                <option value="KR">South Korea</option>
                <option value="TW">Taiwan</option>
                <option value="HK">Hong Kong</option>
                <option value="NZ">New Zealand</option>
                <option value="AR">Argentina</option>
                <option value="CL">Chile</option>
                <option value="CO">Colombia</option>
                <option value="PE">Peru</option>
                <option value="VE">Venezuela</option>
                <option value="EC">Ecuador</option>
                <option value="CR">Costa Rica</option>
                <option value="PA">Panama</option>
                <option value="DO">Dominican Republic</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display">Account Actions</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="bg-primary hover:bg-primary/90 gap-2" disabled={loading}>
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
