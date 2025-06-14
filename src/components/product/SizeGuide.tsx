import { useState } from 'react';
import { X } from 'lucide-react';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  if (!isOpen) return null;

  // Size guide data
  const sizeChart = [
    { size: 'XS', chest: '32-34"', waist: '26-28"', hip: '35-37"' },
    { size: 'S', chest: '35-37"', waist: '29-31"', hip: '38-40"' },
    { size: 'M', chest: '38-40"', waist: '32-34"', hip: '41-43"' },
    { size: 'L', chest: '41-43"', waist: '35-37"', hip: '44-46"' },
    { size: 'XL', chest: '44-46"', waist: '38-40"', hip: '47-49"' },
  ];

  const measuringGuide = [
    {
      title: 'Chest',
      description: 'Measure around the fullest part of your chest, keeping the tape measure horizontal.'
    },
    {
      title: 'Waist',
      description: 'Measure around your natural waistline, keeping the tape measure comfortably loose.'
    },
    {
      title: 'Hip',
      description: 'Measure around the fullest part of your hips, about 8 inches below your waist.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Size Guide
              </h3>
              
              <div className="mt-2">
                <h4 className="font-medium text-gray-900 mb-3">Size Chart (in inches)</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chest</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waist</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hip</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sizeChart.map((row) => (
                        <tr key={row.size}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.size}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.chest}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.waist}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-3">How to Measure</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {measuringGuide.map((item) => (
                      <div key={item.title} className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900">{item.title}</h5>
                        <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800">Need Help?</h5>
                  <p className="mt-1 text-sm text-blue-700">
                    If you're unsure about your size, feel free to contact our customer service for personalized assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
