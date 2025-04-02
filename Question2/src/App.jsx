import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import TopUsers from "./pages/TopUsers";
import TrendingPosts from "./pages/TrendingPosts";
import Feed from "./pages/Feed";

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <header className="bg-gray-900 text-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          
          <nav className="flex gap-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-md transition ${isActive ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`
              }
            >
              Top Users
            </NavLink>
            <NavLink 
              to="/trending" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-md transition ${isActive ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`
              }
            >
              Trending Posts
            </NavLink>
            <NavLink 
              to="/feed" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-md transition ${isActive ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`
              }
            >
              Feed
            </NavLink>
          </nav>
        </header>

        <main className="mt-6">
          <Routes>
            <Route path="/" element={<TopUsers />} />
            <Route path="/trending" element={<TrendingPosts />} />
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;