const PostCard = ({ title, content, comments }) => {
    return (
      <div className="p-4 border rounded-lg shadow-md bg-white mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-700">{content}</p>
        <p className="text-sm text-gray-500">{comments} comments</p>
      </div>
    );
  };
  
  export default PostCard;
  