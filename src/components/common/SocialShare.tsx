import { Facebook, Twitter, Link as LinkIcon, Mail } from 'lucide-react';
import { Share2 as Pinterest } from 'lucide-react'; // Using Share2 as a temporary replacement for Pinterest

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
}

export default function SocialShare({ 
  url, 
  title, 
  description = '',
  image = '',
  className = '' 
}: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = encodeURIComponent(image);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-500',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-blue-400',
    },
    {
      name: 'Pinterest',
      icon: Pinterest,
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      color: 'hover:bg-red-500',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0D%0A%0D%0A${encodedUrl}`,
      color: 'hover:bg-gray-500',
    },
    {
      name: 'Copy Link',
      icon: LinkIcon,
      onClick: () => {
        navigator.clipboard.writeText(url);
        // You might want to add a toast notification here
      },
      color: 'hover:bg-gray-400',
    },
  ];

  const handleClick = (e: React.MouseEvent, item: any) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    
    const width = 600;
    const height = 500;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      item.url,
      'Share',
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    e.preventDefault();
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Share:</span>
      <div className="flex space-x-2">
        {shareLinks.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={(e) => handleClick(e, item)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white bg-gray-300 ${item.color} transition-colors`}
              aria-label={`Share on ${item.name}`}
              title={item.name}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
