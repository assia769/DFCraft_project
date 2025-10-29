import { Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/icons/icon-16.png" alt="Logo" className="w-6 h-6" />
            <div>
              <p className="font-semibold text-gray-800 text-sm">DFCraft</p>
              <p className="text-xs text-gray-500">Boostez votre productivité</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </a>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>© {currentYear} DFCraft</span>
            <span>•</span>
            <span className="flex items-center gap-1">Fait avec <Heart className="w-3 h-3 text-red-500 fill-red-500" /></span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-blue-600">4.8</p>
              <p className="text-xs text-gray-500">Note moyenne</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-600">10K+</p>
              <p className="text-xs text-gray-500">Utilisateurs</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">50K+</p>
              <p className="text-xs text-gray-500">Sessions</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}