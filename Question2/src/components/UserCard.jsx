const UserCard = ({ name, posts }) => {
    return (
      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{posts} posts</p>
      </div>
    );
  };
  
  export default UserCard;
  