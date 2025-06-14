import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, mobile = false, className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const baseClasses = `transition-all duration-200 relative ${className}`.trim();
  
  const desktopClasses = `
    px-3 py-2 rounded-md font-medium text-sm
    ${isActive 
      ? 'text-primary-700' 
      : 'text-neutral-600 hover:text-primary-600'
    }
  `;
  
  const mobileClasses = `
    py-3 text-center font-medium text-lg
    ${isActive 
      ? 'text-primary-700' 
      : 'text-neutral-700 hover:text-primary-600'
    }
  `;
  
  return (
    <Link 
      to={to} 
      className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
    >
      {children}
      {isActive && !mobile && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary-500 rounded-full" />
      )}
    </Link>
  );
};

export default NavLink;