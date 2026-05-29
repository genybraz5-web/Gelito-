import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required for viral suggestions.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Interfaces
interface Comment {
  id: string;
  postId: string;
  userName: string;
  commentText: string;
  date: string;
  approved: boolean;
}

interface MatchStats {
  possessionHome: number;
  possessionAway: number;
  shotsHome: number;
  shotsAway: number;
  cornersHome: number;
  cornersAway: number;
  foulsHome: number;
  foulsAway: number;
}

interface SportsMatch {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  stadium: string;
  stats: MatchStats;
  outstandingPlayer: string;
}

interface Post {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  author: string;
  views: number;
  isViral: boolean;
  isBreaking: boolean;
  matchInfo?: SportsMatch;
}

interface Ad {
  position: "topo" | "meio" | "rodape";
  code: string;
  isCode: boolean;
  bannerUrl?: string;
  linkUrl?: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  type: "contacto" | "publicidade";
}

interface Database {
  users: Array<{ id: string; name: string; email: string; role: "admin" | "editor" | "leitor"; status: "active" | "blocked" }>;
  posts: Post[];
  categories: string[];
  tags: string[];
  comments: Comment[];
  ads: Ad[];
  messages: Message[];
}

// Standard helper mock images corresponding to our themes (clean, high-contrast news graphics)
const SAMPLE_IMAGES = {
  misterio: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1200&q=80", // Dark mystical forest
  solarenergy: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80", // Solar panels in Moz
  mambas: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80", // Stadium lights soccer match
  brain: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80", // Abstract brains / AI
  space: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", // Cosmic space planet
  geny: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=1200&q=80" // Soccer kickoff action
};

const defaultDb: Database = {
  users: [
    { id: "u1", name: "Délio Braz", email: "gelitobraz400@gmail.com", role: "admin", status: "active" },
    { id: "u2", name: "Amélia Macuácua", email: "amelia@portal.co.mz", role: "editor", status: "active" },
    { id: "u3", name: "Leitor Comum", email: "leitor@portal.co.mz", role: "leitor", status: "active" }
  ],
  categories: [
    "Notícias",
    "Última Hora",
    "Curiosidades",
    "Histórias Reais",
    "Mistérios",
    "Casos Reais",
    "Mundo",
    "África",
    "Moçambique",
    "Desporto",
    "Futebol",
    "Transferências",
    "Inacreditável",
    "Segredos Revelados"
  ],
  tags: [
    "Moçambique",
    "CAN 2026",
    "Mambas",
    "Ciência",
    "Astronomia",
    "Geny Catamo",
    "Maputo",
    "Premier League",
    "Misterioso",
    "AdSense",
    "Bons Costumes"
  ],
  posts: [
    {
      id: "p1",
      title: "O Mistério da Ilha de Moçambique: O que Revelam os Túneis Escondidos Sob a Fortaleza de São Sebastião?",
      subtitle: "Pesquisadores locais e internacionais descobrem passagens subterrâneas nunca antes mapeadas, alimentando lendas de tesouros ocultos e segredos seculares importantes.",
      content: "A Ilha de Moçambique, na província de Nampula, guarda marcas profundas da história. Recentemente, uma equipa de arqueólogos detetou anomalias no subsolo da icónica Fortaleza de São Sebastião utilizando radar de penetração solar. <br/><br/>As primeiras escavações revelaram uma rede intrincada de galerias subterrâneas que ligam a fortaleza diretamente ao mar. Rezam as lendas locais que estas galerias serviam para evacuações secretas de ouro e especiarias nos tempos coloniais. O historiador moçambicano Dr. João Nhassengo comenta: 'Este achado muda completamente a nossa visão das estratégias de rota de defesa e fuga no século XVI. Há relatos verbais de passagens que cruzam toda a extensão sob as dunas, e agora finalmente temos provas físicas de parte dessas estruturas fantásticas!'.<br/><br/>As autoridades planeiam restringir o acesso inicial para garantir a conservação estrutural, mas o entusiasmo turístico já começou a explodir nas redes sociais. Qual será de facto o segredo escondido?",
      category: "Mistérios",
      tags: ["Moçambique", "Misterioso", "Maputo"],
      image: SAMPLE_IMAGES.misterio,
      date: "2026-05-27T10:00:00Z",
      author: "Amélia Macuácua",
      views: 1450,
      isViral: true,
      isBreaking: true
    },
    {
      id: "p2",
      title: "⚽ HISTÓRICO: Mambas de Moçambique vencem Senegal de virada em Maputo e selam Qualificação de Ouro para o CAN!",
      subtitle: "Num Estádio Nacional do Zimpeto a rebentar pelas costuras, a seleção nacional deu um show tático inacreditável e garantiu a tão ansiada presença na fase de grupos.",
      content: "Uma tarde memorável e de puro patriotismo em Maputo! Os Mambas entraram em campo em desvantagem no início da partida sofrida, mas apoiados por mais de 45.000 moçambicanos frenéticos na bancada, operaram a reviravolta mais inspiradora e fantástica da década contra a poderosa seleção do Senegal.<br/><br/>Senegal abriu o placar aos 14 minutos com uma cabeçada cirúrgica. No entanto, o espírito batalhador moçambicano reergueu-se. Aos 44 minutos, um remate espetacular de fora da área repôs a igualdade histórica. Na segunda parte, aos 81 minutos, a estrela do momento executou um contra-ataque fulminante de classe mundial, fuzilando as redes adversárias e carimbando a passagem dos Mambas para o palco principal africano.<br/><br/>Esta vitória consagra a evolução profissional do futebol moçambicano e preenche as ruas das principais cidades com cânticos de triunfo e união nacional.",
      category: "Desporto",
      tags: ["Moçambique", "CAN 2026", "Mambas", "Futebol"],
      image: SAMPLE_IMAGES.mambas,
      date: "2026-05-27T11:30:00Z",
      author: "Délio Braz",
      views: 3120,
      isViral: true,
      isBreaking: true,
      matchInfo: {
        homeTeam: "Mambas de Moçambique",
        awayTeam: "Senegal",
        homeScore: 2,
        awayScore: 1,
        stadium: "Estádio Nacional do Zimpeto, Maputo",
        stats: {
          possessionHome: 48,
          possessionAway: 52,
          shotsHome: 12,
          shotsAway: 8,
          cornersHome: 5,
          cornersAway: 6,
          foulsHome: 14,
          foulsAway: 18
        },
        outstandingPlayer: "Geny Catamo"
      }
    },
    {
      id: "p3",
      title: "Coisas Que Ninguém Te Contou: O Segredo Biológico Revelado Que Explica Por Que Bocejamos ao Ver Outra Pessoa!",
      subtitle: "Se acha que bocejar é apenas por cansaço ou falta de ar, engane-se. A ciência descobriu um fator de conexão social que vai explodir a sua mente.",
      content: "Todos nós conhecemos aquele momento constrangedor: um colega na sala de reuniões abre a boca e boceja, e segundos depois metade do escritório está a fazer exatamente o mesmo. Mas por que razão isto é tão irresistível e contagioso?<br/><br/>Estudos neurológicos com ressonância magnética demonstraram que o bocejo empático não tem a ver com défice de oxigénio. Em vez disso, é uma resposta gerada pelos chamados 'neurónios espelho'. Estes neurónios desempenham um papel crucial na empatia social e autoconsciência. Eles estimulam geneticamente que nós imitemos as ações físicas dos nossos semelhantes para nos sintonizarmos emocionalmente de forma primitiva com o bando de caçadores antigos.<br/><br/>Mais chocante ainda: quanto maior o grau de afinidade e ligação afetiva sincera que tem com a pessoa que boceja primeiro, mais rápida e forte é a sua resposta cerebral inconsciente! Experimente fazer o teste hoje mesmo com a sua família e amigos.",
      category: "Curiosidades",
      tags: ["Ciência", "Misterioso"],
      image: SAMPLE_IMAGES.brain,
      date: "2026-05-26T18:20:00Z",
      author: "Amélia Macuácua",
      views: 940,
      isViral: true,
      isBreaking: false
    },
    {
      id: "p4",
      title: "Norte de Moçambique Lidera Transição Verde: Nova Central Solar em Cabo Delgado Fornece Energia Contínua a 100 Mil Famílias!",
      subtitle: "O projeto de energia limpa de bilionário investimento entra em operação, iluminando lares que anteriormente dependiam exclusivamente de geradores de combustíveis fósseis inflamáveis.",
      content: "O Governo moçambicano, em parceria com investidores privados internacionais, inaugurou oficialmente o maior parque de infraestrutura solar concentrada no norte do país. A infraestrutura visa mitigar o défice sistemático de eletrificação rural nas províncias do norte.<br/><br/>Equipada com acumuladores industriais de lítio de última geração, a central garante o abastecimento mesmo durante períodos noturnos prolongados ou intempéries severas. O ministro encarregue da pasta de recursos sublinha a importância de descentralizar o grid elétrico nacional: 'Este é um marco crucial para a autonomia económica e social do nosso povo em Cabo Delgado'.<br/><br/>Moradores celebram a chegada duradoura de luz e eletricidade de qualidade, que vai fomentar o pequeno comércio, escolarização e conservação de medicamentos de refrigeração médica.",
      category: "Moçambique",
      tags: ["Moçambique", "Maputo"],
      image: SAMPLE_IMAGES.solarenergy,
      date: "2026-05-25T09:15:00Z",
      author: "Délio Braz",
      views: 1100,
      isViral: false,
      isBreaking: false
    },
    {
      id: "p5",
      title: "URGENTE: Gigantes Europeus Disputam Geny Catamo com Ofertas Astrómicas que Podem Ultrapassar os 45 Milhões de Euros!",
      subtitle: "O astro moçambicano do Sporting de Portugal tornou-se o alvo prioritário de dois dos maiores clubes da elite inglesa para o mercado de transferências de verão.",
      content: "As brilhantes exibições do internacional moçambicano Geny Catamo não passaram despercebidas aos olheiros mais influentes do futebol global. Informações diretas de agentes na Europa reportam que o Arsenal e o Aston Villa estão ativamente a desenhar uma batalha de licitações milionárias pelo promissor extremo para integrá-lo já na próxima época.<br/><br/>Dotado de um arranque elétrico formidável e uma versatilidade tática extraordinária que o permite atuar tanto como ala ofensivo quanto defesa exterior, o atleta converteu-se num elemento fulcral nas táticas ofensivas modernas.<br/><br/>A sua cláusula de rescisão ronda valores astronómicos, mas a força financeira dos clubes ingleses promete um desfecho bombástico com potenciais recordes nacionais históricos para Moçambique no desporto-rei.",
      category: "Transferências",
      tags: ["Geny Catamo", "Futebol", "Premier League", "Desporto"],
      image: SAMPLE_IMAGES.geny,
      date: "2026-05-27T08:00:00Z",
      author: "Délio Braz",
      views: 2280,
      isViral: true,
      isBreaking: false
    },
    {
      id: "p6",
      title: "Descoberta Científica sem Precedentes: Telescópio Espacial Capta Sinal de Rádio vindo de Exoplaneta de Massa Equivalente à Terra",
      subtitle: "Sinal coerente gerado a 12 anos-luz de distância abre o mais intrigante capítulo da exploração cósmica sobre a existência de magnetosferas protetoras e vida inteligente extraterrestre.",
      content: "O universo acaba de sussurrar um mistério estonteante. Astrónomos mundiais detetaram, em frequência eletromagnética contínua, uma assinatura coerente originária de YZ Ceti b, um planeta rochoso de características similares ao nosso mundo.<br/><br/>Os sinais sugerem a presença vital de um campo magnético protetor ativo, elemento absolutamente obrigatório para reter uma atmosfera espessa, oceanos líquidos e impedir a devastação por ventos solares letais. Embora a hipótese de emissão artificial esteja sob enorme ceticismo técnico, esta descoberta consubstancia a primeira evidência forte de mundos habitáveis em sistemas vizinhos próximos, mudando o rumo da astrofísica para sempre.",
      category: "Mundo",
      tags: ["Ciência", "Astronomia"],
      image: SAMPLE_IMAGES.space,
      date: "2026-05-24T14:50:00Z",
      author: "Amélia Macuácua",
      views: 1850,
      isViral: false,
      isBreaking: false
    }
  ],
  comments: [
    {
      id: "c1",
      postId: "p1",
      userName: "Nando de Nampula",
      commentText: "Absolutamente fascinante! Eu sempre ouvi os meus avós falarem sobre estes túneis, mas pensava que eram apenas contos de fadas para adormecer crianças na lareira.",
      date: "2026-05-27T10:30:00Z",
      approved: true
    },
    {
      id: "c2",
      postId: "p2",
      userName: "MambaDeCoração",
      commentText: "Chorei de emoção no Zimpeto! Geny Catamo jogou demais, que orgulho para o nosso Moçambique! Estamos no CAN ⚽🚀🇲🇿",
      date: "2026-05-27T12:00:00Z",
      approved: true
    },
    {
      id: "c3",
      postId: "p2",
      userName: "MestreTatico",
      commentText: "Estivemos brilhantes na recuperação do centro de meio de campo, Senegal subestimou e pagou caro no deserto tático.",
      date: "2026-05-27T12:15:00Z",
      approved: true
    }
  ],
  ads: [
    {
      position: "topo",
      code: "<!-- BANNER DE TOPO PUBLICITÁRIO -->\n<div class='bg-amber-500 py-3 text-center text-xs font-bold text-gray-950 uppercase tracking-widest rounded shadow-md border-b-2 border-amber-600'>🔥 ANÚNCIO: ENERGIA SOLAR PREÇOS DE BANAL - LIGUE JÁ PARA (+258) 84 000 0000 🔥</div>",
      isCode: true,
      bannerUrl: "",
      linkUrl: ""
    },
    {
      position: "meio",
      code: "<!-- BANNER BANDEIRA MEIO PORTAL -->\n<div class='flex flex-col items-center justify-center p-4 bg-indigo-950 text-white rounded border border-indigo-800 my-4 shadow-sm'>\n  <span class='text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-1'>Patrocinador Oficial</span>\n  <span class='text-lg font-black text-amber-400 mb-2'>⚽ APOSTAS DESPORTIVAS PORTALBET ⚽</span>\n  <p class='text-xs text-center text-indigo-200 max-w-md'>Registe-se hoje com o código 'MAMBAS' no nosso portal e ganhe de imediato bónus de 100% no primeiro depósito!</p>\n</div>",
      isCode: true,
      bannerUrl: "",
      linkUrl: ""
    },
    {
      position: "rodape",
      code: "<!-- BANNER RODAPE DE PORTAL -->\n<div class='bg-gray-900 border border-gray-800 px-4 py-3 rounded-lg flex items-center justify-between text-gray-300 text-xs mt-6'>\n  <div>\n    <p class='font-bold text-white'>Quer anunciar a sua empresa neste espaço premium?</p>\n    <p class='text-gray-400'>Mais de 100 mil visitas diárias qualificadas em todo o país.</p>\n  </div>\n  <a href='#anuncie' class='px-3 py-2 bg-rose-600 text-white font-bold rounded-md hover:bg-rose-700 transition-colors uppercase tracking-tight text-[11px]'>Aderir Agora</a>\n</div>",
      isCode: true,
      bannerUrl: "",
      linkUrl: ""
    }
  ],
  messages: [
    {
      id: "m1",
      name: "Chico Construtor",
      email: "chico@construcoes.co.mz",
      subject: "Parceria Comercial e Artigos Patrocinados",
      message: "Olá equipa de vendas do Portal. Gostaria de solicitar o vosso kit de media de divulgação e preços para a publicação periódica de 3 artigos patrocinados sobre soluções habitacionais em Maputo.",
      date: "2026-05-27T09:00:00Z",
      type: "publicidade"
    }
  ]
};

// Database read/write helpers
function loadDatabase(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao ler base de dados db.json, restaurando padrão:", error);
  }
  // Initialize file
  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(db: Database): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao escrever base de dados db.json:", err);
  }
}

// REST API Endpoints

// 1. Posts CRUD
app.get("/api/posts", (req, res) => {
  const db = loadDatabase();
  res.json(db.posts);
});

app.get("/api/posts/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.posts.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Post não encontrado" });
  }
  // Increment view counter locally
  db.posts[index].views += 1;
  saveDatabase(db);
  res.json(db.posts[index]);
});

app.post("/api/posts", (req, res) => {
  const db = loadDatabase();
  const { title, subtitle, content, category, tags, image, author, isViral, isBreaking, matchInfo } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: "Título, conteúdo e categoria são obrigatórios." });
  }

  const newPost: Post = {
    id: `p_${Date.now()}`,
    title,
    subtitle: subtitle || "",
    content,
    category,
    tags: Array.isArray(tags) ? tags : [],
    image: image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
    date: new Date().toISOString(),
    author: author || "Redação",
    views: 0,
    isViral: !isViral ? false : true,
    isBreaking: !isBreaking ? false : true,
    matchInfo: matchInfo || undefined
  };

  db.posts.unshift(newPost);
  saveDatabase(db);
  res.status(201).json(newPost);
});

app.put("/api/posts/:id", (req, res) => {
  const db = loadDatabase();
  const index = db.posts.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Post não encontrado" });
  }

  const { title, subtitle, content, category, tags, image, author, isViral, isBreaking, matchInfo } = req.body;

  db.posts[index] = {
    ...db.posts[index],
    title: title !== undefined ? title : db.posts[index].title,
    subtitle: subtitle !== undefined ? subtitle : db.posts[index].subtitle,
    content: content !== undefined ? content : db.posts[index].content,
    category: category !== undefined ? category : db.posts[index].category,
    tags: Array.isArray(tags) ? tags : db.posts[index].tags,
    image: image !== undefined ? image : db.posts[index].image,
    author: author !== undefined ? author : db.posts[index].author,
    isViral: isViral !== undefined ? isViral : db.posts[index].isViral,
    isBreaking: isBreaking !== undefined ? isBreaking : db.posts[index].isBreaking,
    matchInfo: matchInfo !== undefined ? matchInfo : db.posts[index].matchInfo
  };

  saveDatabase(db);
  res.json(db.posts[index]);
});

app.delete("/api/posts/:id", (req, res) => {
  const db = loadDatabase();
  const filtered = db.posts.filter((p) => p.id !== req.params.id);
  if (db.posts.length === filtered.length) {
    return res.status(404).json({ error: "Post não encontrado" });
  }
  db.posts = filtered;
  saveDatabase(db);
  res.json({ success: true, message: "Artigo excluído com sucesso" });
});

// 2. Comments API
app.get("/api/comments", (req, res) => {
  const db = loadDatabase();
  res.json(db.comments);
});

app.post("/api/posts/:id/comments", (req, res) => {
  const db = loadDatabase();
  const { userName, commentText } = req.body;
  if (!userName || !commentText) {
    return res.status(400).json({ error: "Nome de utilizador e comentário são obrigatórios." });
  }

  const newComment: Comment = {
    id: `c_${Date.now()}`,
    postId: req.params.id,
    userName,
    commentText,
    date: new Date().toISOString(),
    approved: true // Auto-approved on this portal to guarantee excellent interactiveness
  };

  db.comments.push(newComment);
  saveDatabase(db);
  res.status(201).json(newComment);
});

app.delete("/api/comments/:id", (req, res) => {
  const db = loadDatabase();
  db.comments = db.comments.filter((c) => c.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// 3. Categories and Tags
app.get("/api/categories", (req, res) => {
  const db = loadDatabase();
  res.json(db.categories);
});

app.post("/api/categories", (req, res) => {
  const db = loadDatabase();
  const { category } = req.body;
  if (!category) return res.status(400).json({ error: "Categoria em falta" });
  if (!db.categories.includes(category)) {
    db.categories.push(category);
    saveDatabase(db);
  }
  res.json(db.categories);
});

app.delete("/api/categories", (req, res) => {
  const db = loadDatabase();
  const { category } = req.body;
  db.categories = db.categories.filter((cat) => cat !== category);
  saveDatabase(db);
  res.json(db.categories);
});

app.get("/api/tags", (req, res) => {
  const db = loadDatabase();
  res.json(db.tags);
});

// 4. Ads
app.get("/api/ads", (req, res) => {
  const db = loadDatabase();
  res.json(db.ads);
});

app.put("/api/ads", (req, res) => {
  const db = loadDatabase();
  const { position, code, isCode, bannerUrl, linkUrl } = req.body;

  const index = db.ads.findIndex((ad) => ad.position === position);
  if (index !== -1) {
    db.ads[index] = { position, code, isCode, bannerUrl, linkUrl };
  } else {
    db.ads.push({ position, code, isCode, bannerUrl, linkUrl });
  }
  saveDatabase(db);
  res.json(db.ads);
});

// 5. Contact Messages
app.get("/api/messages", (req, res) => {
  const db = loadDatabase();
  res.json(db.messages);
});

app.post("/api/messages", (req, res) => {
  const db = loadDatabase();
  const { name, email, subject, message, type } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Nome, Email e Mensagem são obrigatórios." });
  }

  const newMessage: Message = {
    id: `m_${Date.now()}`,
    name,
    email,
    subject: subject || "Contacto do Site",
    message,
    date: new Date().toISOString(),
    type: type || "contacto"
  };

  db.messages.unshift(newMessage);
  saveDatabase(db);
  res.status(201).json(newMessage);
});

app.delete("/api/messages/:id", (req, res) => {
  const db = loadDatabase();
  db.messages = db.messages.filter((m) => m.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// 6. Users Control
app.get("/api/users", (req, res) => {
  const db = loadDatabase();
  res.json(db.users);
});

app.post("/api/users", (req, res) => {
  const db = loadDatabase();
  const { name, email, role } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Nome e Email obrigatórios" });
  
  const newUser = {
    id: `u_${Date.now()}`,
    name,
    email,
    role: role || "editor",
    status: "active" as const
  };
  db.users.push(newUser);
  saveDatabase(db);
  res.json(newUser);
});

app.put("/api/users/:id/status", (req, res) => {
  const db = loadDatabase();
  const { status } = req.body;
  const index = db.users.findIndex((u) => u.id === req.params.id);
  if (index !== -1) {
    db.users[index].status = status;
    saveDatabase(db);
    return res.json(db.users[index]);
  }
  res.status(404).json({ error: "Utilizador não encontrado" });
});

// 7. Dynamic Stats for administrative dashboard
app.get("/api/stats", (req, res) => {
  const db = loadDatabase();
  const postsCount = db.posts.length;
  const totalViews = db.posts.reduce((sum, p) => sum + p.views, 0);
  const commentsCount = db.comments.length;
  const messagesCount = db.messages.length;

  const viewsByCategory: Record<string, number> = {};
  db.posts.forEach((p) => {
    viewsByCategory[p.category] = (viewsByCategory[p.category] || 0) + p.views;
  });

  const topPosts = [...db.posts].sort((a,b) => b.views - a.views).slice(0, 5).map(p => ({
    title: p.title,
    views: p.views,
    category: p.category
  }));

  res.json({
    postsCount,
    totalViews,
    commentsCount,
    messagesCount,
    viewsByCategory,
    topPosts
  });
});

// 7b. Backup Export and Import API for preserving platform data
app.get("/api/backup/export", (req, res) => {
  const db = loadDatabase();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=mozinformativo-backup.json");
  res.send(JSON.stringify(db, null, 2));
});

app.post("/api/backup/import", (req, res) => {
  try {
    const backup = req.body;
    if (!backup || !backup.posts || !backup.categories) {
      return res.status(400).json({ error: "Ficheiro de backup inválido. Chaves essenciais (posts, categorias) estão em falta." });
    }
    const validatedDb: Database = {
      users: Array.isArray(backup.users) ? backup.users : [],
      posts: Array.isArray(backup.posts) ? backup.posts : [],
      categories: Array.isArray(backup.categories) ? backup.categories : [],
      tags: Array.isArray(backup.tags) ? backup.tags : [],
      comments: Array.isArray(backup.comments) ? backup.comments : [],
      ads: Array.isArray(backup.ads) ? backup.ads : [],
      messages: Array.isArray(backup.messages) ? backup.messages : []
    };
    saveDatabase(validatedDb);
    res.json({ success: true, message: "Base de dados restaurada com sucesso!" });
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao restaurar backup: " + err.message });
  }
});

// 8. AI Gemini Endpoint for Auto-Viral and Shocking Suggestion titles!
app.post("/api/suggest-titles", async (req, res) => {
  const { content, category } = req.body;
  if (!content) {
    return res.status(400).json({ error: "É necessário fornecer um conteúdo base ou tema." });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Como um editor especialista em jornalismo digital, de conteúdos virais e de desporto para o mercado lusófono (especialmente Moçambique), sugere exatamente 5 títulos altamente virais, intrigantes, de forte apelo emocional, otimizados para cliques saudáveis (sem fake news descabidas). O conteúdo base ou tema é: "${content}". Categoria preferencial: "${category || "Viral"}". Retorna a resposta com formatação estritamente JSON contendo um array de strings chamado "titulos" e nada mais, obedecendo a este esquema de exemplo: { "titulos": ["Título 1", "Título 2", ...] }.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    try {
      const parsed = JSON.parse(text.trim());
      res.json(parsed);
    } catch (pe) {
      console.error("Failed to parse JSON reply from Gemini:", text);
      res.json({ titulos: [
        `🚨 INACREDITÁVEL: Descubra os detalhes de: ${content.slice(0, 40)}... Que todos comentam!`,
        `🔥 O Segredo Revelado sobre ${content.slice(0, 45)}... que vai mudar a sua percepção física!`,
        `👁️ Coisas que nunca te contaram sobre ${content.slice(0, 45)}... e o impacto real hoje`,
        `😱 CHOCANTE: A verdade que ninguém queria partilhar sobre ${content.slice(0, 40)}...`,
        `⚽ ÚLTIMA HORA: O assunto do momento que está a fazer tremer as redes sociais!`
      ]});
    }
  } catch (error: any) {
    console.error("Gemini suggestion error:", error);
    // Silent failover with brilliant suggestions pre-generated
    res.json({
      titulos: [
        `🚨 REVELADO: O Mistério de "${content.slice(0, 35)}" que está a incendiar a curiosidade geral!`,
        `💥 Inacreditável e Chocante: A revelação definitiva sobre este tema!`,
        `🧠 Coisas que ninguém te contou sobre o conteúdo e as suas ramificações secretas...`,
        `🇲🇿 Moçambique e o Mundo em Choque com este desfecho fantástico!`,
        `🔥 ATUALIZAÇÃO DE IMPACTO: O que todos precisam saber agora mesmo!`
      ]
    });
  }
});

// Vite server linkage
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK PORTAL] Rodando com sucesso na porta ${PORT}`);
  });
}

startServer();
