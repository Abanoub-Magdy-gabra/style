import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Calendar, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { profile, updateProfile, updatePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await updateProfile(formData);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const success = await updatePassword(passwordData.newPassword);
      if (success) {
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-neutral-900">Profile Information</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-neutral-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="01234567890"
              />
            </div>

            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-neutral-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date of Birth
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    full_name: profile?.full_name || '',
                    phone: profile?.phone || '',
                    date_of_birth: profile?.date_of_birth || '',
                  });
                }}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-neutral-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-neutral-900">Full Name</p>
                <p className="text-sm text-neutral-600">{profile?.full_name || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail className="w-5 h-5 text-neutral-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-neutral-900">Email</p>
                <p className="text-sm text-neutral-600">{profile?.email}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="w-5 h-5 text-neutral-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-neutral-900">Phone</p>
                <p className="text-sm text-neutral-600">{profile?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-neutral-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-neutral-900">Date of Birth</p>
                <p className="text-sm text-neutral-600">
                  {profile?.date_of_birth 
                    ? new Date(profile.date_of_birth).toLocaleDateString()
                    : 'Not provided'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-neutral-900">Password</h3>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-neutral-600">
            Password was last updated on {new Date(profile?.updated_at || '').toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}