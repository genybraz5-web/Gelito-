import React, { useState, useEffect, useRef } from "react";
import { Search, Menu, X, Newspaper, ShieldAlert, Award, Hash, Flame, Sun, Moon } from "lucide-react";
import { Post } from "../types";

interface HeaderProps {
  currentCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectPost: (post: Post | null) => void;
  onOpenAdmin: () => void;
  allPosts: Post[];
  categories: string[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Header({
  currentCategory,
  onSelectCategory,
  onSelectPost,
  onOpenAdmin,
  allPosts,
  categories,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Post[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Close autocomplete on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutoComplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle autocomplete search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
      setShowAutoComplete(true);
    } else {
      setFilteredSuggestions([]);
      setShowAutoComplete(false);
    }
  }, [searchQuery, allPosts]);

  const handleSuggestionClick = (post: Post) => {
    onSelectPost(post);
    setSearchQuery("");
    setShowAutoComplete(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/95">
      {/* Top Bar for Breaking News ticker */}
      <div className="bg-rose-600 text-white text-xs py-2 px-4 font-medium flex items-center overflow-hidden">
        <div className="flex items-center space-x-2 shrink-0 bg-red-800 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Última Hora</span>
        </div>
        <div className="ml-3 truncate animate-fade-in text-[11px] sm:text-xs font-semibold">
          {allPosts.find((p) => p.isBreaking)?.title || "Bem-vindo ao Portal de Notícias mais atualizado do país!"}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand / Icon */}
          <div 
            onClick={() => {
              onSelectCategory(null);
              onSelectPost(null);
            }} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="bg-gray-950 text-white p-2 rounded-lg group-hover:bg-rose-600 transition-colors">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display text-lg sm:text-2xl font-black tracking-tight text-gray-950">
                MOZ<span className="text-rose-600">INFORMATIVO</span>
              </span>
              <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase -mt-1 hidden sm:block">
                Verdade, Desporto & Mistério
              </p>
            </div>
          </div>

          {/* Center: Search & Autocomplete */}
          <div className="hidden md:block relative w-96" ref={autocompleteRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar notícias, desporto, curiosidades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowAutoComplete(true)}
                className="w-full bg-gray-50 border border-gray-200 text-sm py-2 pl-4 pr-10 rounded-full focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 font-sans"
              />
              <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
            </div>

            {/* Autocomplete Suggestions */}
            {showAutoComplete && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  Resultados Sugeridos
                </p>
                {filteredSuggestions.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handleSuggestionClick(post)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <span className="inline-block bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">
                      {post.category}
                    </span>
                    <h4 className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-rose-600">
                      {post.title}
                    </h4>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Menu item Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Theme Toggle Button (Diurno / Noturno) */}
            <button
              onClick={onToggleTheme}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-all shadow-sm"
              title={theme === "light" ? "Mudar para Modo Noturno" : "Mudar para Modo Diurno"}
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="hidden sm:inline">Modo Noturno</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="hidden sm:inline">Modo Diurno</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center space-x-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-all shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Painel Gestão</span>
            </button>

            {/* Mobile menu and search toggles */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-rose-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scrolling Nav */}
      <div className="bg-gray-50 border-t border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 py-2 sm:py-3 shrink-0">
          <button
            onClick={() => {
              onSelectCategory(null);
              onSelectPost(null);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer transition-all uppercase tracking-tight duration-150 ${
              currentCategory === null
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-950"
            }`}
          >
            Início
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                onSelectPost(null);
              }}
              className={`px-3.5 py-1 text-xs font-bold rounded-full cursor-pointer transition-all uppercase shrink-0 tracking-tight duration-150 ${
                currentCategory === cat
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-950"
              }`}
            >
              {cat === "Desporto" ? "⚽ " : ""}
              {cat === "Mistérios" ? "🕵️ " : ""}
              {cat === "Curiosidades" ? "⚡ " : ""}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4 shadow-lg animate-slide-down">
          {/* Mobile Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-rose-500 focus:bg-white text-gray-800"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            
            {searchQuery.trim().length > 1 && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                {filteredSuggestions.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      handleSuggestionClick(post);
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-[9px] font-bold text-rose-600">{post.category}</span>
                    <h5 className="text-xs font-semibold text-gray-800 truncate">{post.title}</h5>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                onToggleTheme();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-stone-800 text-gray-800 dark:text-stone-100 text-xs font-bold rounded-lg border border-gray-200"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Modo Noturno</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Modo Diurno</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-1 px-4 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Painel Administrativo de Gestão</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
