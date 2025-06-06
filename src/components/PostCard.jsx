import React from 'react';
import { Link } from 'react-router-dom';
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage, content, author, category, authorAvatar }) {
  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden 
  hover:shadow-[0_10px_25px_rgba(0,0,0,0.8)] hover:scale-105 hover:-translate-y-1 
  hover:bg-gradient-to-r hover:from-white hover:to-gray-50 
  transition-all duration-300 flex flex-col">
        
        {/* Image at Top */}
        <img 
          src={appwriteService.getFileView(featuredImage)} 
          alt={title} 
          className="w-full h-48 object-cover"
        />

        {/* Content Below Image */}
        <div className="p-4">
          {/* Category Label */}
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${
            category === 'Entertainment' ? 'bg-green-200 text-green-800' :
            category === 'Tech' ? 'bg-pink-200 text-pink-800' :
            category === 'Lifestyle' ? 'bg-yellow-200 text-yellow-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            {category}
          </span>

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h2>

          {/* Description Snippet */}
          <p className="text-sm text-gray-600 font-mono line-clamp-3">
            {stripHtml(content)?.slice(0, 100)}...
          </p>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
