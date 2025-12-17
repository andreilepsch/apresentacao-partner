
import OptimizedNewsCard from "./OptimizedNewsCard";

const OptimizedNewsCarousel = () => {
  const newsArticles = [
    {
      title: "Confira os 4 melhores bairros de SP para investir em imóveis para temporada",
      subtitle: "São Paulo se consolida como polo de aluguéis de temporada",
      description: "São Paulo vem se consolidando como um dos principais polos de aluguéis de temporada, por plataformas como Airbnb, no Brasil, impulsionada por sua relevância econômica, efervescência cultural e intensa agenda de eventos. Confira os quatro melhores bairros paulistanos para investir em imóveis voltados ao Airbnb, de acordo com um estudo realizado pela Referência Partner.",
      source: "VEJA SÃO PAULO",
      date: "Janeiro 2025",
      image: "/lovable-uploads/4c30cb8c-1fe0-4050-823a-fea0d36b8e35.png",
      logoClass: "bg-red-600",
      priority: true
    },
    {
      title: "Sob pressão de dívida, empresas mantêm venda de imóvel seguida de locação",
      subtitle: "Demanda de fundos por operações de 'sale and leaseback' pode ser afetada pelo cenário de juros altos",
      description: "É também um método de levantar fundos sem comprometer outras linhas de crédito, já que o acordo não é registrado como dívida pelo Banco Central, de acordo com Pedro Ros, sócio da Referência Partner.",
      source: "VALOR ECONÔMICO",
      date: "Janeiro 2025",
      image: "/lovable-uploads/a9edc556-2aac-4e70-8a08-d2cff0455f0e.png",
      logoClass: "bg-green-700"
    },
    {
      title: "Juros altos podem adiar financiamento do primeiro imóvel; veja dicas",
      subtitle: "Especialistas mostram erros comuns e destacam cuidados ao assumir uma dívida de longo prazo",
      description: "Para ilustrar na prática como cada sistema funciona, Pedro Ros, CEO da Referência Partner, realizou uma simulação com base em um financiamento de R$ 500 mil em 360 meses.",
      source: "FOLHA DE S.PAULO",
      date: "Janeiro 2025",
      image: "/lovable-uploads/3cc5b718-f92e-4ddb-9934-8d3f4256036e.png",
      logoClass: "bg-gray-800"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {newsArticles.map((article, index) => (
          <OptimizedNewsCard
            key={index}
            title={article.title}
            subtitle={article.subtitle}
            description={article.description}
            source={article.source}
            date={article.date}
            image={article.image}
            logoClass={article.logoClass}
            priority={article.priority || false}
          />
        ))}
      </div>
    </div>
  );
};

export default OptimizedNewsCarousel;
