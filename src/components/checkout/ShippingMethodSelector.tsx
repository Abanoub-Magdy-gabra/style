import { useState } from 'react';
import { Truck, Clock, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyUtils';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: React.ComponentType<any>;
}

interface ShippingMethodSelectorProps {
  onSelect: (method: ShippingMethod) => void;
  selectedMethod?: ShippingMethod;
}

export default function ShippingMethodSelector({ onSelect, selectedMethod }: ShippingMethodSelectorProps) {
  const shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivered within business days',
      price: 150, // EGP
      estimatedDays: '5-7 business days',
      icon: Truck,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Faster delivery for urgent orders',
      price: 300, // EGP
      estimatedDays: '2-3 business days',
      icon: Clock,
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      description: 'Available in Cairo and Giza only',
      price: 500, // EGP
      estimatedDays: 'Same day',
      icon: Zap,
    },
  ];

  const [selectedId, setSelectedId] = useState(selectedMethod?.id || 'standard');

  const handleSelect = (method: ShippingMethod) => {
    setSelectedId(method.id);
    onSelect(method);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Truck className="w-5 h-5 mr-2 text-primary-600" />
        Shipping Method
      </h3>

      <div className="space-y-3">
        {shippingMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedId === method.id;
          
          return (
            <div
              key={method.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-500'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => handleSelect(method)}
            >
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="shipping-method"
                    value={method.id}
                    checked={isSelected}
                    onChange={() => handleSelect(method)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 text-primary-600 mr-2" />
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">
                          {method.name}
                        </h4>
                        <p className="text-sm text-neutral-500">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900">
                        {method.price === 0 ? 'Free' : formatCurrency(method.price)}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {method.estimatedDays}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {method.id === 'same-day' && (
                <div className="mt-2 ml-7">
                  <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    ⚠️ Available only in Cairo and Giza. Order before 2 PM for same-day delivery.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Free shipping</strong> on orders over ج.م 1,500 (excluding same-day delivery)
        </p>
      </div>
    </div>
  );
}