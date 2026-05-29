import React from "react";
import { Newspaper, Mail, Phone, MapPin, Shield, MessageSquare, ExternalLink } from "lucide-react";

interface FooterProps {
  onSelectPage: (page: string) => void;
  onOpenAdvertise: () => void;
  onOpenContact: () => void;
  facebookLink?: string;
  whatsappLink?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export default function Footer({ 
  onSelectPage, 
  onOpenAdvertise, 
  onOpenContact,
  facebookLink = "https://facebook.com",
  whatsappLink = "https://wa.me/258877073263",
  phone = "+258 87 707 3263",
  email = "contacto@mozinformativo.co.mz",
  address = "Avenida do FPLM, Prédios Maconde, Nampula"
}: FooterProps) {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20 border-t-4 border-rose-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="bg-rose-600 p-2 rounded">
                <Newspaper className="w-5 h-5" />
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight">
                MOZ<span className="text-rose-500">INFORMATIVO</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              O maior portal moçambicano independente focado em notícias de desporto, histórias misteriosas, virais de grande impacto emocional e curiosidades inacreditáveis. Atualizado a cada minuto.
            </p>
            <div className="flex space-x-3 pt-2 text-gray-500">
              <a href={facebookLink} target="_blank" rel="noreferrer" className="hover:text-rose-500 transition-colors">
                <span className="text-xs font-bold">Facebook</span>
              </a>
              <span>•</span>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
                <span className="text-xs font-bold">WhatsApp</span>
              </a>
              <span>•</span>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-rose-500 transition-colors">
                <span className="text-xs font-bold">Twitter</span>
              </a>
            </div>
          </div>

          {/* Col 2: Legal Pages */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-l-2 border-rose-600 pl-2">
              Páginas Legais
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onSelectPage("termos-de-uso")} 
                  className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Termos de Uso</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectPage("politica-de-privacidade")} 
                  className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Política de Privacidade</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectPage("politica-de-cookies")} 
                  className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Política de Cookies</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectPage("termos-e-condicoes")} 
                  className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Termos e Condições</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Navigation */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-l-2 border-rose-600 pl-2">
              Institucional
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onSelectPage("sobre-nos")} 
                  className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sobre Nós</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenContact} 
                  className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                  <span>Contactar Redação</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAdvertise} 
                  className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="font-semibold text-yellow-400">Anuncie Connosco (Media Kit)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Address */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-rose-600 pl-2">
              Contactos Oficiais
            </h3>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{address}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-900 mt-12 pt-6 text-center text-xs text-gray-600 flex flex-col sm:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} MOZ INFORMATIVO. Todos os direitos reservados. É proibida a reprodução de artigos sem devida citação.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[10px]">Otimizado para AdSense & SEO do Google</p>
        </div>
      </div>
    </footer>
  );
}
