import { useEffect, useState } from 'react';
import BlogList from '../components/blog/BlogList';
import { blogPosts } from '../data/blogPosts';
import { BlogPost } from '../types/blog';

export default function BlogHomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchPosts = async () => {
      try {
        // In a real app, you would fetch from an API
        // const response = await fetch('/api/blog/posts');
        // const data = await response.json();
        setPosts(blogPosts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogList posts={posts} />
    </div>
  );
}
