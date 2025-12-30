import { Link } from "react-router-dom";
import { FileText, Sparkles } from "lucide-react";

export default function ArticleCard({ article }) {
  return (
    <Link to={`/articles/${article._id}`}>
      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
              {article.title}
            </h3>
            {article.isUpdatedVersion ? (
              <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
            ) : (
              <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              article.isUpdatedVersion 
                ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200" 
                : "bg-gray-100 text-gray-700 border border-gray-200"
            }`}>
              {article.isUpdatedVersion ? (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Enhanced
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3 mr-1" />
                  Original
                </>
              )}
            </span>
          </div>

          <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
            <span>Read article</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-xl transition-colors pointer-events-none" />
      </div>
    </Link>
  );
}