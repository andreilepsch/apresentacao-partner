import { useBranding } from "@/contexts/BrandingContext";
import OptimizedNewsCard from "./OptimizedNewsCard";

const OptimizedNewsCarousel = () => {
  const { branding } = useBranding();

  // Use dados do contexto ou array vazio se não houver
  const newsArticles = branding.mediaJson || [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {newsArticles.map((article, index) => (
          <OptimizedNewsCard
            key={article.id || index}
            title={article.title}
            subtitle={""} // Subtítulo não está no modelo atual do JSON, pode ser removido ou mapeado se existir
            description={article.description}
            source={article.outletName}
            date={""} // Data não está no JSON
            image={article.imageUrl || ""}
            headerColor={article.headerColor}
            headerTextColor={article.headerTextColor}
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default OptimizedNewsCarousel;
