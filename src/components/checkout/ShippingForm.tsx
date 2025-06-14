import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, User, Phone, Mail } from 'lucide-react';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialData?: Partial<ShippingAddress>;
  isLoading?: boolean;
}

export default function ShippingForm({ onSubmit, initialData, isLoading = false }: ShippingFormProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Egypt',
    isDefault: false,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Pre-fill form with user profile data
  useEffect(() => {
    if (profile && !initialData) {
      const nameParts = profile.full_name?.split(' ') || ['', ''];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profile.email || '',
        phone: profile.phone || '',
      }));
    }
  }, [profile, initialData]);

  const egyptianStates = [
    'Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said',
    'Suez', 'Luxor', 'Mansoura', 'El Mahalla El Kubra', 'Tanta',
    'Asyut', 'Ismailia', 'Fayyum', 'Zagazig', 'Aswan',
    'Damietta', 'Damanhur', 'Minya', 'Beni Suef', 'Qena',
    'Sohag', 'Hurghada', 'Shibin El Kom', 'Banha', 'Kafr El Sheikh',
    'Arish', 'Mallawi', 'Bilbays', 'Marsa Matruh', 'Idfu'
  ];

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'First name is required';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'Last name is required';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^(\+20|0)?1[0-9]{9}$/.test(value.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid Egyptian phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'address1':
        if (!value.trim()) {
          newErrors.address1 = 'Address is required';
        } else {
          delete newErrors.address1;
        }
        break;
      case 'city':
        if (!value.trim()) {
          newErrors.city = 'City is required';
        } else {
          delete newErrors.city;
        }
        break;
      case 'state':
        if (!value.trim()) {
          newErrors.state = 'State/Governorate is required';
        } else {
          delete newErrors.state;
        }
        break;
      case 'postalCode':
        if (!value.trim()) {
          newErrors.postalCode = 'Postal code is required';
        } else if (!/^\d{5}$/.test(value)) {
          newErrors.postalCode = 'Please enter a valid 5-digit postal code';
        } else {
          delete newErrors.postalCode;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    if (touched[name]) {
      validateField(name, String(newValue));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true,
    }), {});
    setTouched(allTouched);

    // Validate all fields
    let isValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'address2' && key !== 'isDefault') {
        isValid = validateField(key, String(value)) && isValid;
      }
    });

    if (isValid) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-primary-600" />
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.firstName ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.lastName ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.email ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.phone ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="01234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary-600" />
          Shipping Address
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="address1" className="block text-sm font-medium text-neutral-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.address1 ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="123 Main Street"
            />
            {errors.address1 && (
              <p className="mt-1 text-sm text-red-600">{errors.address1}</p>
            )}
          </div>

          <div>
            <label htmlFor="address2" className="block text-sm font-medium text-neutral-700 mb-1">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.city ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Cairo"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                Governorate *
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.state ? 'border-red-500' : 'border-neutral-300'
                }`}
              >
                <option value="">Select Governorate</option>
                {egyptianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.postalCode ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="12345"
                maxLength={5}
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Egypt">Egypt</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-neutral-700">
              Save as default shipping address
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
          isLoading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
}