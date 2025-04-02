import axios from "axios";

const API_URL = "http://localhost:3000";

export const fetchTopUsers = () => axios.get(`${API_URL}/top-users`);
export const fetchTrendingPosts = () => axios.get(`${API_URL}/posts?type=popular`);
export const fetchLiveFeed = () => axios.get(`${API_URL}/posts?type=latest`);
