import { useEffect, useState } from "react";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/posts?type=popular")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch posts");
                }
                return res.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Feed</h2>
            {posts.map((group, index) => (
                <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold">User {group.posts[0]?.userid}</h3>
                    <ul className="list-disc pl-4">
                        {group.posts.map((post) => (
                            <li key={post.id} className="py-2">{post.content}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}