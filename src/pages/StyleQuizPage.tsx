import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Types
type QuestionType = 'text' | 'image';

interface QuestionOption {
  id: string;
  text: string;
  style: string[];
  image?: string;
}

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options: QuestionOption[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface StyleDescription {
  description: string;
  shopQuery: string;
  products: Product[];
}

type StyleKey = 'classic' | 'minimalist' | 'bohemian' | 'edgy' | 'sporty' | 'romantic' | 'trendy' | 'bold' | 'casual' | 'boho' | 'polished' | 'eclectic' | 'natural' | 'comfort' | 'delicate';

interface StyleResult {
  style: string;
  description: string;
  shopQuery: string;
  products: Product[];
}

// Mock data
const styleDescriptions: Record<StyleKey, StyleDescription> = {
  classic: {
    description: 'Timeless pieces with clean lines and sophisticated silhouettes',
    shopQuery: 'classic+minimalist',
    products: [
      { id: 'classic-1', name: 'Classic White Shirt', price: 89.99, image: '/images/classic-shirt.jpg' },
    ],
  },
  minimalist: {
    description: 'Clean, simple, and functional pieces with a focus on quality',
    shopQuery: 'minimalist+basic',
    products: [
      { id: 'min-1', name: 'Minimalist Black Dress', price: 129.99, image: '/images/minimalist-dress.jpg' },
    ],
  },
  bohemian: {
    description: 'Free-spirited and artistic with flowing fabrics and earthy tones',
    shopQuery: 'bohemian+hippie',
    products: [
      { id: 'boho-1', name: 'Bohemian Maxi Dress', price: 79.99, image: '/images/bohemian-dress.jpg' },
    ],
  },
  // Add more styles as needed
  edgy: {
    description: 'Bold and unconventional, pushing fashion boundaries.',
    shopQuery: 'edgy+alternative',
    products: [
      { id: 'edgy-1', name: 'Edgy Leather Jacket', price: 199.99, image: '/images/edgy-jacket.jpg' },
    ],
  },
  sporty: {
    description: 'Comfortable and athletic-inspired, functional yet stylish.',
    shopQuery: 'sporty+athleisure',
    products: [
      { id: 'sporty-1', name: 'Sporty Hoodie', price: 69.99, image: '/images/sporty-hoodie.jpg' },
    ],
  },
  romantic: {
    description: 'Feminine and delicate, with soft fabrics and floral prints.',
    shopQuery: 'romantic+floral',
    products: [
      { id: 'romantic-1', name: 'Romantic Lace Top', price: 79.99, image: '/images/romantic-top.jpg' },
    ],
  },
  trendy: {
    description: 'Up-to-the-minute styles, reflecting current fashion trends.',
    shopQuery: 'trendy+new-arrivals',
    products: [
      { id: 'trendy-1', name: 'Trendy Wide-Leg Pants', price: 99.99, image: '/images/trendy-pants.jpg' },
    ],
  },
  bold: {
    description: 'Statement-making pieces with vibrant colors and daring designs.',
    shopQuery: 'bold+statement',
    products: [
      { id: 'bold-1', name: 'Bold Printed Blouse', price: 85.00, image: '/images/bold-blouse.jpg' },
    ],
  },
  casual: {
    description: 'Relaxed and comfortable for everyday wear.',
    shopQuery: 'casual+everyday',
    products: [
      { id: 'casual-1', name: 'Casual Denim Jeans', price: 75.00, image: '/images/casual-jeans.jpg' },
    ],
  },
  boho: { // Note: 'bohemian' is already present, 'boho' might be a duplicate or a nuanced variant.
    description: 'Earthy and artistic, similar to bohemian but perhaps more casual.',
    shopQuery: 'boho+casual',
    products: [
      { id: 'boho-casual-1', name: 'Boho Tunic Top', price: 65.00, image: '/images/boho-tunic.jpg' },
    ],
  },
  polished: {
    description: 'Refined and put-together, suitable for professional settings.',
    shopQuery: 'polished+workwear',
    products: [
      { id: 'polished-1', name: 'Polished Blazer', price: 149.99, image: '/images/polished-blazer.jpg' },
    ],
  },
  eclectic: {
    description: 'A diverse mix of styles, eras, and textures.',
    shopQuery: 'eclectic+vintage',
    products: [
      { id: 'eclectic-1', name: 'Eclectic Patterned Scarf', price: 49.99, image: '/images/eclectic-scarf.jpg' },
    ],
  },
  natural: {
    description: 'Focus on natural fabrics, earthy tones, and simple comfort.',
    shopQuery: 'natural+organic',
    products: [
      { id: 'natural-1', name: 'Natural Linen Shirt', price: 95.00, image: '/images/natural-shirt.jpg' },
    ],
  },
  comfort: {
    description: 'Prioritizes comfort and ease of movement, soft and cozy.',
    shopQuery: 'comfort+loungewear',
    products: [
      { id: 'comfort-1', name: 'Comfort Knit Sweater', price: 89.00, image: '/images/comfort-sweater.jpg' },
    ],
  },
  delicate: {
    description: 'Light, airy, and often features fine details and soft hues.',
    shopQuery: 'delicate+lace',
    products: [
      { id: 'delicate-1', name: 'Delicate Silk Camisole', price: 70.00, image: '/images/delicate-camisole.jpg' },
    ],
  },
};

const questions: Question[] = [
  {
    id: 1,
    type: 'text',
    question: 'How would you describe your personal style?',
    options: [
      { id: 'a1', text: 'Classic and timeless', style: ['classic', 'minimalist'] },
      { id: 'a2', text: 'Trendy and bold', style: ['trendy', 'bold'] },
      { id: 'a3', text: 'Casual and comfortable', style: ['casual', 'comfort'] },
      { id: 'a4', text: 'Bohemian and free-spirited', style: ['boho', 'eclectic'] },
    ],
  },
  {
    id: 2,
    type: 'text',
    question: 'What colors do you typically wear?',
    options: [
      { id: 'b1', text: 'Neutrals (black, white, beige)', style: ['classic', 'minimalist'] },
      { id: 'b2', text: 'Bright and bold colors', style: ['bold', 'trendy'] },
      { id: 'b3', text: 'Earthy tones', style: ['bohemian', 'natural'] },
      { id: 'b4', text: 'Pastels and soft shades', style: ['romantic', 'delicate'] },
    ],
  },
  // Add more questions as needed
];

const StyleQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth() || {};
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [savedStyles, setSavedStyles] = useState<StyleResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    const loadUserStyles = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise<void>(resolve => setTimeout(resolve, 500));
        // In a real app, you would fetch saved styles from your API
        // const response = await fetch(`/api/users/${currentUser.uid}/styles`);
        // const data = await response.json();
        // setSavedStyles(data);
      } catch (error) {
        console.error('Failed to load saved styles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserStyles();
  }, [currentUser]);

  const handleAnswer = (answerId: string): void => {
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: answerId,
    };
    
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = (): StyleResult[] => {
    const styleScores: Record<string, number> = {};
    
    Object.entries(answers).forEach(([questionIndex, answerId]) => {
      const question = questions[parseInt(questionIndex, 10)];
      if (!question) return;
      
      const selectedOption = question.options.find(opt => opt.id === answerId);
      if (!selectedOption) return;
      
      selectedOption.style.forEach(style => {
        styleScores[style] = (styleScores[style] || 0) + 1;
      });
    });

    return Object.entries(styleScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([style]) => {
        const styleKey = style as StyleKey;
        const styleData = styleDescriptions[styleKey];
        return {
          style: styleKey,
          description: styleData.description,
          shopQuery: styleData.shopQuery,
          products: styleData.products,
        };
      });
  };

  const results = showResults ? calculateResults() : [];

  const resetQuiz = (): void => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your style profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center mb-12">Discover Your Style</h1>
        
        {!showResults ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    answers[currentQuestionIndex] === option.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAnswer(option.id)}
                >
                  {option.image && (
                    <div className="mb-3 overflow-hidden rounded-md">
                      <img 
                        src={option.image} 
                        alt={option.text}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  <div className="font-medium">{option.text}</div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Your Style Profile</h2>
            
            <div className="space-y-8">
              {results.map((result, index) => (
                <div key={result.style} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold capitalize">{result.style}</h3>
                      <p className="text-gray-600 mt-1">{result.description}</p>
                      
                      {result.products.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Recommended for you:</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {result.products.map((product) => (
                              <div key={product.id} className="border rounded-lg overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-full h-32 object-cover"
                                />
                                <div className="p-3">
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-blue-600 font-semibold">${product.price.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={resetQuiz}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                Retake Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleQuizPage;
