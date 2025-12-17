
import NewsCard from "./NewsCard";

const NewsCarousel = () => {
  const newsArticles = [
    {
      title: "Famosos realizam negócios milionários com imóveis; especialista explica como ampliar portfólio",
      subtitle: "Pedro Ros, CEO da Autoridade Investimentos, fala sobre movimentação no setor imobiliário",
      description: "Em conversa com GLOBO, Pedro Ros, CEO da Autoridade Investimentos, explica que por muito tempo o setor foi visto como uma opção de baixo retorno comparado a outras oportunidades de investimento. Entretanto, a percepção mudou nos últimos anos.",
      source: "O GLOBO",
      date: "Janeiro 2025",
      image: "/lovable-uploads/52dab560-e6af-48ad-bdd3-c87e5e8857be.png",
      logoClass: "bg-blue-600"
    },
    {
      title: "Confira os 4 melhores bairros de SP para investir em imóveis para temporada",
      subtitle: "São Paulo se consolida como polo de aluguéis de temporada",
      description: "São Paulo vem se consolidando como um dos principais polos de aluguéis de temporada, por plataformas como Airbnb, no Brasil, impulsionada por sua relevância econômica, efervescência cultural e intensa agenda de eventos. Confira os quatro melhores bairros paulistanos para investir em imóveis voltados ao Airbnb, de acordo com um estudo realizado pela Autoridade Investimentos.",
      source: "VEJA SÃO PAULO",
      date: "Janeiro 2025",
      image: "/lovable-uploads/4c30cb8c-1fe0-4050-823a-fea0d36b8e35.png",
      logoClass: "bg-red-600"
    },
    {
      title: "Sob pressão de dívida, empresas mantêm venda de imóvel seguida de locação",
      subtitle: "Demanda de fundos por operações de 'sale and leaseback' pode ser afetada pelo cenário de juros altos",
      description: "É também um método de levantar fundos sem comprometer outras linhas de crédito, já que o acordo não é registrado como dívida pelo Banco Central, de acordo com Pedro Ros, sócio da Autoridade Investimentos.",
      source: "VALOR ECONÔMICO",
      date: "Janeiro 2025",
      image: "/lovable-uploads/a9edc556-2aac-4e70-8a08-d2cff0455f0e.png",
      logoClass: "bg-green-700"
    },
    {
      title: "10 Dicas para rentabilizar até 1,4% ao mês no Airbnb",
      subtitle: "Estratégias para maximizar o retorno em aluguel por temporada",
      description: "Portal BM&C News apresenta as principais estratégias para otimizar a rentabilidade de imóveis destinados ao aluguel por temporada, com dicas práticas para investidores que buscam diversificar seus portfolios.",
      source: "BM&C NEWS",
      date: "Janeiro 2025",
      image: "/lovable-uploads/d4d0e065-180b-42f3-8615-90a31c548f09.png",
      logoClass: "bg-blue-700"
    },
    {
      title: "Juros altos podem adiar financiamento do primeiro imóvel; veja dicas",
      subtitle: "Especialistas mostram erros comuns e destacam cuidados ao assumir uma dívida de longo prazo",
      description: "Para ilustrar na prática como cada sistema funciona, Pedro Ros, CEO da Autoridade Investimentos, realizou uma simulação com base em um financiamento de R$ 500 mil em 360 meses.",
      source: "FOLHA DE S.PAULO",
      date: "Janeiro 2025",
      image: "/lovable-uploads/3cc5b718-f92e-4ddb-9934-8d3f4256036e.png",
      logoClass: "bg-gray-800"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {newsArticles.map((article, index) => (
          <NewsCard
            key={index}
            title={article.title}
            subtitle={article.subtitle}
            description={article.description}
            source={article.source}
            date={article.date}
            image={article.image}
            logoClass={article.logoClass}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel;
