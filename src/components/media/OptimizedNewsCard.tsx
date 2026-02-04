
import React from "react";
import OptimizedImage from "@/components/common/OptimizedImage";

interface OptimizedNewsCardProps {
  title: string;
  subtitle: string;
  description: string;
  source: string;
  date: string;
  image: string;
  logoClass?: string;
  headerColor?: string;
  headerTextColor?: string;
  priority?: boolean;
}

const OptimizedNewsCard = ({
  title,
  image,
  source,
  logoClass,
  headerColor,
  headerTextColor,
  priority = false
}: OptimizedNewsCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#DDE3E9] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Nome do jornal acima da imagem */}
      <div
        className={`font-bold text-sm py-3 px-4 ${!headerColor ? (logoClass || 'bg-[#193D32] text-white') : ''}`}
        style={headerColor ? { backgroundColor: headerColor, color: headerTextColor || '#FFFFFF' } : {}}
      >
        {source}
      </div>

      {/* Título da notícia */}
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold text-[#193D32] leading-tight line-clamp-3">
          {title}
        </h3>
      </div>

      {/* Imagem da notícia otimizada */}
      <div className="h-64 w-full bg-gray-50 p-4">
        <OptimizedImage
          src={image}
          alt="Notícia"
          className="w-full h-full rounded-lg"
          priority={priority}
          placeholder="Carregando imagem..."
        />
      </div>
    </div>
  );
};

export default OptimizedNewsCard;
