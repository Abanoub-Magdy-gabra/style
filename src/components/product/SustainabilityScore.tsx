import { Leaf } from 'lucide-react';

interface SustainabilityScoreProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
}

const SustainabilityScore: React.FC<SustainabilityScoreProps> = ({ 
  score, 
  size = 'small' 
}) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-green-400';
    if (score >= 40) return 'bg-yellow-400';
    if (score >= 20) return 'bg-orange-400';
    return 'bg-red-500';
  };
  
  const getScoreTextColor = () => {
    if (score >= 60) return 'text-green-800';
    if (score >= 40) return 'text-yellow-800';
    if (score >= 20) return 'text-orange-800';
    return 'text-red-800';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'large':
        return 'text-4xl p-6';
      case 'medium':
        return 'text-2xl p-4';
      default:
        return 'text-sm p-2';
    }
  };
  
  return (
    <div 
      className={`flex items-center justify-center ${
        size === 'small' ? 'space-x-1' : 'space-x-2'
      }`}
    >
      <div className={`rounded-full ${getScoreColor()} text-white ${getSizeClasses()} flex items-center justify-center shadow-sm`}>
        <Leaf className={size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-6 h-6' : 'w-8 h-8'} />
      </div>
      
      {size !== 'small' && (
        <div className="flex flex-col">
          <span className={`font-bold ${getScoreTextColor()}`}>{score}/100</span>
          <span className="text-xs text-neutral-600">Sustainability Score</span>
        </div>
      )}
    </div>
  );
};

export default SustainabilityScore;