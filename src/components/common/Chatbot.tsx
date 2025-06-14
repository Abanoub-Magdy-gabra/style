import { useState, useRef, useEffect } from 'react';

const BOT_AVATAR = '🤖';
const USER_AVATAR = '🧑';

type Sender = 'user' | 'bot';
interface Message {
  sender: Sender;
  text: string;
  timestamp: string;
  isRich?: boolean;
}

interface UserContext {
  name?: string;
  previousPurchases: string[];
  preferences: string[];
  currentSession: {
    viewedProducts: string[];
    interests: string[];
  };
}

const initialMessages: Message[] = [
  { 
    sender: 'bot', 
    text: 'Hi! I\'m your StyleSphere assistant. I\'m here to help you discover sustainable fashion that matches your style. What brings you here today?', 
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
  },
];

const INITIAL_SUGGESTIONS = [
  'Show me what\'s trending',
  'I\'m looking for sustainable clothing',
  'Help me find a gift',
  'I need help with my order',
  'Tell me about your eco-friendly practices'
];

const PRODUCTS_DB = {
  'organic-cotton-tee': {
    name: 'Organic Cotton T-Shirt',
    brand: 'EcoWear',
    price: '$28',
    sustainability: '100% GOTS-certified organic cotton',
    colors: ['White', 'Black', 'Forest Green', 'Ocean Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Super soft, breathable, and ethically made'
  },
  'eco-denim': {
    name: 'Eco Denim Jeans',
    brand: 'GreenThread',
    price: '$85',
    sustainability: 'Made with 70% recycled cotton, 90% less water usage',
    colors: ['Classic Blue', 'Dark Wash', 'Light Wash'],
    sizes: ['24', '26', '28', '30', '32', '34', '36'],
    description: 'Durable, comfortable fit with a conscience'
  },
  'recycled-sneakers': {
    name: 'Recycled Sneakers',
    brand: 'EcoStep',
    price: '$95',
    sustainability: 'Made from 12 recycled plastic bottles and vegan leather',
    colors: ['White/Gray', 'Black/Green', 'Navy/White'],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    description: 'Comfortable all-day wear with zero compromise on style'
  }
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [lastBotIntent, setLastBotIntent] = useState<string | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [userContext, setUserContext] = useState<UserContext>({
    previousPurchases: [],
    preferences: [],
    currentSession: { viewedProducts: [], interests: [] }
  });
  const [conversationDepth, setConversationDepth] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateUserContext = (key: keyof UserContext['currentSession'], value: string) => {
    setUserContext(prev => ({
      ...prev,
      currentSession: {
        ...prev.currentSession,
        [key]: [...prev.currentSession[key], value]
      }
    }));
  };

  const getPersonalizedResponse = (baseResponse: string, context: UserContext) => {
    if (context.currentSession.interests.length > 0) {
      const interests = context.currentSession.interests;
      if (interests.includes('sustainability') && !baseResponse.includes('eco')) {
        return baseResponse + ' All our products are sustainably made!';
      }
    }
    return baseResponse;
  };

  const sendMessage = async (customText?: string) => {
    const text = (customText ?? input).trim();
    if (!text) return;
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = { sender: 'user' as Sender, text, timestamp: now };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);
    setShowSuggestions(false);
    setQuickReplies([]);
    setConversationDepth(prev => prev + 1);

    setTimeout(() => {
      let botReply = '';
      let intent: string | null = null;
      let quicks: string[] = [];
      const lower = text.toLowerCase();
      const now = new Date();
      const hour = now.getHours();

      // Enhanced greeting with personalization
      if (lower.match(/^(hi|hello|hey|good morning|good afternoon|good evening)$/)) {
        const greetings = {
          morning: [
            'Good morning! Ready to start your day with some sustainable style?',
            'Morning! What can I help you discover in our eco-friendly collection today?'
          ],
          afternoon: [
            'Good afternoon! Looking for something special to brighten your day?',
            'Afternoon! How can I help you find the perfect sustainable pieces?'
          ],
          evening: [
            'Good evening! Planning your outfit for tomorrow, or shopping for something special?',
            'Evening! Whether you\'re browsing or have something specific in mind, I\'m here to help!'
          ]
        };
        
        const timeGreetings = hour < 12 ? greetings.morning : hour < 18 ? greetings.afternoon : greetings.evening;
        botReply = timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
        intent = 'greeting';
        quicks = ['Show me trending items', 'I\'m looking for sustainable fashion', 'Help me find a gift', 'Tell me about StyleSphere'];

      // Enhanced product browsing
      } else if (lower.includes('trending') || lower.includes('popular') || lower.includes('what\'s new')) {
        updateUserContext('interests', 'trending');
        botReply = 'Here are our most popular sustainable pieces right now:\n\n🌱 **Organic Cotton T-Shirt** - $28\n👖 **Eco Denim Jeans** - $85\n👟 **Recycled Sneakers** - $95\n\nEach piece is crafted with care for both you and the planet. Which catches your eye?';
        intent = 'trending';
        quicks = ['Tell me about the t-shirt', 'Show me the jeans', 'I\'m interested in the sneakers', 'What makes them sustainable?'];

      // Enhanced product details with rich information
      } else if (lower.includes('organic cotton') || lower.includes('t-shirt') || lower.includes('tee')) {
        updateUserContext('viewedProducts', 'organic-cotton-tee');
        const product = PRODUCTS_DB['organic-cotton-tee'];
        botReply = `The **${product.name}** by ${product.brand} is one of our bestsellers! Here's why customers love it:\n\n💚 ${product.sustainability}\n🎨 Available in ${product.colors.length} colors: ${product.colors.join(', ')}\n📏 Sizes: ${product.sizes.join(', ')}\n💰 Only ${product.price}\n\n${product.description}. Would you like to see styling tips or check availability in your size?`;
        intent = 'product_organic_tee';
        quicks = ['Show me styling tips', 'Check size availability', 'Add to wishlist', 'See similar items'];

      } else if (lower.includes('eco denim') || lower.includes('jeans')) {
        updateUserContext('viewedProducts', 'eco-denim');
        const product = PRODUCTS_DB['eco-denim'];
        botReply = `Our **${product.name}** are a game-changer! Here's what makes them special:\n\n🌊 ${product.sustainability}\n🎨 Available in: ${product.colors.join(', ')}\n📏 Sizes: ${product.sizes.join(', ')}\n💰 ${product.price}\n\n${product.description}. They're perfect for casual days or dressed up with heels. Want to know more about the fit or sustainability story?`;
        intent = 'product_eco_denim';
        quicks = ['Tell me about the fit', 'Sustainability details', 'Size guide', 'Style suggestions'];

      } else if (lower.includes('recycled sneakers') || lower.includes('sneakers') || lower.includes('shoes')) {
        updateUserContext('viewedProducts', 'recycled-sneakers');
        const product = PRODUCTS_DB['recycled-sneakers'];
        botReply = `The **${product.name}** are incredible! Check this out:\n\n♻️ ${product.sustainability}\n🎨 Colors: ${product.colors.join(', ')}\n👟 Sizes: ${product.sizes.join(', ')}\n💰 ${product.price}\n\n${product.description}. They're perfect for everything from morning jogs to casual Fridays. Interested in learning about the recycling process?`;
        intent = 'product_recycled_sneakers';
        quicks = ['How are they made?', 'Comfort details', 'Care instructions', 'Size recommendations'];

      // Enhanced sustainability inquiries
      } else if (lower.includes('sustainab') || lower.includes('eco') || lower.includes('environment') || lower.includes('green')) {
        updateUserContext('interests', 'sustainability');
        botReply = 'Sustainability is our core mission! Here\'s how StyleSphere makes a difference:\n\n🌱 **Materials**: GOTS-certified organic cotton, recycled fibers\n💧 **Water Conservation**: Up to 90% less water in production\n📦 **Packaging**: 100% recycled and biodegradable\n🤝 **Fair Trade**: Ethical partnerships with certified suppliers\n🔄 **Circular Fashion**: Take-back program for worn items\n\nWhat aspect interests you most?';
        intent = 'sustainability';
        quicks = ['Tell me about materials', 'Water conservation details', 'Fair trade practices', 'Take-back program'];

      // Enhanced gift recommendations
      } else if (lower.includes('gift') || lower.includes('present')) {
        botReply = 'I\'d love to help you find the perfect sustainable gift! To give you the best recommendations, tell me:\n\nWho is this gift for? And do you know their style preferences or size?';
        intent = 'gift_inquiry';
        quicks = ['Gift for her', 'Gift for him', 'Gift for teen', 'Not sure about size'];

      } else if (lastBotIntent === 'gift_inquiry' && (lower.includes('her') || lower.includes('woman') || lower.includes('female'))) {
        botReply = 'Perfect! Here are some fantastic gift ideas for her:\n\n🌸 **Organic Cotton Tee** - Classic and versatile ($28)\n👖 **Eco Denim Jeans** - Stylish and sustainable ($85)\n🎁 **StyleSphere Gift Card** - Let her choose her favorites\n\nWould you like to see gift bundles or learn about our gift wrapping options?';
        intent = 'gift_for_her';
        quicks = ['Show gift bundles', 'Gift wrapping options', 'Gift card details', 'Add personal note'];

      // Enhanced order support with proactive help
      } else if (lower.includes('order') || lower.includes('track') || lower.includes('shipping')) {
        botReply = 'I\'m here to help with your order! What can I assist you with?\n\n📦 Track your package\n📝 Update shipping address\n❓ Order status questions\n🔄 Returns or exchanges\n📞 Connect with support team\n\nOr simply tell me your order number and I\'ll look it up!';
        intent = 'order_support';
        quicks = ['Track my order', 'Change address', 'Return an item', 'Speak to human'];

      // Enhanced size and fit guidance
      } else if (lower.includes('size') || lower.includes('fit') || lower.includes('sizing')) {
        botReply = 'Getting the right fit is so important! Here\'s how I can help:\n\n📏 **Size Charts**: Detailed measurements for all items\n📋 **Fit Guide**: Customer reviews on sizing\n🔄 **Easy Returns**: Free returns if size isn\'t perfect\n📞 **Personal Styling**: One-on-one fit consultation\n\nWhich item are you looking to size, or would you like general sizing tips?';
        intent = 'sizing_help';
        quicks = ['View size chart', 'Read fit reviews', 'Book styling session', 'Return policy'];

      // Contextual follow-up responses
      } else if (lastBotIntent === 'trending' && lower.includes('sustainable')) {
        botReply = 'Great question! Here\'s what makes our trending items so sustainable:\n\n🌱 **Organic Cotton Tee**: GOTS-certified organic cotton saves 2,500 liters of water per shirt\n👖 **Eco Denim**: Made with 70% recycled cotton, uses 90% less water\n👟 **Recycled Sneakers**: Each pair diverts 12 plastic bottles from landfills\n\nEvery purchase supports regenerative farming and fair wages. Which sustainability aspect matters most to you?';
        intent = 'sustainability_trending';
        quicks = ['Water conservation', 'Recycled materials', 'Fair wages', 'Organic farming'];

      // Enhanced personal styling
      } else if (lower.includes('style') || lower.includes('outfit') || lower.includes('look')) {
        botReply = 'I love helping with styling! Let\'s create some amazing sustainable looks together. What\'s the occasion?\n\n👔 **Work/Professional**\n🎉 **Casual/Weekend**\n✨ **Date Night/Special**\n🏃 **Active/Sporty**\n🌈 **Express Yourself**\n\nOr tell me about your personal style - are you more classic, bohemian, minimalist, or bold?';
        intent = 'styling_help';
        quicks = ['Work outfits', 'Casual looks', 'Date night style', 'What\'s my style?'];

      // Thank you responses with engagement
      } else if (lower.includes('thanks') || lower.includes('thank you')) {
        const responses = [
          'You\'re so welcome! I\'m always here to help you discover sustainable style. Anything else catching your interest?',
          'My pleasure! I love helping customers find pieces they\'ll treasure. Is there anything else I can help you explore?',
          'Happy to help! Feel free to ask me anything about our products, sustainability practices, or styling tips.'
        ];
        botReply = responses[Math.floor(Math.random() * responses.length)];
        intent = 'thanks';
        quicks = ['Show me more products', 'Styling tips', 'Sustainability info', 'Contact support'];

      // Enhanced fallback with smart suggestions
      } else {
        const fallbackResponses = [
          'I want to make sure I give you the best help possible! Could you tell me more about what you\'re looking for?',
          'I\'m here to help with anything StyleSphere related! Are you shopping for something specific, or would you like me to show you what\'s popular?',
          'Let me help you find exactly what you need! I can assist with products, orders, sustainability questions, styling advice, and more.'
        ];
        botReply = fallbackResponses[conversationDepth % fallbackResponses.length];
        intent = 'clarification';
        quicks = ['Browse products', 'Get styling help', 'Learn about sustainability', 'Check my order', 'Speak to human'];
      }

      // Add personalization based on context
      botReply = getPersonalizedResponse(botReply, userContext);

      setMessages((msgs) => [
        ...msgs,
        {
          sender: 'bot' as Sender,
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
      setLastBotIntent(intent);
      setQuickReplies(quicks);
      setLoading(false);
    }, 1200);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Toggle button
  if (!open) {
    return (
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-xl w-16 h-16 flex items-center justify-center text-3xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        onClick={() => setOpen(true)}
        aria-label="Open StyleSphere assistant"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-full bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col animate-fade-in"
      style={{ minHeight: '500px', maxHeight: '90vh' }}>
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl px-5 py-4 flex items-center text-white font-semibold text-lg justify-between">
        <div className="flex items-center">
          <span className="mr-3 text-2xl">🌱</span>
          <div>
            <div className="text-lg font-bold">StyleSphere Assistant</div>
            <div className="text-xs opacity-90">Sustainable Fashion Expert</div>
          </div>
        </div>
        <button
          className="ml-2 text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
          onClick={() => setOpen(false)}
          aria-label="Close chatbot"
        >
          ×
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white" style={{ minHeight: '320px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${msg.sender === 'user' ? 'ml-3 bg-blue-100' : 'mr-3 bg-green-100'}`}>
                {msg.sender === 'user' ? USER_AVATAR : BOT_AVATAR}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-md' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-green-100 mr-3">
                {BOT_AVATAR}
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-md text-sm bg-white text-gray-800 border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {(quickReplies.length > 0) && (
        <div className="px-5 py-3 flex flex-wrap gap-2 bg-gray-50 border-t border-gray-100">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              className="bg-white hover:bg-green-50 text-green-700 border border-green-200 hover:border-green-300 rounded-full px-4 py-2 text-xs font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              onClick={() => sendMessage(reply)}
              tabIndex={0}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {showSuggestions && quickReplies.length === 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-2 bg-gray-50 border-t border-gray-100">
          {INITIAL_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              className="bg-white hover:bg-green-50 text-green-700 border border-green-200 hover:border-green-300 rounded-full px-4 py-2 text-xs font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              onClick={() => sendMessage(suggestion)}
              tabIndex={0}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            placeholder="Ask me anything about sustainable fashion..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
            autoFocus
          />
          <button
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;