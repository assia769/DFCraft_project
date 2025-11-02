import { Github, Mail, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 mt-auto overflow-hidden">
      {/* Effet de particules animées bien */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-white rounded-full animate-pulse delay-75"></div>
        <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-white rounded-full animate-pulse"></div>
      </div>

      <div className="relative px-6 py-12">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo avec effet brillant */}
          <div className="relative">
            <div className="absolute inset-0 bg-white blur-xl opacity-50 animate-pulse"></div>
            <div className="relative flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white border-opacity-30 shadow-2xl">
              <img src="/icons/icon-16.png" alt="Logo" className="w-10 h-10" />
              <div className="text-left">
                <p className="font-bold text-white text-xl flex items-center gap-2">
                  DFCraft
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </p>
                <p className="text-sm text-white text-opacity-90">Boostez votre productivité</p>
              </div>
            </div>
          </div>

          {/* Stats avec effet glassmorphism */}
          <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white border-opacity-20 hover:scale-105 transition-transform">
              <p className="text-3xl font-bold text-white">4.8</p>
              <p className="text-xs text-white text-opacity-80">⭐ Note</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white border-opacity-20 hover:scale-105 transition-transform">
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-xs text-white text-opacity-80">👥 Utilisateurs</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white border-opacity-20 hover:scale-105 transition-transform">
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-xs text-white text-opacity-80">🚀 Sessions</p>
            </div>
          </div>

          {/* Liens sociaux avec hover effet */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="bg-white bg-opacity-20 backdrop-blur-lg p-3 rounded-full border border-white border-opacity-30 text-white hover:bg-white hover:text-purple-600 transition-all hover:scale-110"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="bg-white bg-opacity-20 backdrop-blur-lg p-3 rounded-full border border-white border-opacity-30 text-white hover:bg-white hover:text-purple-600 transition-all hover:scale-110"
              title="Contact"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-white text-opacity-90">
            <p className="flex items-center justify-center gap-2">
              © {currentYear} DFCraft • Fait avec 
              <Heart className="w-4 h-4 text-pink-300 fill-pink-300 animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}