import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface StylePreferences {
  colors: string[];
  patterns: string[];
  fits: string[];
  occasions: string[];
  favorites: string[];
  bodyType?: string;
  size?: string;
  stylePersona?: string;
}

interface StyleContextType {
  preferences: StylePreferences;
  isLoading: boolean;
  updatePreferences: (newPreferences: Partial<StylePreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  hasCompletedStyleQuiz: boolean;
  setHasCompletedStyleQuiz: (value: boolean) => void;
}

const defaultPreferences: StylePreferences = {
  colors: [],
  patterns: [],
  fits: [],
  occasions: [],
  favorites: [],
};

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export const StyleProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<StylePreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompletedStyleQuiz, setHasCompletedStyleQuiz] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load preferences when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadStylePreferences();
    } else {
      // Load from localStorage for non-authenticated users
      loadLocalPreferences();
    }
  }, [user, isAuthenticated]);

  const loadStylePreferences = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('style_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading style preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          colors: data.colors || [],
          patterns: data.patterns || [],
          fits: data.fits || [],
          occasions: data.occasions || [],
          favorites: data.favorites || [],
          bodyType: data.body_type || undefined,
          size: data.size || undefined,
          stylePersona: data.style_persona || undefined,
        });
        setHasCompletedStyleQuiz(true);
      }
    } catch (error) {
      console.error('Error in loadStylePreferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem('stylePreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
      
      const quizCompleted = localStorage.getItem('styleQuizCompleted') === 'true';
      setHasCompletedStyleQuiz(quizCompleted);
    } catch (error) {
      console.error('Error loading local preferences:', error);
    }
  };

  const saveLocalPreferences = (prefs: StylePreferences) => {
    try {
      localStorage.setItem('stylePreferences', JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving local preferences:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<StylePreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);

    if (!isAuthenticated || !user) {
      // Handle non-authenticated users with localStorage
      saveLocalPreferences(updatedPreferences);
      localStorage.setItem('styleQuizCompleted', 'true');
      setHasCompletedStyleQuiz(true);
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('style_preferences')
        .upsert({
          user_id: user.id,
          colors: updatedPreferences.colors,
          patterns: updatedPreferences.patterns,
          fits: updatedPreferences.fits,
          occasions: updatedPreferences.occasions,
          favorites: updatedPreferences.favorites,
          body_type: updatedPreferences.bodyType || null,
          size: updatedPreferences.size || null,
          style_persona: updatedPreferences.stylePersona || null,
        });

      if (error) throw error;
      setHasCompletedStyleQuiz(true);
    } catch (error) {
      console.error('Error updating style preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPreferences = async () => {
    setPreferences(defaultPreferences);
    setHasCompletedStyleQuiz(false);

    if (!isAuthenticated || !user) {
      // Handle non-authenticated users
      localStorage.removeItem('stylePreferences');
      localStorage.removeItem('styleQuizCompleted');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('style_preferences')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error resetting style preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyleContext.Provider value={{
      preferences,
      isLoading,
      updatePreferences,
      resetPreferences,
      hasCompletedStyleQuiz,
      setHasCompletedStyleQuiz
    }}>
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => {
  const context = useContext(StyleContext);
  if (context === undefined) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
};