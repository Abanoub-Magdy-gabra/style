import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStyle } from '../contexts/StyleContext';
import { User, Settings, Heart, Package, LogOut, ChevronRight, Shield } from 'lucide-react';
import ProfileSettings from '../components/profile/ProfileSettings';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const ProfilePage = () => {
  const { user, profile, logout } = useAuth();
  const { preferences } = useStyle();
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    {
      id: 'overview',
      label: 'Account Overview',
      icon: User,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600">Name</label>
                <p className="mt-1">{profile?.full_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600">Email</label>
                <p className="mt-1">{profile?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600">Phone</label>
                <p className="mt-1">{profile?.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600">Member Since</label>
                <p className="mt-1">
                  {new Date(profile?.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Style Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600">Favorite Colors</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {preferences.colors.length > 0 ? (
                    preferences.colors.map((color, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {color}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-500">No preferences set</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600">Preferred Fits</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {preferences.fits.length > 0 ? (
                    preferences.fits.map((fit, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {fit}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-500">No preferences set</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      content: (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Order History</h3>
          <p className="text-neutral-600">You haven't placed any orders yet.</p>
          <button
            onClick={() => window.location.href = '/shop'}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ),
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      content: (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Your Wishlist</h3>
          <p className="text-neutral-600">Your wishlist is empty.</p>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: <ProfileSettings />,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name || 'Profile'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-primary-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold">{profile?.full_name || 'Welcome'}</h1>
                    <p className="text-neutral-600">{profile?.email}</p>
                    <div className="flex items-center mt-1">
                      <Shield className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">Verified Account</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Profile Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <nav className="bg-white rounded-lg shadow-sm p-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                          activeTab === item.id
                            ? 'bg-primary-50 text-primary-700'
                            : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 mr-3" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content Area */}
              <div className="lg:col-span-3">
                {menuItems.find(item => item.id === activeTab)?.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;