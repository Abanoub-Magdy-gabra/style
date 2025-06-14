import { useState } from 'react';
import { Sparkles } from 'lucide-react';

const AIStyleCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img 
            src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="AI Style Assistant" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <div className="flex items-center mb-4">
            <div className="bg-primary-100 p-2 rounded-full mr-3">
              <Sparkles className="text-primary-600 w-4 h-4" />
            </div>
            <span className="text-primary-600 font-medium">AI-Powered</span>
          </div>
          <h3 className="text-xl font-medium mb-3">Get personalized recommendations</h3>
          <p className="text-neutral-600 mb-4">
            Our AI analyzes your preferences, body type, and style to suggest perfect outfits.
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
              <span className="text-sm text-neutral-700">Body type analysis</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
              <span className="text-sm text-neutral-700">Style preference learning</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
              <span className="text-sm text-neutral-700">Occasion-based recommendations</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated Sparkle Effect */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping animation-delay-200"></div>
        <div className="absolute top-3/4 left-1/3 w-2 h-2 bg-primary-400 rounded-full animate-ping animation-delay-700"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-secondary-400 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping animation-delay-1500"></div>
      </div>
    </div>
  );
};

export default AIStyleCard;