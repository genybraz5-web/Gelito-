import React, { useState, useEffect } from "react";
import { 
  Newspaper, Search, Calendar, User as UserIcon, MessageSquare, 
  Share2, ArrowRight, Eye, Flame, Trophy, Volume2, Sparkles, 
  TrendingUp, Activity, Inbox, Settings, Users, PenSquare, 
  Plus, Edit2, Trash2, ArrowLeft, RefreshCw, Layers, ShieldCheck, 
  Check, Play, Send, Mail, Phone, MapPin, X, HelpCircle, Dumbbell
} from "lucide-react";
import { Post, Comment, Ad, Message, User, AnalyticsStats } from "./types";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  // Theme & Modern Appearance (Diurno / Noturno)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Navigation & State
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string | null>(null); // "sobre-nos", "termos-de-uso", etc.
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<"dashboard" | "artigos" | "categorias" | "users" | "ads" | "mensagens" | "config">("dashboard");

  // Site Configuration
  const [siteConfig, setSiteConfig] = useState({
    name: "MOZINFORMATIVO",
    description: "Um portal de notícias moderno, focado em conteúdos virais, mistérios e desporto com forte apelo emocional e alto engajamento em Moçambique.",
    logoText: "MOZINFORMATIVO",
    phone: "+258 87 707 3263",
    email: "contacto@mozinformativo.co.mz",
    address: "Avenida do FPLM, Prédios Maconde, Nampula",
    facebook: "https://facebook.com",
    whatsappLink: "https://wa.me/258877073263"
  });

  // Client comments for the active view
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Email Capture Direct
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Direct contact message states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactType, setContactType] = useState<"contacto" | "publicidade">("contacto");
  const [messageSuccess, setMessageSuccess] = useState(false);

  // Admin and Editor State fields
  const [adminPosts, setAdminPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [adminStats, setAdminStats] = useState<AnalyticsStats | null>(null);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminMessages, setAdminMessages] = useState<Message[]>([]);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // New Post Form field states
  const [postTitle, setPostTitle] = useState("");
  const [postSubtitle, setPostSubtitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Notícias");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postImage, setPostImage] = useState("");
  const [postImageAspectRatio, setPostImageAspectRatio] = useState<"16:9" | "4:3" | "1:1" | "9:16">("16:9");
  const [postImageAltSeo, setPostImageAltSeo] = useState("");
  const [postImageAltAuto, setPostImageAltAuto] = useState(true);
  const [imageInputMethod, setImageInputMethod] = useState<"upload" | "url">("upload");
  const [postAuthor, setPostAuthor] = useState("Délio Braz");
  const [postIsViral, setPostIsViral] = useState(false);
  const [postIsBreaking, setPostIsBreaking] = useState(false);

  // Game/Sports match metadata fields inside Post
  const [includeSportMatch, setIncludeSportMatch] = useState(false);
  const [sportHome, setSportHome] = useState("");
  const [sportAway, setSportAway] = useState("");
  const [sportHomeScore, setSportHomeScore] = useState(0);
  const [sportAwayScore, setSportAwayScore] = useState(0);
  const [sportStadium, setSportStadium] = useState("Estádio Nacional do Zimpeto, Maputo");
  const [sportPossessionHome, setSportPossessionHome] = useState(50);
  const [sportShotsHome, setSportShotsHome] = useState(10);
  const [sportShotsAway, setSportShotsAway] = useState(10);
  const [sportPlayerHighlight, setSportPlayerHighlight] = useState("");

  // New Category creator state
  const [newCatName, setNewCatName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "editor" | "leitor">("editor");
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);

  // Admin Custom Ads settings
  const [adCodeTopo, setAdCodeTopo] = useState("");
  const [adCodeMeio, setAdCodeMeio] = useState("");
  const [adCodeRodape, setAdCodeRodape] = useState("");

  // File upload processing to offline Base64 helper
  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPostImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // State to track JSON DB Backup import flow
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error" | "loading" | null; message: string }>({ type: null, message: "" });

  const handleBackupImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus({ type: "loading", message: "A carregar, validar e sanitizar ficheiro backup..." });

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== "string") {
          throw new Error("Formato de ficheiro inválido para leitura.");
        }
        const parsed = JSON.parse(text);
        if (!parsed.posts || !parsed.categories) {
          throw new Error("O ficheiro JSON não é uma base de dados válida do MozInformativo (estão em falta os artigos ou categorias).");
        }

        const res = await fetch("/api/backup/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed)
        });

        if (res.ok) {
          setImportStatus({ type: "success", message: "Base de dados importada com sucesso no servidor!" });
          await fetchInitialData();
          setTimeout(() => {
            setImportStatus({ type: null, message: "" });
          }, 4000);
        } else {
          const errData = await res.json();
          throw new Error(errData.error || "O servidor recusou a gravação do ficheiro backup.");
        }
      } catch (err: any) {
        setImportStatus({ type: "error", message: `Falha na restauração: ${err.message}` });
        setTimeout(() => {
          setImportStatus({ type: null, message: "" });
        }, 6000);
      }
    };
    reader.readAsText(file);
  };

  // Load baseline data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const postsRes = await fetch("/api/posts");
      const postsData = await postsRes.json();
      setPosts(postsData);
      setAdminPosts(postsData);

      // Autoselect post from search query if any (deep link)
      const params = new URLSearchParams(window.location.search);
      const urlPostId = params.get("postId");
      if (urlPostId) {
        const found = postsData.find((p: any) => String(p.id) === String(urlPostId));
        if (found) {
          setSelectedPost(found);
          setActivePage(null);
          setIsAdminOpen(false);
        }
      }

      const catsRes = await fetch("/api/categories");
      const catsData = await catsRes.json();
      setCategories(catsData);

      const tagsRes = await fetch("/api/tags");
      const tagsData = await tagsRes.json();
      setTags(tagsData);

      const adsRes = await fetch("/api/ads");
      const adsData = await adsRes.json();
      setAds(adsData);

      // Distribute ad codes to editor states
      const topAd = adsData.find((a: Ad) => a.position === "topo");
      const midAd = adsData.find((a: Ad) => a.position === "meio");
      const bottomAd = adsData.find((a: Ad) => a.position === "rodape");
      if (topAd) setAdCodeTopo(topAd.code);
      if (midAd) setAdCodeMeio(midAd.code);
      if (bottomAd) setAdCodeRodape(bottomAd.code);

      // Load analytics and admin data lists
      fetchAdminData();
    } catch (err) {
      console.error("Erro ao carregar dados do Portal:", err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const statsRes = await fetch("/api/stats");
      const stats = await statsRes.json();
      setAdminStats(stats);

      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      setAdminUsers(usersData);

      const msgsRes = await fetch("/api/messages");
      const msgsData = await msgsRes.json();
      setAdminMessages(msgsData);

      const commentsRes = await fetch("/api/comments");
      const commentsData = await commentsRes.json();
      setCommentList(commentsData);
    } catch (e) {
      console.error("Erro ao ler dados administrativos:", e);
    }
  };

  // Views details loader
  const handlePostClick = async (post: Post) => {
    try {
      setSelectedPost(post);
      setActivePage(null);
      setIsAdminOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Fetch individually to increment views
      const detailRes = await fetch(`/api/posts/${post.id}`);
      if (detailRes.ok) {
        const updated = await detailRes.json();
        // Update local list visual metric
        setPosts((current) =>
          current.map((p) => (p.id === updated.id ? { ...p, views: updated.views } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Suggest automatic viral titles with AI (Gemini trigger)
  const handleAISuggestTitles = async () => {
    const textToAnalyze = postContent || postTitle || "Futebol moçambicano e segredos inacreditáveis";
    setIsSuggesting(true);
    setSuggestedTitles([]);
    try {
      const response = await fetch("/api/suggest-titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textToAnalyze, category: postCategory })
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestedTitles(data.titulos || []);
      }
    } catch (error) {
      console.error("Erro ao requisitar títulos:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Save/Submit new article
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent || !postCategory) {
      alert("Por favor preencha os campos obrigatórios (Título, Categoria e Conteúdo).");
      return;
    }

    // Auto-calculate optimized image URL if using Unsplash
    let finalImageUrl = postImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
    if (finalImageUrl.includes("images.unsplash.com")) {
      const baseUrl = finalImageUrl.split("?")[0];
      let w = 1200;
      let h = 675;
      if (postImageAspectRatio === "4:3") { h = 900; }
      else if (postImageAspectRatio === "1:1") { w = 1000; h = 1000; }
      else if (postImageAspectRatio === "9:16") { w = 720; h = 1280; }
      finalImageUrl = `${baseUrl}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
    }

    const finalAltSeo = postImageAltAuto
      ? `Moçambique Notícias - ${postCategory}: ${postTitle}. Foto e cobertura de desporto e mistérios por ${postAuthor || "Délio Braz"} no MOZINFORMATIVO`
      : postImageAltSeo.trim() || `Imagem destacada de ${postTitle} no portal MozInformativo`;

    const payload = {
      title: postTitle,
      subtitle: postSubtitle,
      content: postContent,
      category: postCategory,
      tags: postTags,
      image: finalImageUrl,
      imageAspectRatio: postImageAspectRatio,
      imageAltSeo: finalAltSeo,
      author: postAuthor,
      isViral: postIsViral,
      isBreaking: postIsBreaking,
      matchInfo: includeSportMatch ? {
        homeTeam: sportHome || "Mambas",
        awayTeam: sportAway || "Desafiante",
        homeScore: sportHomeScore,
        awayScore: sportAwayScore,
        stadium: sportStadium,
        stats: {
          possessionHome: sportPossessionHome,
          possessionAway: 100 - sportPossessionHome,
          shotsHome: sportShotsHome,
          shotsAway: sportShotsAway,
          cornersHome: 4,
          cornersAway: 4,
          foulsHome: 10,
          foulsAway: 12
        },
        outstandingPlayer: sportPlayerHighlight || "Estrela do Jogo"
      } : undefined
    };

    try {
      let response;
      if (editingPost) {
        // Edit mode
        response = await fetch(`/api/posts/${editingPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Create mode
        response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        // Reset states
        clearPostForm();
        fetchInitialData();
        alert(editingPost ? "Artigo atualizado com sucesso!" : "Artigo publicado com sucesso!");
        setAdminTab("artigos");
      }
    } catch (err) {
      console.error("Erro ao salvar artigo:", err);
    }
  };

  const clearPostForm = () => {
    setEditingPost(null);
    setIsCreatingPost(false);
    setPostTitle("");
    setPostSubtitle("");
    setPostContent("");
    setPostCategory("Notícias");
    setPostTags([]);
    setPostImage("");
    setPostImageAspectRatio("16:9");
    setPostImageAltSeo("");
    setPostImageAltAuto(true);
    setImageInputMethod("upload");
    setPostAuthor("Délio Braz");
    setPostIsViral(false);
    setPostIsBreaking(false);
    setIncludeSportMatch(false);
    setSportHome("");
    setSportAway("");
    setSportHomeScore(0);
    setSportAwayScore(0);
    setSportPlayerHighlight("");
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setIsCreatingPost(true);
    setPostTitle(post.title);
    setPostSubtitle(post.subtitle || "");
    setPostContent(post.content);
    setPostCategory(post.category);
    setPostTags(post.tags);
    setPostImage(post.image);
    setPostImageAspectRatio(post.imageAspectRatio || "16:9");
    setPostImageAltSeo(post.imageAltSeo || "");
    setPostImageAltAuto(post.imageAltSeo ? false : true);
    setImageInputMethod(post.image && post.image.startsWith("data:") ? "upload" : "url");
    setPostAuthor(post.author);
    setPostIsViral(post.isViral);
    setPostIsBreaking(post.isBreaking);
    if (post.matchInfo) {
      setIncludeSportMatch(true);
      setSportHome(post.matchInfo.homeTeam);
      setSportAway(post.matchInfo.awayTeam);
      setSportHomeScore(post.matchInfo.homeScore);
      setSportAwayScore(post.matchInfo.awayScore);
      setSportStadium(post.matchInfo.stadium);
      setSportPossessionHome(post.matchInfo.stats.possessionHome);
      setSportShotsHome(post.matchInfo.stats.shotsHome);
      setSportShotsAway(post.matchInfo.stats.shotsAway);
      setSportPlayerHighlight(post.matchInfo.outstandingPlayer);
    } else {
      setIncludeSportMatch(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar este artigo definitivamente do portal?")) {
      try {
        const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchInitialData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Categories Manager
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCatName })
      });
      if (res.ok) {
        setNewCatName("");
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    if (confirm(`Pretende excluir a categoria "${cat}" do Portal de Notícias?`)) {
      try {
        const res = await fetch("/api/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: cat })
        });
        if (res.ok) {
          fetchInitialData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Comments submit
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentName || !commentText) return;

    try {
      const res = await fetch(`/api/posts/${selectedPost.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: commentName, commentText })
      });
      if (res.ok) {
        setCommentName("");
        setCommentText("");
        setCommentSuccess(true);
        setTimeout(() => setCommentSuccess(false), 4000);
        // Refresh comments list
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (comId: string) => {
    try {
      const res = await fetch(`/api/comments/${comId}`, { method: "DELETE" });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Block/approve users toggler
  const handleUserStatusToggle = async (userId: string, currentStatus: "active" | "blocked") => {
    const nextStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create User Helper
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUserName, email: newUserEmail, role: newUserRole })
      });
      if (res.ok) {
        setNewUserName("");
        setNewUserEmail("");
        fetchAdminData();
        alert("Utilizador adicionado com sucesso!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit banner custom code positions
  const handleSaveAds = async (position: "topo" | "meio" | "rodape", code: string) => {
    try {
      const res = await fetch("/api/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, code, isCode: true })
      });
      if (res.ok) {
        alert("Configuração de anúncios AdSense atualizada com sucesso!");
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Direct contact message submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      alert("Por favor insira Nome, Email e Mensagem.");
      return;
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject || `Mensagem de ${contactType}`,
          message: contactMessage,
          type: contactType
        })
      });
      if (res.ok) {
        setContactName("");
        setContactEmail("");
        setContactSubject("");
        setContactMessage("");
        setMessageSuccess(true);
        setTimeout(() => setMessageSuccess(false), 5000);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (confirm("Apagar mensagem permanentemente?")) {
      try {
        const res = await fetch(`/api/messages/${msgId}`, { method: "DELETE" });
        if (res.ok) {
          fetchAdminData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Newsletter direct captures
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  // Categorize or filter posts
  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase())
    : posts;

  // Filter viral feeds
  const viralPosts = posts.filter((p) => p.isViral);
  const breakingNews = posts.filter((p) => p.isBreaking);
  const mostRead = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-stone-900 border-t-8 border-gray-950">
      
      {/* Topmost Ad Block */}
      <div className="max-w-7xl mx-auto px-4 w-full mt-2">
        {ads.find(a => a.position === "topo") ? (
          <div 
            dangerouslySetInnerHTML={{ __html: ads.find(a => a.position === "topo")?.code || "" }} 
            className="w-full text-center"
          />
        ) : (
          <div className="bg-amber-100 border border-amber-300 py-3 text-center text-xs font-bold text-amber-800 uppercase tracking-widest rounded">
            🔥 ESPAÇO PUBLICITÁRIO PORTAL TOPO - ANUNCIE JÁ COM PREÇOS ESPECIAIS 🔥
          </div>
        )}
      </div>

      {/* Main Responsive Custom Navigation Header */}
      <Header 
        currentCategory={selectedCategory} 
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedPost(null);
          setActivePage(null);
          setIsAdminOpen(false);
        }}
        onSelectPost={handlePostClick}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          setSelectedPost(null);
          setActivePage(null);
          setSelectedCategory(null);
        }}
        allPosts={posts}
        categories={categories}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 🟢 PORTAL BODY */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: ADVANCED PANEL (ADMINISTRATIVO) */}
        {isAdminOpen ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
            {/* Header dashboard layout */}
            <div className="bg-gray-950 px-6 py-5 text-white flex flex-col sm:flex-row items-center justify-between border-b border-gray-800">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <div className="bg-rose-600 p-2 rounded text-white">
                  <Settings className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-black uppercase tracking-tight">
                    Painel Administrativo do Portal
                  </h1>
                  <p className="text-xs text-rose-400 font-mono">Controlo Centralizado & Geração de Conteúdo IA</p>
                </div>
              </div>

              {/* Action close button */}
              <button 
                onClick={() => {
                  setIsAdminOpen(false);
                  fetchInitialData();
                }} 
                className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 font-bold text-xs uppercase cursor-pointer rounded-lg flex items-center space-x-1 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sair do Painel</span>
              </button>
            </div>

            {/* Navigation Tabs and Layout Grid options */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              
              {/* Sidebar Menu elements */}
              <div className="col-span-1 bg-stone-50 border-r border-gray-200 p-4 space-y-1">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 mb-2">Visão Geral</p>
                <button
                  onClick={() => { setAdminTab("dashboard"); fetchAdminData(); }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all ${
                    adminTab === "dashboard" ? "bg-rose-600 text-white" : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Dashboard Geral</span>
                </button>
                <button
                  onClick={() => setAdminTab("artigos")}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all ${
                    adminTab === "artigos" ? "bg-rose-600 text-white" : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Gerir Artigos ({adminPosts.length})</span>
                </button>
                <button
                  onClick={() => setAdminTab("categorias")}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all ${
                    adminTab === "categorias" ? "bg-rose-600 text-white" : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Categorias & Tags</span>
                </button>

                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 mt-6 mb-2">Comunicação & Ads</p>
                <button
                  onClick={() => setAdminTab("users")}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all ${
                    adminTab === "users" ? "bg-rose-600 text-white" : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Utilizadores ({adminUsers.length})</span>
                </button>
                <button
                  onClick={() => setAdminTab("ads")}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all ${
                    adminTab === "ads" ? "bg-rose-600 text-white" : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-stone-900">Gestão de Anúncios AdSense</span>
                </button>
                <button
                  onClick={() => setAdminTab("mensagens")}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all ${
                    adminTab === "mensagens" ? "bg-rose-600 text-white" : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  <span>Mensagens Recebidas ({adminMessages.length})</span>
                </button>
                <button
                  onClick={() => setAdminTab("config")}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center space-x-2 transition-all ${
                    adminTab === "config" ? "bg-rose-600 text-white" : "text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Configurações SEO Global</span>
                </button>
              </div>

              {/* Main Content Pane */}
              <div className="col-span-1 lg:col-span-4 p-6 min-h-[500px] bg-white text-stone-950">
                
                {/* SUBTAB 1: ANALYTICS DASHBOARD */}
                {adminTab === "dashboard" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h2 className="text-lg font-display font-extrabold uppercase border-l-4 border-rose-600 pl-2">
                        Painel Analítico de Desempenho
                      </h2>
                      <button 
                        onClick={fetchAdminData} 
                        className="p-1 px-3 bg-stone-100 hover:bg-stone-200 text-[11px] font-extrabold rounded flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Atualizar</span>
                      </button>
                    </div>

                    {/* Numeric stats cards grid layout */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Visualizações Globais</p>
                        <span className="text-2xl font-black font-mono block mt-1 text-gray-950">
                          {adminStats?.totalViews || 12450}
                        </span>
                        <div className="text-[10px] text-green-600 font-bold mt-1">▲ +24% este mês</div>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Artigos Publicados</p>
                        <span className="text-2xl font-black font-mono block mt-1 text-gray-950">
                          {adminStats?.postsCount || posts.length}
                        </span>
                        <div className="text-[10px] text-stone-500 font-medium mt-1">100% Indexados no Google</div>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Comentários no Site</p>
                        <span className="text-2xl font-black font-mono block mt-1 text-gray-950">
                          {adminStats?.commentsCount || commentList.length}
                        </span>
                        <div className="text-[10px] text-orange-500 font-bold mt-1">Moderação Automática Ativa</div>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 shadow-sm">
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Propostas Publicidade</p>
                        <span className="text-2xl font-black font-mono block mt-1 text-gray-950">
                          {adminStats?.messagesCount || adminMessages.length}
                        </span>
                        <div className="text-[10px] text-indigo-600 font-bold mt-1">Inboxes Pendentes para Resposta</div>
                      </div>
                    </div>

                    {/* Highly aesthetic Custom SVG visualizer for metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 p-5 rounded-xl border border-stone-200">
                      <div>
                        <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider mb-4">
                          Popularidade de Artigos por Categoria (Views)
                        </h4>
                        
                        {/* custom visual bars */}
                        <div className="space-y-3.5">
                          {categories.slice(0, 5).map((cat, i) => {
                            const val = (adminStats?.viewsByCategory?.[cat] || (1450 + i * 900));
                            const viewsArray = Object.values(adminStats?.viewsByCategory || {}) as number[];
                            const maxVal = viewsArray.length > 0 ? Math.max(...viewsArray, 4500) : 4500;
                            const percent = Math.min(Math.round((val / maxVal) * 100), 100);
                            return (
                              <div key={cat} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                  <span>{cat}</span>
                                  <span className="font-mono">{val} visualizações</span>
                                </div>
                                <div className="w-full bg-stone-200 h-2 rounded overflow-hidden">
                                  <div 
                                    className="bg-rose-600 h-full rounded" 
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Top Articles in visual rank list */}
                      <div>
                        <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider mb-4 flex items-center space-x-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span>Conteúdos Virais Mais Acedidos</span>
                        </h4>
                        
                        <div className="space-y-3">
                          {adminStats?.topPosts ? (
                            adminStats.topPosts.map((post, index) => (
                              <div key={index} className="flex items-center space-x-3 text-xs border-b border-stone-100 pb-2">
                                <span className="font-mono font-black text-rose-600 text-sm">0{index + 1}</span>
                                <div className="flex-1">
                                  <span className="font-semibold block line-clamp-1">{post.title}</span>
                                  <span className="text-[10px] text-gray-400 capitalize">{post.category}</span>
                                </div>
                                <span className="font-mono bg-stone-200 px-2 py-0.5 rounded text-gray-700 text-[10px]">
                                  {post.views}
                                </span>
                              </div>
                            ))
                          ) : (
                            posts.slice(0, 4).map((post, index) => (
                              <div key={post.id} className="flex items-center space-x-3 text-xs border-b border-stone-100 pb-2">
                                <span className="font-mono font-black text-rose-600 text-sm">0{index + 1}</span>
                                <div className="flex-1">
                                  <span className="font-semibold block line-clamp-1">{post.title}</span>
                                  <span className="text-[10px] text-gray-400 font-mono italic">{post.category}</span>
                                </div>
                                <span className="font-mono bg-stone-200 px-2 py-0.5 rounded font-bold text-gray-900">
                                  {post.views}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: ARTICLES GESTION & PUBLISHING */}
                {adminTab === "artigos" && (
                  <div className="space-y-6">
                    {!isCreatingPost ? (
                      <div>
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                          <div>
                            <h2 className="text-lg font-display font-extrabold uppercase">Gerenciamento de Notícias</h2>
                            <p className="text-xs text-gray-500">Crie, edite e promova categorias de histórias no site</p>
                          </div>
                          
                          <button
                            onClick={() => {
                              clearPostForm();
                              setIsCreatingPost(true);
                            }}
                            className="px-4 py-2 bg-gray-950 text-white hover:bg-rose-600 text-xs font-black uppercase rounded shadow flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Escrever Novo Artigo</span>
                          </button>
                        </div>

                        {/* Articles spreadsheet listing */}
                        <div className="mt-4 overflow-x-auto">
                          <table className="w-full text-left text-xs text-stone-700">
                            <thead>
                              <tr className="bg-stone-100 uppercase tracking-tight text-[10px] font-black border-b border-gray-300">
                                <th className="p-3">Destaque</th>
                                <th className="p-3">Título do Artigo</th>
                                <th className="p-3">Categoria</th>
                                <th className="p-3">Visualizações</th>
                                <th className="p-3 text-center">Divulgação FB</th>
                                <th className="p-3 text-right">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminPosts.map((post) => (
                                <tr key={post.id} className="border-b border-gray-100 hover:bg-stone-50 transition-colors">
                                  <td className="p-3">
                                    <div className="flex space-x-1">
                                      {post.isBreaking && <span className="bg-red-600 text-white px-1 py-0.5 rounded text-[8px] font-bold">Breaking</span>}
                                      {post.isViral && <span className="bg-amber-500 text-stone-950 px-1 py-0.5 rounded text-[8px] font-bold">VIRAL</span>}
                                      {!post.isBreaking && !post.isViral && <span className="text-gray-300 text-[10px] font-mono">Normal</span>}
                                    </div>
                                  </td>
                                  <td className="p-3 font-semibold text-gray-950 max-w-sm shrink truncate" title={post.title}>
                                    {post.title}
                                  </td>
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded font-semibold text-[10px]">
                                      {post.category}
                                    </span>
                                  </td>
                                  <td className="p-3 font-mono text-gray-900 font-bold">{post.views}</td>
                                  <td className="p-3 text-center">
                                    <a
                                      href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + window.location.pathname + "?postId=" + post.id)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 py-1 px-2.5 bg-[#1877f2] hover:bg-[#145dbf] hover:scale-105 text-white rounded text-[10px] font-extrabold uppercase transition-all shadow-sm active:scale-95"
                                      title="Publicar esta notícia diretamente no Facebook"
                                    >
                                      <span>🔵 Partilhar</span>
                                    </a>
                                  </td>
                                  <td className="p-3 text-right space-x-2">
                                    <button
                                      onClick={() => handleEditClick(post)}
                                      className="p-1 px-2.5 bg-stone-100 hover:bg-blue-100 hover:text-blue-700 rounded text-[11px] font-bold transition-colors"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => handleDeletePost(post.id)}
                                      className="p-1 px-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[11px] font-bold transition-colors"
                                    >
                                      Apagar
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSavePost} className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                          <div>
                            <h3 className="text-lg font-display font-extrabold text-stone-900 uppercase">
                              {editingPost ? "✍️ Editar Artigo Existente" : "✍️ Criar e Publicar Artigo"}
                            </h3>
                            <p className="text-xs text-gray-500">Editor de conteúdo com sugestão automática de títulos virais</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={clearPostForm}
                            className="p-1.5 px-3 bg-stone-100 hover:bg-stone-200 font-bold text-xs uppercase rounded"
                          >
                            Cancelar
                          </button>
                        </div>

                        {/* INPUTS ROW */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Col Larga: Editor */}
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título Viral Principal (*)</label>
                              <input
                                type="text"
                                placeholder="Insira o título de forte impacto..."
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                className="w-full border border-gray-200 p-2.5 rounded text-sm focus:outline-none focus:border-rose-600 bg-white"
                                required
                              />
                            </div>

                            {/* ✨ AI VIRAL TITLE IMPROVER BLOCK */}
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1.5 text-amber-900">
                                  <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                                  <span className="text-xs font-black uppercase tracking-wider">Sugestão Automática IA de Títulos Virais</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAISuggestTitles}
                                  disabled={isSuggesting}
                                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-black text-[10px] uppercase rounded flex items-center space-x-1 transition-all disabled:opacity-50"
                                >
                                  {isSuggesting ? "A Pensar..." : "Sugerir com Gemini"}
                                </button>
                              </div>

                              <p className="text-[11px] text-amber-800 leading-relaxed">
                                Clique no botão acima para submeter o texto ou tema ao assistente de IA Gemini. Ele formulará 5 variações incríveis sob medida para maximizar o número de partilhas!
                              </p>

                              {suggestedTitles.length > 0 && (
                                <div className="space-y-1.5 mt-2">
                                  <p className="text-[10px] font-bold uppercase text-amber-700">Títulos sugeridos (Clique para usar):</p>
                                  {suggestedTitles.map((t, idx) => (
                                    <div 
                                      key={idx}
                                      onClick={() => {
                                        setPostTitle(t);
                                        setSuggestedTitles([]);
                                      }}
                                      className="p-2 bg-white hover:bg-amber-100 border border-amber-200 text-xs text-gray-900 rounded cursor-pointer font-semibold transition-colors flex justify-between items-center"
                                    >
                                      <span>{t}</span>
                                      <Check className="w-3.5 h-3.5 text-green-600" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo ou Olhar da Notícia</label>
                              <input
                                type="text"
                                placeholder="Breve introdução para a larde do site..."
                                value={postSubtitle}
                                onChange={(e) => setPostSubtitle(e.target.value)}
                                className="w-full border border-gray-200 p-2.5 rounded text-sm bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Conteúdo Formato Rico (*)</label>
                              <textarea
                                rows={10}
                                placeholder="Insira o texto principal. Utilize tags HTML <br/><br/> ou <b> para destacar porções se desejar."
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="w-full border border-gray-200 p-2.5 rounded text-sm font-sans focus:outline-none focus:border-black bg-white"
                                required
                              />
                            </div>
                          </div>

                          {/* Col Lateral: Metadados */}
                          <div className="space-y-4 bg-stone-50 p-4 rounded-lg border border-stone-200">
                            <div>
                              <label className="block text-xs font-black uppercase text-gray-700 mb-1">Categoria Principal</label>
                              <select
                                value={postCategory}
                                onChange={(e) => setPostCategory(e.target.value)}
                                className="w-full border border-gray-200 p-2 rounded text-xs bg-white text-stone-900"
                              >
                                {categories.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-black uppercase text-gray-700 mb-1">Tags (Separadas por vírgulas)</label>
                              <input
                                type="text"
                                placeholder="Moçambique, CAN 2026, Mistério"
                                value={postTags.join(", ")}
                                onChange={(e) => setPostTags(e.target.value.split(",").map(s => s.trim()))}
                                className="w-full border border-gray-200 p-2 rounded text-xs bg-white"
                              />
                            </div>

                            {/* 🖼️ PAINEL AVANÇADO DE IMAGENS & SEO AUTOMÁTICO */}
                            <div className="bg-stone-100 dark:bg-stone-850 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4 font-sans">
                              <span className="text-[11px] font-black uppercase text-rose-600 tracking-wider flex items-center gap-1">
                                🖼️ Imagem Destacada & Otimização SEO
                              </span>

                              {/* Toggle Options */}
                              <div className="grid grid-cols-2 gap-2 bg-stone-200 dark:bg-stone-800 p-1 rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => setImageInputMethod("upload")}
                                  className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    imageInputMethod === "upload"
                                      ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm"
                                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-250"
                                  }`}
                                >
                                  📂 Carregar Ficheiro (Local)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setImageInputMethod("url")}
                                  className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    imageInputMethod === "url"
                                      ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm"
                                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-250"
                                  }`}
                                >
                                  🔗 Link de Internet (URL)
                                </button>
                              </div>

                              {imageInputMethod === "upload" ? (
                                <div className="space-y-3">
                                  <div 
                                    className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-rose-450 dark:hover:border-rose-500 rounded-xl p-4 transition-all text-center bg-white dark:bg-stone-900 cursor-pointer relative"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      const file = e.dataTransfer.files?.[0];
                                      if (file) {
                                        handleFileSelect(file);
                                      }
                                    }}
                                  >
                                    <input
                                      type="file"
                                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleFileSelect(file);
                                        }
                                      }}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="space-y-2 pointer-events-none">
                                      <div className="text-2xl">📸</div>
                                      <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                                        Arrastar ou Escolher Ficheiro de Imagem
                                      </p>
                                      <p className="text-[9px] text-stone-500 dark:text-stone-400">
                                        Formatos suportados: PNG, JPG, JPEG, WEBP, GIF, SVG
                                      </p>
                                    </div>
                                  </div>

                                  {postImage && postImage.startsWith("data:") && (
                                    <div className="flex items-center justify-between p-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950 rounded-lg">
                                      <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-10 h-10 bg-stone-200 rounded overflow-hidden shrink-0 border border-stone-300">
                                          <img src={postImage} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="overflow-hidden">
                                          <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200 block truncate">Imagem Escolhida</span>
                                          <span className="text-[8px] text-stone-500 dark:text-stone-400">Base64 Armazenado</span>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setPostImage("")}
                                        className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-750 bg-white dark:bg-stone-900 border border-rose-200 dark:border-stone-800 rounded px-2 py-1"
                                      >
                                        Remover
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {/* URL Input */}
                                  <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-700 dark:text-stone-300 mb-1">
                                      Link da Imagem (Manual / URL)
                                    </label>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="https://images.unsplash.com/..."
                                        value={postImage && !postImage.startsWith("data:") ? postImage : ""}
                                        onChange={(e) => setPostImage(e.target.value)}
                                        className="flex-1 border border-gray-200 p-2 rounded text-xs bg-white text-stone-950 font-mono shadow-inner border-stone-300 dark:border-stone-700"
                                      />
                                      {postImage && !postImage.startsWith("data:") && (
                                        <button
                                          type="button"
                                          onClick={() => setPostImage("")}
                                          className="px-2.5 py-1.5 bg-gray-200 dark:bg-stone-800 hover:bg-rose-500 hover:text-white rounded text-xs font-bold transition-all text-stone-700 dark:text-stone-300"
                                          title="Limpar Link"
                                        >
                                          Limpar
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-[9px] text-gray-400 dark:text-stone-400 mt-1">
                                      Insira qualquer URL manual de imagem ou use os botões rápidos abaixo.
                                    </p>
                                  </div>

                                  {/* Quick stock suggestions */}
                                  <div>
                                    <label className="block text-[9px] font-black uppercase text-gray-500 dark:text-stone-400 mb-1">
                                      Sugestões Rápidas de Links Royalty-Free:
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setImageInputMethod("url");
                                          setPostImage("https://images.unsplash.com/photo-1508098682722-e99c43a406b2");
                                        }}
                                        className="p-1 px-2 bg-rose-50 hover:bg-rose-100 dark:bg-stone-800 text-rose-700 dark:text-rose-300 rounded text-[10px] font-semibold border border-rose-100 dark:border-stone-700"
                                      >
                                        ⚽ Desporto / Estádio
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setImageInputMethod("url");
                                          setPostImage("https://images.unsplash.com/photo-1509114397022-ed747cca3f65");
                                        }}
                                        className="p-1 px-2 bg-purple-50 hover:bg-purple-100 dark:bg-stone-800 text-purple-700 dark:text-purple-300 rounded text-[10px] font-semibold border border-purple-100 dark:border-stone-700"
                                      >
                                        🌌 Mistérios / Noite
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setImageInputMethod("url");
                                          setPostImage("https://images.unsplash.com/photo-1518770660439-4636190af475");
                                        }}
                                        className="p-1 px-2 bg-blue-50 hover:bg-blue-100 dark:bg-stone-800 text-blue-700 dark:text-blue-300 rounded text-[10px] font-semibold border border-blue-100 dark:border-stone-700"
                                      >
                                        💻 Ciência / Tecnologia
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setImageInputMethod("url");
                                          setPostImage("https://images.unsplash.com/photo-1516259762381-22954d7d3ad2");
                                        }}
                                        className="p-1 px-2 bg-amber-50 hover:bg-amber-100 dark:bg-stone-800 text-amber-700 dark:text-amber-300 rounded text-[10px] font-semibold border border-amber-100 dark:border-stone-700"
                                      >
                                        🔥 Viral / Impacto
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Proportions / Dimensions */}
                              <div>
                                <label className="block text-[10px] font-black uppercase text-gray-700 dark:text-stone-300 mb-1.5">
                                  Proporção de Corte (Aspect Ratio)
                                </label>
                                <div className="grid grid-cols-4 gap-1.5 font-sans">
                                  {[
                                    { ratio: "16:9", label: "Paisagem", desc: "Notícias", icon: "📺" },
                                    { ratio: "4:3", label: "Clássico", desc: "Fotojornalismo", icon: "📷" },
                                    { ratio: "1:1", label: "Quadrado", desc: "FB / WA Link", icon: "📱" },
                                    { ratio: "9:16", label: "Vertical", desc: "Story / Status", icon: "🤳" }
                                  ].map((p) => (
                                    <button
                                      type="button"
                                      key={p.ratio}
                                      onClick={() => setPostImageAspectRatio(p.ratio as any)}
                                      className={`p-1.5 rounded-lg border text-center transition-all ${
                                        postImageAspectRatio === p.ratio
                                          ? "bg-rose-600 border-rose-600 text-white shadow-md font-bold"
                                          : "bg-white dark:bg-stone-900 border-gray-205 dark:border-stone-700 text-stone-750 dark:text-stone-300 hover:border-rose-400"
                                      }`}
                                    >
                                      <div className="text-sm">{p.icon}</div>
                                      <div className="text-[10px] font-sans font-bold leading-tight">{p.ratio}</div>
                                      <div className={`text-[8px] opacity-75 hidden sm:block font-normal`}>{p.label}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* SEO Otimization Setup */}
                              <div className="bg-white dark:bg-stone-900 p-3 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2.5">
                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider flex items-center gap-1">
                                  🚀 Mecanismo de SEO Inteligente
                                </span>

                                <label className="flex items-center space-x-2 text-[10px] font-bold text-stone-800 dark:text-stone-200 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={postImageAltAuto}
                                    onChange={(e) => setPostImageAltAuto(e.target.checked)}
                                    className="rounded border-gray-300 h-3.5 w-3.5 bg-white shrink-0"
                                  />
                                  <span>Gerar Atributos de SEO em Moçambique Robotizados</span>
                                </label>

                                {postImageAltAuto ? (
                                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-100 dark:border-emerald-950 text-[9px] leading-relaxed space-y-1">
                                    <span className="font-extrabold uppercase">Tag Alt Automática Gerada para Googlebot:</span>
                                    <p className="italic font-mono">
                                      "Moçambique Notícias - {postCategory}: {postTitle || "[Título do Artigo]"}. Foto e cobertura de desporto e mistérios por {postAuthor || "Délio Braz"} no MOZINFORMATIVO"
                                    </p>
                                    <div className="text-[8px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5" />
                                  </div>
                                ) : (
                                  <div>
                                    <label className="block text-[9px] font-black uppercase text-gray-600 dark:text-stone-300 mb-1">
                                      Atributo Alt SEO Personalizado (Google Alt Tag)
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Ex: Foto dos Mambas no campo do Zimpeto em Maputo"
                                      value={postImageAltSeo}
                                      onChange={(e) => setPostImageAltSeo(e.target.value)}
                                      className="w-full border border-gray-200 p-1.5 rounded text-[10px] bg-white text-stone-900"
                                    />
                                    <p className="text-[8px] text-gray-400 mt-1">
                                      Descreva a foto em detalhes fidedignos utilizando termos-chave do cenário de Moçambique.
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Live Ratio Preview Box */}
                              {postImage && (
                                <div className="space-y-1 font-sans">
                                  <span className="block text-[9px] font-black uppercase text-gray-500">Pré-visualização do Corte:</span>
                                  <div className="border border-stone-300 rounded overflow-hidden relative bg-stone-200 dark:bg-stone-950 flex items-center justify-center">
                                    <div className={`w-full overflow-hidden transition-all duration-300 ${
                                      postImageAspectRatio === "16:9" ? "aspect-video" :
                                      postImageAspectRatio === "4:3" ? "aspect-[4/3]" :
                                      postImageAspectRatio === "1:1" ? "aspect-square" :
                                      "aspect-[9/16] max-h-48"
                                    }`}>
                                      <img
                                        src={postImage}
                                        alt="Corte Preview"
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                      {postImageAspectRatio} Previsão
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* 📢 MEGAFONE DE DIVULGAÇÃO FACEBOOK */}
                            <div className="bg-blue-50 dark:bg-stone-900 border border-blue-200 dark:border-stone-850 p-3.5 rounded-lg space-y-2.5">
                              <span className="text-[10px] font-black uppercase text-[#1877f2] dark:text-blue-400 tracking-wider flex items-center gap-1">
                                📢 Megafone de Redes Sociais (Facebook)
                              </span>
                              <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-normal">
                                Copie o sumário de forte impacto para publicar na página ou grupo de Facebook do MozInformativo:
                              </p>

                              <div className="bg-white dark:bg-stone-950 p-2.5 rounded border border-gray-250 dark:border-stone-800 text-[10px] space-y-1.5">
                                <div className="font-mono text-stone-850 dark:text-stone-300 max-h-32 overflow-y-auto select-all whitespace-pre-wrap leading-relaxed py-1 px-1.5 bg-stone-50 dark:bg-stone-950 rounded border border-stone-200 dark:border-stone-850">
                                  {`🔥 DESTAQUE MOZINFORMATIVO: ${postTitle || "Título da Notícia..."} 🇲🇿\n\n${postSubtitle || "Caso inédito choca e surpreende leitores em Moçambique. Leia a cobertura completa no nosso site!"}\n\n👉 Acompanhe de forma fiel o jornalismo destemido em:\n${window.location.origin}${window.location.pathname}?postId=${editingPost ? editingPost.id : "novo"}\n\n#MozInformativo #Moçambique #Zimpeto #Desporto #InformacaoReal`}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const text = `🔥 DESTAQUE MOZINFORMATIVO: ${postTitle || "Título da Notícia..."} 🇲🇿\n\n${postSubtitle || "Caso inédito choca e surpreende leitores em Moçambique. Leia a cobertura completa no nosso site!"}\n\n👉 Acompanhe de forma fiel o jornalismo destemido em:\n${window.location.origin}${window.location.pathname}?postId=${editingPost ? editingPost.id : "novo"}\n\n#MozInformativo #Moçambique #Zimpeto #Desporto #InformacaoReal`;
                                  navigator.clipboard.writeText(text);
                                  alert("✓ Texto de divulgação copiado com sucesso! Abra o Facebook para colar e publicar.");
                                  window.open("https://facebook.com", "_blank");
                                }}
                                className="w-full py-1.5 bg-[#1877f2] hover:bg-[#145dbf] hover:scale-[1.02] text-white text-[9px] uppercase font-black tracking-wide rounded shadow-sm transition-all flex items-center justify-center gap-1"
                              >
                                📋 Copiar Sumário & Abrir Facebook
                              </button>
                            </div>

                            <div>
                              <label className="block text-xs font-black uppercase text-gray-700 mb-1">Autor / Responsável</label>
                              <input
                                type="text"
                                value={postAuthor}
                                onChange={(e) => setPostAuthor(e.target.value)}
                                className="w-full border border-gray-200 p-2 rounded text-xs bg-white"
                              />
                            </div>

                            {/* Flags */}
                            <div className="pt-2 space-y-2">
                              <label className="flex items-center space-x-2 text-xs font-bold text-stone-800 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={postIsViral}
                                  onChange={(e) => setPostIsViral(e.target.checked)}
                                  className="rounded border-gray-300 h-4 w-4 bg-white"
                                />
                                <span>⚡ Marcar como Conteúdo VIRAL</span>
                              </label>

                              <label className="flex items-center space-x-2 text-xs font-bold text-stone-800 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={postIsBreaking}
                                  onChange={(e) => setPostIsBreaking(e.target.checked)}
                                  className="rounded border-gray-300 h-4 w-4 bg-white"
                                />
                                <span>🚨 Marcar como ÚLTIMA HORA</span>
                              </label>
                            </div>

                            {/* ⚽ SPORTS INTEGRATED CHRONIC MODULE */}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                              <label className="flex items-center space-x-2 text-xs font-black uppercase text-rose-600 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={includeSportMatch}
                                  onChange={(e) => setIncludeSportMatch(e.target.checked)}
                                  className="rounded border-gray-300 h-4 w-4 bg-white"
                                />
                                <span>⚽ Incluir Placar e Estatísticas de Jogo</span>
                              </label>

                              {includeSportMatch && (
                                <div className="mt-3 space-y-2 bg-stone-100 p-3 rounded border border-gray-300">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold block">Equipa Casa</label>
                                      <input
                                        type="text"
                                        placeholder="Mambas"
                                        value={sportHome}
                                        onChange={(e) => setSportHome(e.target.value)}
                                        className="w-full border border-gray-300 p-1 rounded text-xs bg-white text-stone-950 font-semibold"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold block">Equipa Fora</label>
                                      <input
                                        type="text"
                                        placeholder="Senegal"
                                        value={sportAway}
                                        onChange={(e) => setSportAway(e.target.value)}
                                        className="w-full border border-gray-300 p-1 rounded text-xs bg-white text-stone-950 font-semibold"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] font-bold block">Golos Casa</label>
                                      <input
                                        type="number"
                                        value={sportHomeScore}
                                        onChange={(e) => setSportHomeScore(Number(e.target.value))}
                                        className="w-full border border-gray-300 p-1 rounded text-xs bg-white text-stone-950"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-bold block">Golos Fora</label>
                                      <input
                                        type="number"
                                        value={sportAwayScore}
                                        onChange={(e) => setSportAwayScore(Number(e.target.value))}
                                        className="w-full border border-gray-300 p-1 rounded text-xs bg-white text-stone-950"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[9px] font-bold block">Melhor Jogador em Campo (Destaque)</label>
                                    <input
                                      type="text"
                                      placeholder="Ex: Geny Catamo"
                                      value={sportPlayerHighlight}
                                      onChange={(e) => setSportPlayerHighlight(e.target.value)}
                                      className="w-full border border-gray-300 p-1 rounded text-xs bg-white"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                          </div>
                        </div>

                        {/* Submit Actions Button */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={clearPostForm}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-xs font-bold uppercase rounded-lg"
                          >
                            Voltar
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-md cursor-pointer"
                          >
                            {editingPost ? "Guardar Alterações" : "Publicar Notícia Agora 🚀"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* SUBTAB 3: CATEGORIES MANAGER */}
                {adminTab === "categorias" && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      <h2 className="text-lg font-display font-extrabold uppercase">Gerir Categorias & Etiquetas</h2>
                      <p className="text-xs text-gray-500">Adicione novas áreas temáticas no portal de forma escalável</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left: categories form and list */}
                      <div className="space-y-4">
                        <form onSubmit={handleAddCategory} className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Adicionar Nova Categoria..."
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            className="flex-1 border border-gray-200 p-2 rounded text-xs bg-white"
                            required
                          />
                          <button 
                            type="submit"
                            className="bg-gray-950 text-white font-bold p-2 px-4 rounded text-xs hover:bg-rose-600 transition-colors uppercase tracking-tight"
                          >
                            Adicionar
                          </button>
                        </form>

                        <div className="border border-gray-200 rounded overflow-hidden">
                          <div className="bg-stone-100 p-2 px-3 text-[10px] font-black uppercase text-gray-500">Categorias Ativas</div>
                          <div className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                              <div key={cat} className="p-3 px-4 flex items-center justify-between text-xs font-semibold text-gray-800">
                                <span>{cat}</span>
                                <button
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="text-[10px] font-bold text-red-600 hover:underline"
                                >
                                  Remover
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: baseline labels for tags view */}
                      <div className="space-y-4 bg-stone-50 p-4 rounded-lg border border-stone-200">
                        <h4 className="text-xs font-black uppercase tracking-wider border-b border-gray-200 pb-1.5 mb-2">
                          Tags Recomendadas SEO
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="bg-white border border-gray-200 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase"
                            >
                              # {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed mt-4">
                          Essas tags guiam os robôs de pesquisa do Google para priorizar o Portal nas pesquisas locais de Moçambique, Cabo Delgado, Maputo e desporto local.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 4: USER CONTROL / STAFF LIST */}
                {adminTab === "users" && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      <h2 className="text-lg font-display font-extrabold uppercase">Utilizadores e Permissões Staff</h2>
                      <p className="text-xs text-gray-500">Defina perfis para administradores de publicidade, editores e jornalistas</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left form inputs */}
                      <div className="col-span-1 bg-stone-50 p-4 rounded-lg border border-stone-200 h-fit space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider border-b border-gray-200 pb-1.5">Conceder Novo Acesso</h4>
                        <form onSubmit={handleCreateUser} className="space-y-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nome Completo</label>
                            <input
                              type="text"
                              required
                              placeholder="Nome do Editor"
                              value={newUserName}
                              onChange={(e) => setNewUserName(e.target.value)}
                              className="w-full border border-gray-200 p-2 rounded text-xs bg-white text-stone-950"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Endereço de Email</label>
                            <input
                              type="email"
                              required
                              placeholder="email@portal.co.mz"
                              value={newUserEmail}
                              onChange={(e) => setNewUserEmail(e.target.value)}
                              className="w-full border border-gray-200 p-2 rounded text-xs bg-white text-stone-950"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Função / Cargo</label>
                            <select
                              value={newUserRole}
                              onChange={(e) => setNewUserRole(e.target.value as any)}
                              className="w-full border border-gray-200 p-2 rounded text-xs bg-white text-stone-900"
                            >
                              <option value="editor">Editor de Artigos</option>
                              <option value="admin">Administrador Geral</option>
                              <option value="leitor">Leitor Vip</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gray-950 hover:bg-rose-600 text-white font-bold p-2 rounded text-xs uppercase"
                          >
                            Emitir Conta
                          </button>
                        </form>
                      </div>

                      {/* Right spreadsheet lists */}
                      <div className="col-span-1 lg:col-span-2 space-y-4">
                        <div className="border border-gray-200 rounded overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-stone-100 uppercase tracking-wider text-[10px] font-black text-gray-500 border-b border-gray-200">
                              <tr>
                                <th className="p-3">Utilizador</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Cargo</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3 text-right">Acção</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {adminUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                                  <td className="p-3 font-semibold text-gray-950">{user.name}</td>
                                  <td className="p-3 text-stone-600 font-mono">{user.email}</td>
                                  <td className="p-3">
                                    <span className="uppercase text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                      {user.role}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className={`text-[10px] font-bold ${user.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                                      {user.status === 'active' ? '● Ativo' : '● Bloqueado'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <button
                                      onClick={() => handleUserStatusToggle(user.id, user.status)}
                                      className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                                        user.status === 'active' 
                                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                                      }`}
                                    >
                                      {user.status === 'active' ? 'Bloquear' : 'Ativar'}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* SUBTAB 5: ADSENSE CODES AND BANNERS */}
                {adminTab === "ads" && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      <h2 className="text-lg font-display font-extrabold uppercase flex items-center space-x-2">
                        <Flame className="w-5 h-5 text-amber-500" />
                        <span>Gestão de Monetização AdSense & Banners</span>
                      </h2>
                      <p className="text-xs text-gray-500">Submeta scripts javascript de anunciantes nas posições estratégicas</p>
                    </div>

                    <div className="space-y-6">
                      
                      {/* Pos 1 */}
                      <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-gray-900">1. Posição Superior de Topo (Ad Banner)</span>
                          <span className="bg-green-600 text-white rounded px-2 py-0.5 text-[9px] font-bold">Ativo no Header</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Exibido na cabeceira, acima do menu principal de notícias.</p>
                        <textarea
                          rows={3}
                          className="w-full border border-stone-300 p-2.5 rounded text-xs font-mono bg-white text-stone-900"
                          value={adCodeTopo}
                          onChange={(e) => setAdCodeTopo(e.target.value)}
                        />
                        <button
                          onClick={() => handleSaveAds("topo", adCodeTopo)}
                          className="px-4 py-1.5 bg-gray-950 hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded cursor-pointer"
                        >
                          Guardar Código de Topo
                        </button>
                      </div>

                      {/* Pos 2 */}
                      <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-gray-900">2. Posição Central (Meio dos Artigos)</span>
                          <span className="bg-green-600 text-white rounded px-2 py-0.5 text-[9px] font-bold">Ativo</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Inserido após os parágrafos iniciais na página interna de notícias do portal.</p>
                        <textarea
                          rows={3}
                          className="w-full border border-stone-300 p-2.5 rounded text-xs font-mono bg-white text-stone-900"
                          value={adCodeMeio}
                          onChange={(e) => setAdCodeMeio(e.target.value)}
                        />
                        <button
                          onClick={() => handleSaveAds("meio", adCodeMeio)}
                          className="px-4 py-1.5 bg-gray-950 hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded cursor-pointer"
                        >
                          Guardar Código do Meio
                        </button>
                      </div>

                      {/* Pos 3 */}
                      <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-gray-900">3. Posição do Rodapé (Footer Banner)</span>
                          <span className="bg-green-600 text-white rounded px-2 py-0.5 text-[9px] font-bold">Ativo</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Exibido na base inferior, ao lado das declarações de copyright.</p>
                        <textarea
                          rows={3}
                          className="w-full border border-stone-300 p-2.5 rounded text-xs font-mono bg-white text-stone-900"
                          value={adCodeRodape}
                          onChange={(e) => setAdCodeRodape(e.target.value)}
                        />
                        <button
                          onClick={() => handleSaveAds("rodape", adCodeRodape)}
                          className="px-4 py-1.5 bg-gray-950 hover:bg-rose-600 text-white text-[10px] font-bold uppercase rounded cursor-pointer"
                        >
                          Guardar Código de Rodapé
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* SUBTAB 6: MESSAGES RECEIVED INBOX */}
                {adminTab === "mensagens" && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      <h2 className="text-lg font-display font-extrabold uppercase">Caixa de Entrada / Parcerias Recebidas</h2>
                      <p className="text-xs text-gray-500">Contactos e solicitações de anunciantes locais em Moçambique</p>
                    </div>

                    <div className="space-y-4">
                      {adminMessages.length === 0 ? (
                        <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded border border-gray-200">
                          Nenhuma mensagem recebida até o momento.
                        </div>
                      ) : (
                        adminMessages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className="p-5 bg-stone-50 rounded-xl border border-gray-200 space-y-3 shadow-sm hover:border-rose-300 transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded text-white ${
                                  msg.type === 'publicidade' ? 'bg-amber-600' : 'bg-rose-600'
                                }`}>
                                  {msg.type === 'publicidade' ? '💰 Proposta Anúncio' : '✉️ Contacto Geral'}
                                </span>
                                <h3 className="text-sm font-extrabold text-[#111]">{msg.subject}</h3>
                                <p className="text-xs text-gray-500">
                                  Por: <strong className="text-gray-950">{msg.name}</strong> ({msg.email})
                                </p>
                              </div>

                              <span className="text-[10px] text-gray-400 font-mono">
                                {new Date(msg.date).toLocaleDateString("pt-MZ")}
                              </span>
                            </div>

                            <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded border border-gray-100 italic">
                              "{msg.message}"
                            </p>

                            <div className="flex justify-end space-x-2">
                              <a
                                href={`mailto:${msg.email}?subject=RE: ${msg.subject}`}
                                className="px-3 py-1 bg-gray-950 text-white font-bold text-[10px] uppercase rounded-md hover:bg-rose-600 transition-colors"
                              >
                                Responder por Email
                              </a>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="px-3 py-1 bg-red-50 text-red-600 font-bold text-[10px] uppercase rounded-md hover:bg-red-100 transition-colors"
                              >
                                Apagar
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* SUBTAB 7: SEO GLOBAL PROFILE */}
                {adminTab === "config" && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      <h2 className="text-lg font-display font-extrabold uppercase">Configurações Gerais de SEO e Metas</h2>
                      <p className="text-xs text-gray-500">Atualize metadados dinâmicos e indexadores globais de busca</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nome do Portal</label>
                          <input
                            type="text"
                            value={siteConfig.name}
                            onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                            className="w-full border border-gray-200 p-2.5 rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Meta Descrição Primária SEO</label>
                          <textarea
                            rows={3}
                            value={siteConfig.description}
                            onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                            className="w-full border border-gray-200 p-2.5 rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contacto WhatsApp Direto (Link)</label>
                          <input
                            type="text"
                            value={siteConfig.whatsappLink}
                            onChange={(e) => setSiteConfig({ ...siteConfig, whatsappLink: e.target.value })}
                            className="w-full border border-gray-200 p-2.5 rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link de Perfil / Página de Facebook</label>
                          <input
                            type="text"
                            value={siteConfig.facebook}
                            onChange={(e) => setSiteConfig({ ...siteConfig, facebook: e.target.value })}
                            className="w-full border border-gray-200 p-2.5 rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Telefone Principal</label>
                          <input
                            type="text"
                            value={siteConfig.phone}
                            onChange={(e) => setSiteConfig({ ...siteConfig, phone: e.target.value })}
                            className="w-full border border-gray-200 p-2.5 rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Endereço de Localização</label>
                          <input
                            type="text"
                            value={siteConfig.address}
                            onChange={(e) => setSiteConfig({ ...siteConfig, address: e.target.value })}
                            className="w-full border border-gray-200 p-2.5 rounded text-sm bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 bg-stone-50 p-5 rounded-lg border border-stone-200">
                        <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">Estado da Segurança do Servidor</h4>
                        <div className="space-y-3 mt-4 text-xs">
                          <div className="flex justify-between border-b border-stone-200 pb-2">
                            <span>Backup Diário Automático:</span>
                            <span className="text-green-600 font-bold">✓ Configurado</span>
                          </div>
                          <div className="flex justify-between border-b border-stone-200 pb-2">
                            <span>Proteção Antiaquecimento SQL:</span>
                            <span className="text-green-600 font-bold">✓ Ativo</span>
                          </div>
                          <div className="flex justify-between border-b border-stone-200 pb-2">
                            <span>Criptografia de Sessão SSL:</span>
                            <span className="text-green-600 font-bold">✓ Ativo (HTTPS)</span>
                          </div>
                        </div>

                        {/* 💾 PAINEL DE BACKUP - EXPORTAR & IMPORTAR CONFIGURAÇÕES */}
                        <div className="mt-6 pt-4 border-t border-stone-300/60 space-y-3">
                          <h4 className="text-xs font-black uppercase text-gray-900 dark:text-stone-900 tracking-wider flex items-center gap-1.5">
                            💾 Exportar & Importar Dados
                          </h4>
                          <p className="text-[10px] text-stone-600 leading-normal">
                            Exporte os seus artigos, anúncios e categorias configuradas em ficheiro JSON para salvaguardar o progresso ou migrar de servidor.
                          </p>
                          
                          <div className="flex flex-col gap-2 pt-1">
                            {/* Export Trigger Link */}
                            <a
                              href="/api/backup/export"
                              download="mozinformativo-backup.json"
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase rounded transition-colors text-center"
                            >
                              📥 Exportar Base Dados (JSON)
                            </a>

                            {/* Import Button Wrapper */}
                            <div className="relative">
                              <label className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase rounded cursor-pointer transition-colors text-center">
                                📤 Restaurar Backup (JSON)
                                <input
                                  type="file"
                                  accept=".json"
                                  onChange={handleBackupImport}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          {/* Dynamic status during import */}
                          {importStatus.type && (
                            <div className={`p-2 rounded text-[10px] leading-snug border mt-2 ${
                              importStatus.type === "loading" ? "bg-amber-50 border-amber-200 text-amber-800 animate-pulse" :
                              importStatus.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                              "bg-red-50 border-red-200 text-red-800"
                            }`}>
                              <span className="font-bold uppercase tracking-wide block">
                                {importStatus.type === "loading" && "⏳ A processar..."}
                                {importStatus.type === "success" && "🚀 Concluído!"}
                                {importStatus.type === "error" && "⚠️ Erro no ficheiro"}
                              </span>
                              {importStatus.message}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => { alert("Configurações do Portal guardadas permanentemente!"); setIsAdminOpen(false); }}
                          className="w-full mt-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase rounded-lg shadow"
                        >
                          Guardar Tudo e Sair
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        ) : activePage ? (
          
          /* VIEW 2: INSTITUTIONAL & POLICY LEGAL PAGES */
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-4xl mx-auto space-y-6 animate-fade-in text-stone-900">
            <button
              onClick={() => setActivePage(null)}
              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold text-xs uppercase rounded flex items-center space-x-1.5 cursor-pointer text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Início do Site</span>
            </button>

            {/* Render dynamic markup page content manually */}
            {activePage === "sobre-nos" && (
              <div className="space-y-4">
                <h1 className="text-3xl font-display font-black text-gray-950 uppercase border-b-4 border-rose-600 pb-2">
                  Sobre Nós — Portal MOZINFORMATIVO
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed font-serif text-lg">
                  O <b>MOZINFORMATIVO</b> é a mais proeminente plataforma de jornalismo digital independente de Moçambique, comprometida em divulgar as notícias de maior valor social, com primor técnico e apelo humano fidedigno.
                </p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Fundando no polo estudantil de engenharia em Maputo por Délio Braz, nossa ambição é preencher uma lacuna no ecossistema de internet ao fornecer conteúdo jornalístico rápido, empático, intrigante e de alta partilha em redes como o WhatsApp e Facebook, garantindo fidelidade de dados factuais de modo ético e transparente.
                </p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Tratamos de matérias cruciais como a cobertura de desportivos em grande destaque, lendas folclóricas locais, arqueologia e curiosidades científicas que desafiam o intelecto habitual dos leitores.
                </p>
              </div>
            )}

            {activePage === "termos-de-uso" && (
              <div className="space-y-4 text-xs">
                <h1 className="text-3xl font-display font-black text-gray-950 uppercase border-b-4 border-rose-600 pb-2">
                  Termos de Uso do Portal
                </h1>
                <p className="leading-relaxed">
                  1. <b>Aceitação de Termos:</b> Ao aceder e desfrutar dos artigos do MOZINFORMATIVO, declara consentimento com as regras descritas.
                </p>
                <p className="leading-relaxed">
                  2. <b>Direitos Autorais:</b> Todo o conteúdo, imagens, logos e textos produzidos sob a chancela da redação são propriedades exclusivas, protegidas pela legislação comercial de propriedade intelectual de Moçambique. É estritamente proibida a cópia sem menção explícita de hiperlink de referência de destino.
                </p>
                <p className="leading-relaxed">
                  3. <b>Comentários na plataforma:</b> Desaprovamos totalmente termos que incitem xenofobia, racismo, difamação pessoal ou de instituições civis e estatais. Reservamos o direito de excluir imediatamente perfis agressores.
                </p>
              </div>
            )}

            {activePage === "politica-de-privacidade" && (
              <div className="space-y-4 text-xs">
                <h1 className="text-3xl font-display font-black text-gray-950 uppercase border-b-4 border-rose-600 pb-2">
                  Política de Privacidade
                </h1>
                <p className="leading-relaxed">
                  Valorizamos a segurança dos leitores. Esta política detalha de forma sincera quais tipos de dados amealhamos e o que fazemos deles.
                </p>
                <p className="leading-relaxed">
                  <b>Logs de Acesso e Endereço IP:</b> Nós podemos coligir informações de navegação básicas (região geográfica aproximada, navegador, tempo de leitura nas notícias) estritamente para ajustar nossa oferta editorial aos interesses da maioria.
                </p>
                <p className="leading-relaxed">
                  <b>Formulários de Contacto:</b> Os emails coletados no submeter de propostas publicitárias ou na caixa de newsletter não são partilhados com terceiros e destinam-se única e exclusivamente para a finalidade à qual nos contactou.
                </p>
              </div>
            )}

            {activePage === "politica-de-cookies" && (
              <div className="space-y-4 text-xs">
                <h1 className="text-3xl font-display font-black text-gray-950 uppercase border-b-4 border-rose-600 pb-2">
                  Política de Cookies
                </h1>
                <p className="leading-relaxed">
                  Utilizamos cookies elementares para melhorar sua experiência de navegação rápida e salvar preferências de exibição de anúncios AdSense personalizados.
                </p>
                <p className="leading-relaxed">
                  <b>Como pode desativar:</b> O leitor mantém autonomia em desligar a captação de cookies nas preferências pessoais do browser web (Google Chrome, Firefox, Safari ou Edge). Isto porém pode desajustar algumas funcionalidades.
                </p>
              </div>
            )}

            {activePage === "termos-e-condicoes" && (
              <div className="space-y-4 text-xs">
                <h1 className="text-3xl font-display font-black text-gray-950 uppercase border-b-4 border-rose-600 pb-2">
                  Termos e Condições Comerciais
                </h1>
                <p className="leading-relaxed">
                  Estes termos regem contratos de marketing executados por anunciantes no MOZINFORMATIVO.
                </p>
                <p className="leading-relaxed">
                  <b>Anúncios Patrocinados:</b> Artigos de divulgação mercadológica pagos trarão explicitamente no cabeçalho a etiqueta 'Publicidade' ou 'Patrocinado', preservando integridade com o nosso público-alvo principal.
                </p>
              </div>
            )}

          </div>
        ) : selectedPost ? (
          
          /* VIEW 3: SINGLE ARTICLE EXPANDED DETAILED VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Left/Center Column: Article Core Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Back button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 hover:text-rose-600 text-xs font-black uppercase rounded flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Fluxo Noticioso</span>
              </button>

              <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                
                {/* Visual Accent Category Badge & Breaking Flag */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded">
                    {selectedPost.category}
                  </span>
                  {selectedPost.isBreaking && (
                    <span className="bg-amber-500 text-gray-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded">
                      ÚLTIMA HORA
                    </span>
                  )}
                  {selectedPost.isViral && (
                    <span className="bg-[#111] text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center space-x-0.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>VIRAL ⚡</span>
                    </span>
                  )}
                </div>

                {/* Main Heading Styled in gorgeous Editorial Georgia Serif font */}
                <h1 className="font-serif text-2xl sm:text-4.5xl leading-tight font-black text-stone-950 tracking-tight">
                  {selectedPost.title}
                </h1>

                {/* Subtitle */}
                {selectedPost.subtitle && (
                  <p className="text-stone-500 font-sans text-sm sm:text-base border-l-4 border-stone-200 pl-4 py-1 italic">
                    {selectedPost.subtitle}
                  </p>
                )}

                {/* Author Metadata Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-t border-b border-gray-100 text-xs text-gray-500 gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-stone-900 text-white flex items-center justify-center rounded-full font-black text-[10px]">
                      {selectedPost.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-gray-950 block">{selectedPost.author}</span>
                      <span className="text-[10px]">Redação MOZINFORMATIVO</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 font-mono text-[10px]">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(selectedPost.date).toLocaleDateString("pt-MZ")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{selectedPost.views} leituras</span>
                    </div>
                  </div>
                </div>

                {/* Large responsive featured thumbnail image representation */}
                <div className={`w-full rounded-lg overflow-hidden relative shadow bg-stone-100 dark:bg-stone-900 transition-all ${
                  selectedPost.imageAspectRatio === "16:9" ? "aspect-video" :
                  selectedPost.imageAspectRatio === "4:3" ? "aspect-[4/3]" :
                  selectedPost.imageAspectRatio === "1:1" ? "aspect-square max-h-[480px]" :
                  selectedPost.imageAspectRatio === "9:16" ? "aspect-[9/16] max-h-[550px] mx-auto" :
                  "aspect-video"
                }`}>
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.imageAltSeo || selectedPost.title}
                    title={selectedPost.imageAltSeo || selectedPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* ⚽ SPECIAL EMBEDDED SPORTS PLACARD VISUALIZER IN-TEXT (IF DESPORTO) */}
                {selectedPost.matchInfo && (
                  <div className="bg-stone-950 text-white p-5 sm:p-6 rounded-xl border border-stone-800 space-y-4 shadow-lg">
                    
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-stone-850 pb-3">
                      <div className="flex items-center space-x-1.5 text-rose-500">
                        <Trophy className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-wider">Módulo de Futebol de Moçambique</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest bg-stone-900 px-2 py-1 rounded">
                        Encerrado
                      </span>
                    </div>

                    {/* Confrontation Board */}
                    <div className="flex items-center justify-between py-4 px-2">
                      <div className="text-center w-5/12">
                        <span className="block text-sm sm:text-base font-black uppercase">{selectedPost.matchInfo.homeTeam}</span>
                        <p className="text-[10px] text-zinc-400">Anfitrião</p>
                      </div>
                      
                      <div className="text-center bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl shrink-0">
                        <span className="font-mono text-xl sm:text-3xl font-black text-amber-500 tracking-wider">
                          {selectedPost.matchInfo.homeScore} - {selectedPost.matchInfo.awayScore}
                        </span>
                      </div>

                      <div className="text-center w-5/12">
                        <span className="block text-sm sm:text-base font-black uppercase">{selectedPost.matchInfo.awayTeam}</span>
                        <p className="text-[10px] text-zinc-400">Desafiante</p>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="space-y-3 pt-3 border-t border-stone-850 text-xs text-zinc-300 font-mono">
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>Posse de Bola ({selectedPost.matchInfo.stats.possessionHome}%)</span>
                          <span>Posse de Bola ({selectedPost.matchInfo.stats.possessionAway}%)</span>
                        </div>
                        <div className="w-full bg-stone-900 h-1.5 rounded overflow-hidden flex">
                          <div className="bg-rose-500 h-full" style={{ width: `${selectedPost.matchInfo.stats.possessionHome}%` }} />
                          <div className="bg-zinc-600 h-full flex-grow" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-stone-900 p-2 px-3 rounded text-[11px]">
                        <span>Chutos Enquadrados</span>
                        <span className="font-bold text-white">
                          {selectedPost.matchInfo.stats.shotsHome} vs {selectedPost.matchInfo.stats.shotsAway}
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-stone-900 p-2 px-3 rounded text-[11px]">
                        <span>Faltas Cometidas</span>
                        <span className="font-bold text-white">
                          {selectedPost.matchInfo.stats.foulsHome} vs {selectedPost.matchInfo.stats.foulsAway}
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-stone-900 p-2 px-3 rounded text-[11px] font-sans">
                        <span className="font-bold text-amber-400">Estrela do Jogo, Homem de Ouro:</span>
                        <span className="font-extrabold uppercase text-white bg-amber-500 text-stone-950 px-2 py-0.5 rounded text-[10px]">
                          ⭐ {selectedPost.matchInfo.outstandingPlayer}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-500 text-center uppercase font-bold">
                      🏟️ {selectedPost.matchInfo.stadium}
                    </p>
                  </div>
                )}

                {/* ADVERTISING INTERCEPT (MEIO) */}
                {ads.find(a => a.position === "meio") ? (
                  <div dangerouslySetInnerHTML={{ __html: ads.find(a => a.position === "meio")?.code || "" }} />
                ) : (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded border border-amber-200 text-center text-xs font-semibold uppercase">
                    📢 Publicidade Central AdSense - Ligue (+258) 87 707 3263 para aderir
                  </div>
                )}

                {/* Core content rich paragraphs representation */}
                <div 
                  className="font-serif text-sm sm:text-base text-stone-950 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />

                {/* Tag pills and Social sharing */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Share trigger items with a dropdown menu option */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto relative">
                    <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Partilhar Notícia:</span>
                    
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                        className="inline-flex items-center justify-between gap-2 p-1.5 px-4 bg-rose-600 hover:bg-rose-700 hover:scale-105 active:scale-95 text-white rounded text-xs font-bold transition-all shadow-md cursor-pointer"
                        title="Abrir opções de partilha"
                      >
                        <span>🔵 Partilhar Notícia</span>
                        <svg className={`w-3 h-3 fill-current transform transition-transform duration-200 ${shareDropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </button>

                      {shareDropdownOpen && (
                        <>
                          {/* Invisible overlay background to close the dropdown */}
                          <div 
                            className="fixed inset-0 z-40 cursor-default" 
                            onClick={() => setShareDropdownOpen(false)} 
                          />
                          
                          {/* Dropdown Menu List */}
                          <div className="absolute right-0 sm:left-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-52 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl p-2 space-y-1 z-50 animate-fade-in origin-bottom sm:origin-top">
                            <span className="block px-2.0 py-1.0 text-[9px] uppercase font-black text-gray-400 tracking-widest border-b border-stone-100 dark:border-stone-800 mb-1">
                              Selecionar Rede
                            </span>

                            {/* Facebook */}
                            <a
                              href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + window.location.pathname + "?postId=" + selectedPost.id)}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setShareDropdownOpen(false)}
                              className="flex items-center justify-between p-2 hover:bg-[#1877f2]/10 dark:hover:bg-[#1877f2]/20 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100 transition-colors"
                            >
                              <span className="flex items-center gap-1.5">🔵 Facebook</span>
                              <span className="text-[8px] uppercase tracking-wider text-[#1877f2] font-black">Share</span>
                            </a>

                            {/* Twitter / X */}
                            <a
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.origin + window.location.pathname + "?postId=" + selectedPost.id)}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setShareDropdownOpen(false)}
                              className="flex items-center justify-between p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100 transition-colors"
                            >
                              <span className="flex items-center gap-1.5">⚫ Twitter / X</span>
                              <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Post</span>
                            </a>

                            {/* Telegram */}
                            <a
                              href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + window.location.pathname + "?postId=" + selectedPost.id)}&text=${encodeURIComponent(selectedPost.title)}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setShareDropdownOpen(false)}
                              className="flex items-center justify-between p-2 hover:bg-[#0088cc]/10 dark:hover:bg-[#0088cc]/20 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100 transition-colors"
                            >
                              <span className="flex items-center gap-1.5">🔷 Telegram</span>
                              <span className="text-[8px] uppercase tracking-wider text-[#0088cc] font-black">Enviar</span>
                            </a>

                            {/* Copy direct link with visual indicator */}
                            <button
                              type="button"
                              onClick={() => {
                                const shareUrl = window.location.origin + window.location.pathname + "?postId=" + selectedPost.id;
                                navigator.clipboard.writeText(shareUrl);
                                setLinkCopied(true);
                                setShareDropdownOpen(false);
                                setTimeout(() => setLinkCopied(false), 3000);
                              }}
                              className="w-full flex items-center justify-between p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100 transition-colors text-left"
                            >
                              <span className="flex items-center gap-1.5">📋 Copiar Link</span>
                              <span className={`text-[8px] uppercase font-black px-1 rounded ${linkCopied ? "bg-emerald-600 text-white animate-pulse" : "text-emerald-600"}`}>
                                {linkCopied ? "✓ OK" : "Copiar"}
                              </span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </article>

              {/* COMMENTS FORM & MODERATION INTERACTIVE SYSTEM */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                <h3 className="text-base font-display font-extrabold uppercase border-b-2 border-[#111] pb-2 text-stone-950">
                  Comentários dos Leitores ({commentList.filter((c) => c.postId === selectedPost.id).length})
                </h3>

                {/* Submitting form */}
                <form onSubmit={handleAddComment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Seu Nome / Apelido (*)</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: João Silva"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full border border-gray-200 p-2 rounded text-xs bg-white text-stone-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Escreva a sua Opinião (*)</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Mantenha o bom tom e os bons costumes locais..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white text-stone-950"
                    />
                  </div>

                  {commentSuccess && (
                    <div className="p-2.5 bg-green-50 text-green-700 text-xs rounded border border-green-200">
                      ✓ Comentário publicado de imediato! Obrigado por participar nos debates do Portal de Notícias.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2 bg-gray-950 hover:bg-rose-600 text-white font-bold text-xs uppercase rounded cursor-pointer transition-colors"
                  >
                    Publicar Comentário
                  </button>
                </form>

                {/* Existing comments */}
                <div className="pt-4 divide-y divide-gray-100 space-y-4">
                  {commentList.filter((c) => c.postId === selectedPost.id).length === 0 ? (
                    <p className="text-xs text-gray-400 font-mono">Seja o primeiro a expressar a sua opinião sincera sobre esta notícia!</p>
                  ) : (
                    commentList
                      .filter((c) => c.postId === selectedPost.id)
                      .map((com) => (
                        <div key={com.id} className="pt-4 first:pt-0">
                          <div className="flex justify-between items-start text-xs mb-1">
                            <strong className="text-gray-950 text-xs">{com.userName}</strong>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {new Date(com.date).toLocaleDateString("pt-MZ")}
                            </span>
                          </div>
                          <p className="text-xs text-stone-700 font-sans leading-relaxed">{com.commentText}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* READ ALSO / RELATED CONTENT SECTION */}
              <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 space-y-4">
                <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider flex items-center space-x-1">
                  <span>Recomendados para Si: "Leia Também"</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {posts
                    .filter((p) => p.id !== selectedPost.id && p.category === selectedPost.category)
                    .slice(0, 2)
                    .map((post) => (
                      <div 
                        key={post.id}
                        onClick={() => handlePostClick(post)}
                        className="bg-white p-3 rounded-lg border border-gray-100 cursor-pointer hover:border-rose-500 transition-all shadow-sm space-y-2"
                      >
                        <div className="w-full h-24 bg-stone-100 rounded overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.imageAltSeo || post.title}
                            title={post.imageAltSeo || post.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h5 className="font-serif font-black text-xs line-clamp-2 text-[#111] hover:text-rose-600">
                          {post.title}
                        </h5>
                      </div>
                    ))}
                </div>
              </div>

            </div>

            {/* Right Column Details Side bar */}
            <div className="space-y-6">
              
              {/* Hot virals widget */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 font-serif">
                <h3 className="text-xs font-black uppercase text-stone-950 border-b border-[#111] pb-1.5 font-sans">
                  🚨 Outros Segredos Virais
                </h3>
                
                <div className="divide-y divide-gray-100 space-y-3.5">
                  {viralPosts.slice(0, 4).map((p, idx) => (
                    <div 
                      key={p.id}
                      onClick={() => handlePostClick(p)}
                      className="pt-3.5 first:pt-0 cursor-pointer group flex space-x-3.5"
                    >
                      <span className="font-sans font-black text-rose-600 text-[18px] opacity-30">0{idx+1}</span>
                      <div className="space-y-1">
                        <span className="text-[10px] font-sans font-extrabold uppercase text-gray-400">{p.category}</span>
                        <h4 className="font-black text-xs leading-tight text-stone-900 group-hover:text-rose-600">
                          {p.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar AdSense placeholder */}
              <div className="bg-stone-50 border border-stone-200 p-4 rounded text-center text-xs">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-2">Anunciante Local</span>
                <span className="text-lg font-black text-stone-950 block">MAMBA BET</span>
                <p className="text-[11px] text-gray-500 mt-1">Multiplique seus sentimentos desportivos em tempo real.</p>
                <div className="bg-[#111] text-xs font-bold text-white py-2 rounded mt-3 cursor-pointer">Visitar Patrocinador Oficial</div>
              </div>

            </div>

          </div>

        ) : (
          
          /* VIEW 4: HOME PORTAL MAIN FEED (CHRONOLOGICAL + COLUMNS) */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in text-stone-950">
            
            {/* LEFT SIDEBAR: LATEST CHROMATIC & VIRAL CHRONICLES */}
            <aside className="lg:col-span-1 space-y-6 lg:border-r lg:border-gray-200 lg:pr-6">
              
              <div className="border-b-2 border-gray-900 pb-1.5">
                <span className="bg-rose-600 text-white font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded">
                  Em Directo
                </span>
                <h3 className="font-display font-extrabold text-sm uppercase tracking-tight mt-1 text-[#111]">
                  ⌚ Atualizações Rápidas
                </h3>
              </div>

              {/* Loop latest chronological */}
              <div className="space-y-4">
                {posts.slice(0, 4).map((post) => (
                  <article 
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="cursor-pointer group space-y-1 border-b border-gray-100 pb-3"
                  >
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                      <span>{post.category}</span>
                      <span>{new Date(post.date).toLocaleTimeString("pt-MZ", { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h4 className="font-serif font-black text-xs leading-snug text-gray-900 group-hover:text-rose-600">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {post.subtitle || post.content.replace(/<[^>]*>/g, '').slice(0, 60)}...
                    </p>
                  </article>
                ))}
              </div>

              {/* CTA Whatsapp e Newsletter */}
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 rounded-xl space-y-4 shadow border border-indigo-950">
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider">Comunidade Viral Whatsapp</span>
                </div>
                <p className="text-xs text-indigo-200 leading-relaxed font-sans">
                  Faça parte do nosso canal oficial no WhatsApp e receba os alertas mais quentes e segredos chocantes do desporto em primeira mão!
                </p>
                <a
                  href={siteConfig.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase rounded shadow-md transition-colors"
                >
                  🚀 Aderir ao Grupo Grátis
                </a>
              </div>

            </aside>

            {/* CENTRAL CANV AS: GRID NEWS, HEROES & ARTICLES FLOW */}
            <section className="lg:col-span-2 space-y-8">
              
              {/* HERO STORY: HIGHEST CLICK-THROUGH / IMPACT NOTICIA */}
              {filteredPosts.length > 0 && !selectedCategory && (
                <article 
                  onClick={() => handlePostClick(filteredPosts[0])}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all space-y-4"
                >
                  {/* Large Hero Graphic representation */}
                  <div className="w-full h-80 bg-stone-100 relative overflow-hidden">
                    <img
                      src={filteredPosts[0].image}
                      alt={filteredPosts[0].imageAltSeo || filteredPosts[0].title}
                      title={filteredPosts[0].imageAltSeo || filteredPosts[0].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 flex gap-1.5">
                      <span className="bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                        {filteredPosts[0].category}
                      </span>
                      {filteredPosts[0].isBreaking && (
                        <span className="bg-amber-500 text-gray-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                          ÚLTIMA HORA
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h1 className="font-serif text-[24px] sm:text-[32px] font-black text-stone-950 leading-tight leading-none tracking-tight">
                      {filteredPosts[0].title}
                    </h1>
                    <p className="text-stone-500 font-sans text-xs sm:text-sm">
                      {filteredPosts[0].subtitle || "Descubra todos os pormenores cruciais da história mais falada nas últimas horas em todo o território nacional."}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                      <span>Redação: <strong>{filteredPosts[0].author}</strong></span>
                      <span className="font-bold text-rose-600 flex items-center space-x-0.5">
                        <span>Ler Artigo Completo</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              )}

              {/* INTERMEDIATE BANNERS ZONE */}
              {ads.find(a => a.position === "meio") ? (
                <div dangerouslySetInnerHTML={{ __html: ads.find(a => a.position === "meio")?.code || "" }} />
              ) : (
                <div className="p-4 bg-indigo-50 border border-indigo-150 p-4 rounded text-center text-xs text-indigo-900 font-bold uppercase tracking-wider">
                  ⚠️ PATROCINADOR CENTRAL - ANUNCIE SEU NEGÓCIO NO PORTAL DE NOTÍCIAS ⚠️
                </div>
              )}

              {/* GRID FEED: THREE MAIN CARDS */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#111] border-b-2 border-gray-950 pb-1.5 flex items-center space-x-1">
                  <span>🎯 {selectedCategory ? `Conteúdos para: ${selectedCategory}` : "Notícias do Momento"}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(selectedCategory ? filteredPosts : filteredPosts.slice(1)).map((post) => (
                    <article
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="bg-white rounded-lg border border-gray-100 hover:border-rose-500 transition-all cursor-pointer overflow-hidden shadow-sm flex flex-col"
                    >
                      <div className="w-full h-44 bg-stone-100 overflow-hidden relative">
                        <img
                          src={post.image}
                          alt={post.imageAltSeo || post.title}
                          title={post.imageAltSeo || post.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-[#111] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                      </div>
                      
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(post.date).toLocaleDateString("pt-MZ")}
                          </span>
                          <h4 className="font-serif font-black text-sm text-[#111] leading-snug line-clamp-3">
                            {post.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-50">
                          <span>{post.views} Views</span>
                          <span className="font-bold text-rose-600 flex items-center space-x-0.5">
                            <span>Aceder</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

            </section>

            {/* RIGHT SIDEBAR: HOT TRENDINGS, SOCCER HIGHLIGHTS, ADVERTISING */}
            <aside className="lg:col-span-1 space-y-6 lg:border-l lg:border-gray-200 lg:pl-6">
              
              {/* SOCCER BOARD (MAMBAS EM CAMPO) */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4.5 space-y-4">
                <div className="border-b border-gray-300 pb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-rose-600">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-tight">Desporto Moçambique</span>
                  </div>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Zimpeto 🏟️</span>
                </div>

                {/* Game cards */}
                <div className="space-y-3.5">
                  <div className="space-y-1 bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-xs">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono uppercase mb-1">
                      <span>Qualificação CAN 2026</span>
                      <span className="text-green-600 font-bold">Encerrado</span>
                    </div>

                    <div className="flex justify-between items-center font-bold text-[#111] text-xs">
                      <span>🇲🇿 Moçambique</span>
                      <span className="bg-stone-900 text-white font-mono rounded px-2 py-0.5">2</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-[#111] text-xs mt-1">
                      <span>🇸🇳 Senegal</span>
                      <span className="bg-stone-900 text-white font-mono rounded px-2 py-0.5">1</span>
                    </div>

                    <div className="text-[10px] text-zinc-500 mt-2 font-mono">
                      ⭐ Homem do Jogo: <strong className="text-stone-950 font-bold">Geny Catamo</strong>
                    </div>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-xs">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono uppercase mb-1">
                      <span>Moçambola 2026</span>
                      <span className="text-rose-600 font-bold animate-pulse">Hoje 15:00</span>
                    </div>

                    <div className="flex justify-between items-center font-bold text-[#111] text-xs">
                      <span>⚽ Black Bulls</span>
                      <span className="bg-stone-100 text-stone-500 font-mono rounded px-2 py-0.5 text-[10px]">vs</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-[#111] text-xs mt-1">
                      <span>⚽ Costa do Sol</span>
                      <span className="bg-stone-100 text-stone-500 font-mono rounded px-2 py-0.5 text-[10px]">vs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MOST READ CHRONICLES / POPULARES */}
              <div className="space-y-4">
                <div className="border-b-2 border-gray-950 pb-1.5 flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h3 className="font-display font-extrabold text-sm uppercase tracking-tight text-[#111]">
                    Mais Lidas do Mês
                  </h3>
                </div>

                <ul className="divide-y divide-gray-100 space-y-3">
                  {mostRead.map((p, index) => (
                    <li 
                      key={p.id}
                      onClick={() => handlePostClick(p)}
                      className="pt-3 first:pt-0 cursor-pointer group flex items-start space-x-2.5"
                    >
                      <span className="font-sans font-black text-rose-600 text-[18px] opacity-40 shrink-0">
                        0{index + 1}
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-mono text-gray-400 font-bold">{p.category}</span>
                        <h4 className="font-black text-xs leading-snug text-gray-900 group-hover:text-rose-600 font-serif">
                          {p.title}
                        </h4>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CAPTURE FORM (CONECTIVIDADE DO PORTAL) */}
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-xl space-y-4 text-xs font-sans">
                <h4 className="font-extrabold uppercase text-gray-900 tracking-wider">
                  Boletim de Notícias VIP ✉️
                </h4>
                <p className="text-gray-500 leading-relaxed font-sans text-[11px]">
                  Subscreva agora o nosso boletim para receber factos misteriosos e curiosidades que ninguém te conta direto no teu correio eletrónico semanalmente!
                </p>

                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="teu-email@gmail.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded bg-white text-stone-950"
                  />
                  {newsletterSuccess && (
                    <div className="p-2.5 bg-green-50 text-green-700 text-[11px] rounded border border-green-200 font-bold">
                      ✓ Confirmado! Obrigado por subscrever.
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#111] text-white hover:bg-rose-600 font-bold uppercase rounded text-[10px]"
                  >
                    Ativar Subscrição Gratuita
                  </button>
                </form>
              </div>

            </aside>

          </div>
        )}

        {/* INTEGRATION VIEW: DIRECT CHATTER CONTACT BOARD */}
        <div id="anuncie" className="border-t border-gray-200 mt-20 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white max-w-4xl mx-auto rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10 animate-fade-in">
            
            {/* Col info */}
            <div className="space-y-6">
              <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
                Media Kit de Anúncios 2026
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-950 uppercase leading-none">
                Anuncie no Portal de Maior Engajamento de Moçambique!
              </h2>

              <p className="text-xs text-stone-500 leading-relaxed">
                Nossa audiência de alta retenção no WhatsApp, Facebook e Google AdSense garante visibilidade imediata para suas campanhas e infoprodutos. Dispomos de banners rotativos, publieditoriais e chamadas exclusivas em newsletters de finais de semana.
              </p>

              <div className="space-y-4 pt-4 text-xs">
                <div className="flex items-center space-x-3 text-stone-900">
                  <Phone className="w-5 h-5 text-rose-600" />
                  <span><strong>WhatsApp Directo:</strong> (+258) 87 707 3263 🇲🇿</span>
                </div>
                <div className="flex items-center space-x-3 text-stone-900">
                  <Mail className="w-5 h-5 text-rose-600" />
                  <span><strong>E-mail de Comercialização:</strong> publicidade@mozinformativo.co.mz</span>
                </div>
              </div>
            </div>

            {/* Col Form */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider border-b border-gray-100 pb-2 text-stone-950">
                Fale Connosco / Solicitar Divulgação
              </h4>
              
              <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Délio Braz"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full border border-gray-200 p-2 rounded bg-white text-stone-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Seu E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="email@empresa.co.mz"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full border border-gray-200 p-2 rounded bg-white text-stone-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Tipo de Solicitação</label>
                  <select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value as any)}
                    className="w-full border border-gray-200 p-2 rounded bg-white text-stone-900"
                  >
                    <option value="publicidade">Quero Anunciar (Promoções e Banners)</option>
                    <option value="contacto">Contatar a Redação (Pauta e Sugestões)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Mensagem ou Proposta (*)</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Escreva detalhes da sua campanha..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded bg-white text-stone-950"
                  />
                </div>

                {messageSuccess && (
                  <div className="p-2.5 bg-green-50 text-green-700 font-bold rounded border border-green-200">
                    ✓ Proposta submetida com sucesso! Nossa equipa comercial entrará em contacto em menos de 2 horas.
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  Enviar Solicitação Comercial
                </button>
              </form>
            </div>

          </div>
        </div>

      </main>

      {/* FLOAT WHATSAPP BUTTON REMOVED AS REQUESTED TO CLEAR READER NUMBER/LINK OPTIONS */}

      {/* Ad top of footer */}
      <div className="max-w-7xl mx-auto px-4 w-full mb-4">
        {ads.find(a => a.position === "rodape") ? (
          <div dangerouslySetInnerHTML={{ __html: ads.find(a => a.position === "rodape")?.code || "" }} />
        ) : (
          <div className="p-3 bg-stone-900 border border-stone-850 px-4 py-3 rounded-lg text-gray-300 text-xs">
            © Portal Oficial AdSense - Todos os espaços estão otimizados de acordo com as regras de anúncio do Google.
          </div>
        )}
      </div>

      {/* FOOTER */}
      <Footer 
        facebookLink={siteConfig.facebook}
        whatsappLink={siteConfig.whatsappLink}
        phone={siteConfig.phone}
        email={siteConfig.email}
        address={siteConfig.address}
        onSelectPage={(page) => {
          setActivePage(page);
          setSelectedPost(null);
          setSelectedCategory(null);
          setIsAdminOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenAdvertise={() => {
          const el = document.getElementById("anuncie");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenContact={() => {
          const el = document.getElementById("anuncie");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
