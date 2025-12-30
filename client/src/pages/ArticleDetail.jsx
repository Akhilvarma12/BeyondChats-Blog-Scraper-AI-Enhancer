import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticleById } from "../api/articles";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ArrowLeft, ExternalLink, Calendar, Sparkles, FileText } from "lucide-react";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchArticleById(id)
      .then(setArticle)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4 text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Article not found</p>
          <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to articles</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            {/* Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                article.isUpdatedVersion 
                  ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200" 
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}>
                {article.isUpdatedVersion ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI-Enhanced Article
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Original Article
                  </>
                )}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Divider */}
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-8" />

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {article.content}
              </div>
            </div>

            {/* References */}
            {article.references?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ExternalLink className="w-6 h-6 text-blue-600" />
                  References
                </h3>
                <ul className="space-y-3">
                  {article.references.map((ref, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                        {i + 1}
                      </span>
                      <a
                        href={ref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-700 hover:underline break-all flex-1 transition-colors"
                      >
                        {ref}
                      </a>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-1 transition-colors" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>

        {/* Back Button (Bottom) */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-6 py-3 rounded-lg hover:bg-white transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to articles</span>
          </Link>
        </div>
      </main>
    </div>
  );
}