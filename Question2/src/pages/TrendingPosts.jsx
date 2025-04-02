import { useEffect, useState } from "react";

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/posts?type=popular"); // Adjust endpoint as needed
        const data = await response.json();
        setTrendingPosts(data);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        trendingPosts.map((group, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Posts Group {index + 1}</h2>
            <div className="space-y-3">
              {group.posts.map((post) => (
                <div key={post.id} className="p-4 bg-white shadow-md rounded-lg">
                  <p className="text-gray-700">{post.content}</p>
                  <p className="text-sm text-gray-500">User ID: {post.userid}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TrendingPosts;