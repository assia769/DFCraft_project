import { Github, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-6 py-8">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/icons/icon-16.png" alt="Logo" className="w-8 h-8" />
            <div>
              <p className="font-bold text-gray-900 text-lg">DFCraft</p>
              <p className="text-sm text-gray-500">Boostez votre productivité</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Contact"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <div className="text-sm text-gray-500">
            <p className="flex items-center justify-center gap-2">
              © {currentYear} DFCraft • Fait avec 
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}