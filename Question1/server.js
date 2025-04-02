const express = require("express");
const axios = require("axios");
const cors = require("cors")
const app = express();
app.use(cors())
app.use(express.json());
const PORT = 5000;
const BASE_URL = "http://20.244.56.144/evaluation-service";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjEwMTk0LCJpYXQiOjE3NDM2MDk4OTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImZkYjYxMmRiLWRhZTAtNGQ3ZS04N2JkLWI3MTczZTU4NzYwMyIsInN1YiI6ImRpdnlhbnNodWt1bWFyNzI1QGdtYWlsLmNvbSJ9LCJlbWFpbCI6ImRpdnlhbnNodWt1bWFyNzI1QGdtYWlsLmNvbSIsIm5hbWUiOiJkaXZ5YW5zaHUga3VtYXIiLCJyb2xsTm8iOiIyMjA1Mzk0OSIsImFjY2Vzc0NvZGUiOiJud3B3cloiLCJjbGllbnRJRCI6ImZkYjYxMmRiLWRhZTAtNGQ3ZS04N2JkLWI3MTczZTU4NzYwMyIsImNsaWVudFNlY3JldCI6IkZrRXJoU3ZaUHRxeEhqbnMifQ.HVb44GWI1Pd2Rq5CAFlvTIaKek31WvDsELA5VsnczjA"
// Middleware to set Authorization headers
const getHeaders = () => ({
    Authorization: `Bearer ${ACCESS_TOKEN}`
});

// Fetch all users and their post count
const fetchUsers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`, { headers: getHeaders() });

        if (!response.data || !response.data.users) {
            throw new Error("Invalid users data format");
        }

        return Object.entries(response.data.users).map(([id, name]) => ({ id, name }));
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return [];
    }
};

// Fetch posts for a given user
const fetchUserPosts = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/users/${userId}/posts`, { headers: getHeaders() });
        return response.data || [];
    } catch (error) {
        console.error(`Failed to fetch posts for user ${userId}:`, error.message);
        return [];
    }
};

// Fetch comments for a given post
// Fetch comments for a given post
const fetchPostComments = async (postId) => {
    if (!postId) {
        console.error("Skipping fetch for undefined postId.");
        return [];
    }
    try {
        const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`, { headers: getHeaders() });
        
        // Ensure we extract the comments array properly
        return response.data.comments || [];
    } catch (error) {
        console.error(`Failed to fetch comments for post ${postId}:`, error.message);
        return [];
    }
};


// Get top users based on total posts
app.get("/top-users", async (req, res) => {
    try {
        const users = await fetchUsers();
        const userPosts = await Promise.all(users.map(async (user) => {
            const posts = await fetchUserPosts(user.id);
            return { ...user, totalPosts: posts.length };
        }));

        // Sort users by total posts and return top 5
        const topUsers = userPosts.sort((a, b) => b.totalPosts - a.totalPosts).slice(0, 5);
        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch top users", details: error.message });
    }
});

// Get top/latest posts
app.get("/posts", async (req, res) => {
    const { type } = req.query;

    if (!type || !["latest", "popular"].includes(type)) {
        return res.status(400).json({ error: "Invalid type parameter. Use 'latest' or 'popular'." });
    }

    try {
        const users = await fetchUsers();
        let allPosts = [];

        await Promise.all(users.map(async (user) => {
            const posts = await fetchUserPosts(user.id);
            allPosts = allPosts.concat(posts);
        }));

        if (allPosts.length === 0) {
            return res.status(404).json({ message: "No posts found." });
        }

        let result = [];

        if (type === "latest") {
            // Sort posts by timestamp (newest first) and get the latest 5
            result = allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
        } else if (type === "popular") {
            // Fetch comments for each post and count them
            const postsWithComments = await Promise.all(allPosts.map(async (post) => {
                const comments = await fetchPostComments(post.id);
                return { ...post, commentCount: comments.length };
            }));

            // Find the max number of comments
            const maxComments = Math.max(...postsWithComments.map(post => post.commentCount || 0));

            // Get all posts that have the highest comment count
            result = postsWithComments.filter(post => post.commentCount === maxComments);
        }

        res.json(result);
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ error: "Failed to fetch posts", details: error.message });
    }
});


// Get comments for a specific post
app.get("/posts/:postId/comments", async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await fetchPostComments(postId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch comments", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
