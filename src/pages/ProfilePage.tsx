import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStyle } from '../contexts/StyleContext';
import { User, Settings, Heart, Package, LogOut, ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { preferences } = useStyle();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Sign In Required</h1>
            <p className="text-neutral-600 text-center mb-6">
              Please sign in to view your profile and manage your account.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="mt-1">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600">Email</label>
                <p className="mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Style Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600">Favorite Colors</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {preferences.colors.map((color, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600">Preferred Fits</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {preferences.fits.map((fit, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {fit}
                    </span>
                  ))}
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
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 rounded-md hover:bg-neutral-50 transition-colors flex items-center justify-between">
                <span>Change Password</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
              <button className="w-full text-left px-4 py-3 rounded-md hover:bg-neutral-50 transition-colors flex items-center justify-between">
                <span>Notification Preferences</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
              <button className="w-full text-left px-4 py-3 rounded-md hover:bg-neutral-50 transition-colors flex items-center justify-between">
                <span>Privacy Settings</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Delete Account</h3>
            <p className="text-neutral-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="text-red-600 hover:text-red-700 font-medium">
              Delete Account
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary-600" />
                )}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-neutral-600">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="ml-auto flex items-center text-neutral-600 hover:text-neutral-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Profile Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <nav className="bg-white rounded-lg shadow-sm p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
              {menuItems.find(item => item.id === activeTab)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;