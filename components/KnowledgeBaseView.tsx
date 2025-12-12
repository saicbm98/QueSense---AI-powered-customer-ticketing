import React, { useState } from 'react';
import { Search, Plus, Book, ChevronRight, Eye, Calendar } from 'lucide-react';
import { MOCK_KB_ARTICLES } from '../constants';

interface KnowledgeBaseViewProps {
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ notify }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Technical', 'Billing', 'Onboarding', 'Product'];
  
  const filteredArticles = MOCK_KB_ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">
      
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 mb-1">Knowledge Base</h1>
           <p className="text-sm text-gray-500">Manage internal documentation for agents and AI context.</p>
        </div>
        <button 
          onClick={() => notify('New article editor opened', 'success')}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={16} /> New Article
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative mb-4">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text"
             placeholder="Search documentation..."
             className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-lg text-sm transition-all outline-none"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeCategory === cat 
                ? 'bg-blue-50 border-blue-100 text-primary' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <div key={article.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group" onClick={() => notify(`Opening ${article.title}`, 'info')}>
              <div className="flex justify-between items-start">
                 <div className="flex gap-4">
                   <div className="p-3 bg-blue-50 text-primary rounded-lg h-fit">
                     <Book size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-primary transition-colors">{article.title}</h3>
                     <p className="text-sm text-gray-500 mb-3">{article.excerpt}</p>
                     <div className="flex items-center gap-4 text-xs text-gray-400">
                       <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium">{article.category}</span>
                       <span className="flex items-center gap-1"><Calendar size={12}/> Updated {article.lastUpdated}</span>
                       <span className="flex items-center gap-1"><Eye size={12}/> {article.views} views</span>
                     </div>
                   </div>
                 </div>
                 <button className="text-gray-300 group-hover:text-primary transition-colors">
                   <ChevronRight size={20} />
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
             <div className="inline-block p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
               <Search size={24} />
             </div>
             <p className="text-gray-900 font-medium">No articles found</p>
             <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default KnowledgeBaseView;
