import { useEffect, useState } from "react";

const TopUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/top-users"); // Adjust the endpoint as needed
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Top Users</h1>
      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="p-3 bg-white shadow-md rounded-lg">
              <p className="text-lg font-medium">{user.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopUsers;