import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useBranding } from '@/contexts/BrandingContext';

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [25, 61, 50]; // fallback to default dark green
};

export interface JourneyData {
  type: 'aposentadoria' | 'casa-propria' | 'renda-extra';
  formData: any;
  results: any;
  cycles?: any[];
}

export const usePDFGenerator = () => {
  const { branding: contextBranding } = useBranding();
  
  const generatePDF = async (journeyData: JourneyData, brandingData?: any) => {
    const branding = brandingData || contextBranding;
    
    console.log('📄 Iniciando geração do PDF...', journeyData);
    console.log('🎨 Branding atual:', {
      companyName: branding.companyName,
      pdfLogoUrl: branding.pdfLogoUrl,
      logoUrl: branding.logoUrl,
      pdfBackgroundColor: branding.pdfBackgroundColor,
      pdfAccentColor: branding.pdfAccentColor,
      isFromParameter: !!brandingData
    });
    
    try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // CAPA NOVA
    createCoverPage(pdf, journeyData.type, branding);
    
    // Nova página para Método
    pdf.addPage();
    addPageHeader(pdf, `MÉTODO DA ${branding.companyName.toUpperCase()}`, branding);
    renderMethodCards(pdf, branding);
    
    // Nova página para Ciclos se existirem
    if (journeyData.cycles && journeyData.cycles.length > 0) {
      pdf.addPage();
      addPageHeader(pdf, 'CICLOS DE INVESTIMENTO', branding);
      renderCycles(pdf, journeyData.cycles, journeyData.type, branding);
    }
    
    // Nova página para Formas de Contemplar
    pdf.addPage();
    addPageHeader(pdf, 'MANEIRAS DE CONTEMPLAR', branding);
    renderContemplationMethods(pdf, branding);
    
    // Nova página para Compromissos
    pdf.addPage();
    addPageHeader(pdf, 'COMPROMISSOS PARA DAR CERTO', branding);
    renderCommitments(pdf, branding);
    
    // Add footer to all pages
    addFooter(pdf, branding);
    
    // Salvar PDF
    const currentDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
    const fileName = `Relatorio-${branding.companyName.replace(/\s+/g, '-')}-${journeyData.type}-${currentDate.replace(/\//g, '-')}.pdf`;
    console.log('Salvando PDF:', fileName);
    pdf.save(fileName);
    console.log('PDF salvo com sucesso!');
    
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  };
  
  return { generatePDF };
};

// Helper functions for styling
const createCoverPage = (pdf: jsPDF, journeyType: string, branding: any) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Fundo personalizado completo
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  pdf.setFillColor(bgR, bgG, bgB);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Tagline no topo
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  const tagline = "Sua jornada rumo à liberdade financeira pode começar agora";
  const taglineWidth = pdf.getTextWidth(tagline);
  pdf.text(tagline, (pageWidth - taglineWidth) / 2, 40);
  
  // Logo grande centralizada com proporção adequada
  const logoWidth = 60;
  const logoHeight = 60;
  const logoX = (pageWidth - logoWidth) / 2;
  const logoY = (pageHeight - logoHeight) / 2 - 30;
  
  try {
    // Usar a logo configurada para PDF ou fallback para logo principal, depois logo padrão
    const pdfLogoSrc = branding.pdfLogoUrl || branding.logoUrl || '/lovable-uploads/logo-partner-gold.png';
    console.log('📄 PDF Cover - Using logo:', pdfLogoSrc);
    pdf.addImage(pdfLogoSrc, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.error('❌ Erro ao carregar logo da capa:', error);
    // Fallback: apenas texto sem fundo
    pdf.setFontSize(32);
    const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
    pdf.setTextColor(acR, acG, acB);
    const logoText = "R";
    const logoTextWidth = pdf.getTextWidth(logoText);
    pdf.text(logoText, (pageWidth - logoTextWidth) / 2, pageHeight / 2 - 15);
  }
  
  // Rodapé da capa
  const footerY = pageHeight - 30;
  
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  const cnpjText = `CNPJ: ${branding.contractCnpj} • ${branding.contractWebsite}`;
  const cnpjWidth = pdf.getTextWidth(cnpjText);
  pdf.text(cnpjText, (pageWidth - cnpjWidth) / 2, footerY);
};

const addSectionHeader = (pdf: jsPDF, title: string, yPosition: number) => {
  // Sophisticated section header with shadow effect
  pdf.setFillColor(240, 240, 240); // Light shadow
  pdf.rect(1, yPosition - 4, pdf.internal.pageSize.getWidth() - 2, 16, 'F');
  
  // Main background bar with gradient feel
  pdf.setFillColor(25, 61, 50); // Dark green primary
  pdf.rect(0, yPosition - 5, pdf.internal.pageSize.getWidth(), 15, 'F');
  
  // Gold accent line
  pdf.setFillColor(183, 141, 74);
  pdf.rect(0, yPosition + 8, pdf.internal.pageSize.getWidth(), 2, 'F');
  
  // Title with premium styling
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text(title, 20, yPosition + 5);
  
  // Add decorative icon-like element
  pdf.setFillColor(183, 141, 74);
  pdf.circle(pdf.internal.pageSize.getWidth() - 25, yPosition + 2.5, 3, 'F');
};

const addPageHeader = (pdf: jsPDF, title: string, branding: any) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Header com fundo personalizado
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  pdf.setFillColor(bgR, bgG, bgB);
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  // Accent personalizado
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  pdf.setFillColor(acR, acG, acB);
  pdf.rect(0, 40, pageWidth, 5, 'F');
  
  // Logo pequena no header - proporção correta e alinhada com texto
  const logoWidth = 10;
  const logoHeight = 10;
  const logoX = 20;
  
  // Título principal - configurar primeiro para calcular alinhamento
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  const titleHeight = pdf.getTextDimensions(title).h;
  const titleY = 25;
  const logoY = titleY - (titleHeight / 2) - (logoHeight / 2);
  
  try {
    // Usar a logo configurada para PDF ou fallback para logo principal, depois logo padrão
    const pdfLogoSrc = branding.pdfLogoUrl || branding.logoUrl || '/lovable-uploads/logo-partner-gold.png';
    console.log('📄 PDF Header - Using logo:', pdfLogoSrc);
    pdf.addImage(pdfLogoSrc, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.error('❌ Erro ao carregar logo do header:', error);
    // Fallback: texto "R" alinhado
    pdf.setFontSize(12);
    pdf.setTextColor(acR, acG, acB);
    pdf.text('R', logoX + 3, titleY);
  }
  
  // Título principal alinhado verticalmente com a logo
  pdf.text(title, logoX + logoWidth + 12, titleY);
};

const addFooter = (pdf: jsPDF, branding: any) => {
  const pageCount = pdf.internal.pages.length - 1;
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Pular rodapé na primeira página (capa)
    if (i === 1) continue;
    
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Fundo do rodapé
    pdf.setFillColor(248, 248, 248);
    pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    // Linha personalizada superior
    pdf.setDrawColor(acR, acG, acB);
    pdf.setLineWidth(0.5);
    pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    // Informações da empresa
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${branding.companyName} - ${branding.companyTagline}`, 20, pageHeight - 12);
    pdf.text(`CNPJ: ${branding.contractCnpj} • ${branding.contractWebsite}`, 20, pageHeight - 7);
    
    // Número da página
    pdf.setTextColor(bgR, bgG, bgB);
    pdf.text(`Página ${i-1} de ${pageCount-1}`, pageWidth - 40, pageHeight - 7);
  }
};

const renderDataCard = (pdf: jsPDF, data: [string, string][], yPosition: number, branding: any): number => {
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  
  // Premium card styling with elegant borders
  pdf.setFillColor(252, 252, 252); // Very light background
  pdf.rect(15, yPosition, pdf.internal.pageSize.getWidth() - 30, data.length * 12 + 15, 'F');
  
  // Elegant border with shadow effect
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.rect(16, yPosition + 1, pdf.internal.pageSize.getWidth() - 32, data.length * 12 + 13, 'S');
  
  pdf.setDrawColor(acR, acG, acB);
  pdf.setLineWidth(1);
  pdf.rect(15, yPosition, pdf.internal.pageSize.getWidth() - 30, data.length * 12 + 15, 'S');
  
  // Accent personalizado at top
  pdf.setFillColor(acR, acG, acB);
  pdf.rect(15, yPosition, pdf.internal.pageSize.getWidth() - 30, 3, 'F');
  
  yPosition += 12;
  
  data.forEach(([label, value], index) => {
    // Label with sophisticated styling
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(label, 25, yPosition);
    
    // Value with emphasis
    pdf.setFontSize(12);
    pdf.setTextColor(bgR, bgG, bgB);
    pdf.text(value, 90, yPosition);
    
    // Subtle separator line
    if (index < data.length - 1) {
      pdf.setDrawColor(240, 240, 240);
      pdf.setLineWidth(0.2);
      pdf.line(25, yPosition + 4, pdf.internal.pageSize.getWidth() - 25, yPosition + 4);
    }
    
    yPosition += 12;
  });
  
  return yPosition + 15;
};

const renderAposentadoriaData = (pdf: jsPDF, formData: any, yPosition: number, branding: any): number => {
  const data: [string, string][] = [
    ['Investimento Mensal:', formData.monthlyInvestment || 'N/A'],
    ['Aposentadoria Desejada:', formData.targetRetirement || 'N/A'],
    ['Idade Atual:', formData.currentAge || 'N/A'],
    ['Idade de Aposentadoria:', formData.retirementAge || 'N/A']
  ];
  
  return renderDataCard(pdf, data, yPosition, branding);
};

const renderCasaPropriaData = (pdf: jsPDF, formData: any, yPosition: number, branding: any): number => {
  const data: [string, string][] = [
    ['Aluguel Atual:', formData.monthlyRent || 'N/A'],
    ['Valor Disponível:', formData.availableSavings || 'N/A'],
    ['Caminho Escolhido:', formData.selectedPath === 'rent-and-credit' ? 'Aluguel + Consórcio' : formData.selectedPath === 'investment-first' ? 'Investimento Primeiro' : 'N/A']
  ];
  
  return renderDataCard(pdf, data, yPosition, branding);
};

const renderRendaExtraData = (pdf: jsPDF, formData: any, yPosition: number, branding: any): number => {
  const data: [string, string][] = [
    ['Investimento Mensal:', formData.monthlyInvestment || 'N/A'],
    ['Entrada Disponível:', formData.downPayment || 'N/A'],
    ['Prazo:', formData.timeframe || 'N/A'],
    ['Declaração IRPF:', formData.irpfDeclaration?.join(', ') || 'N/A']
  ];
  
  return renderDataCard(pdf, data, yPosition, branding);
};

const renderResults = (pdf: jsPDF, results: any, type: string, yPosition: number, branding: any) => {
  let data: [string, string][] = [];
  
  if (type === 'aposentadoria') {
    data = [
      ['Projeção Final:', results.finalProjection || 'N/A'],
      ['Renda Mensal Estimada:', results.monthlyIncome || 'N/A'],
      ['Total Investido:', results.totalInvested || 'N/A']
    ];
  } else if (type === 'casa-propria') {
    data = [
      ['Patrimônio Total:', results.totalPatrimony || 'N/A'],
      ['Renda Mensal de Aluguel:', results.rentalIncome || 'N/A'],
      ['Total Investido:', results.totalInvested || 'N/A']
    ];
  } else if (type === 'renda-extra') {
    data = [
      ['Propriedades Adquiridas:', results.totalProperties || 'N/A'],
      ['Patrimônio Total:', results.totalPatrimony || 'N/A'],
      ['Renda Mensal:', results.monthlyIncome || 'N/A']
    ];
  }
  
  renderDataCard(pdf, data, yPosition, branding);
};

const renderCycles = (pdf: jsPDF, cycles: any[], type: string, branding: any) => {
  let yPosition = 60;
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  cycles.forEach((cycle, index) => {
    if (yPosition > 230) {
      pdf.addPage();
      addPageHeader(pdf, 'CICLOS DE INVESTIMENTO', branding);
      yPosition = 60;
    }
    
    // Cycle header with premium styling
    pdf.setFillColor(bgR, bgG, bgB);
    pdf.rect(15, yPosition - 5, pdf.internal.pageSize.getWidth() - 30, 20, 'F');
    
    pdf.setFillColor(acR, acG, acB);
    pdf.rect(15, yPosition + 12, pdf.internal.pageSize.getWidth() - 30, 3, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`CICLO ${cycle.cycle}`, 25, yPosition + 8);
    
    yPosition += 25;
    
    // Cycle data with elegant presentation
    const cycleData: [string, string][] = [
      ['Patrimônio Acumulado:', cycle.patrimony],
      ['Parcela Mensal:', cycle.installment],
      ['Renda Gerada:', cycle.income],
      ['Lucro Líquido:', cycle.profit]
    ];
    
    yPosition = renderDataCard(pdf, cycleData, yPosition, branding);
    yPosition += 10;
  });
};

const renderEcosystem = (pdf: jsPDF, branding: any) => {
  let yPosition = 70;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  // Introdução do ecossistema
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  const introText = branding.pdfIntroText;
  
  const introLines = pdf.splitTextToSize(introText, 160);
  introLines.forEach((line: string) => {
    pdf.text(line, 25, yPosition);
    yPosition += 6;
  });
  
  yPosition += 10;
  
  // Empresas do Grupo
  const companies = [
    {
      name: 'Referência Partner',
      description: 'Consultoria em investimentos imobiliários'
    },
    {
      name: 'Referência Imob',
      description: 'Corretagem imobiliária especializada'
    },
    {
      name: 'Referência Tech',
      description: 'Tecnologia e inovação'
    },
    {
      name: 'Referência Seguros',
      description: 'Seguros corporativos'
    },
    {
      name: 'Referência Bank',
      description: 'Soluções financeiras integradas'
    }
  ];
  
  companies.forEach((company, index) => {
    // Card da empresa
    pdf.setFillColor(252, 252, 252);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 18, 'F');
    
    pdf.setDrawColor(acR, acG, acB);
    pdf.setLineWidth(0.5);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 18, 'S');
    
    // Accent personalizado
    pdf.setFillColor(acR, acG, acB);
    pdf.rect(25, yPosition - 3, 4, 18, 'F');
    
    // Nome da empresa
    pdf.setFontSize(11);
    pdf.setTextColor(bgR, bgG, bgB);
    pdf.text(company.name, 35, yPosition + 4);
    
    // Descrição
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    pdf.text(company.description, 35, yPosition + 10);
    
    yPosition += 25;
  });
  
  // Texto final
  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  const finalText = `Cada empresa atua de forma integrada para garantir qualidade, potencializar resultados e oferecer soluções completas em cada etapa do seu investimento.`;
  
  const finalLines = pdf.splitTextToSize(finalText, 160);
  finalLines.forEach((line: string) => {
    pdf.text(line, 25, yPosition);
    yPosition += 6;
  });
};

const renderMethodCards = (pdf: jsPDF, branding: any) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  const cardWidth = 35;
  const cardHeight = 60; // Aumentado para acomodar texto maior
  const startX = (pageWidth - (5 * cardWidth + 4 * 5)) / 2;
  let yPosition = 70;
  
  const steps = [
    { title: 'OBTER', subtitle: 'Crédito Inteligente', icon: '1' },
    { title: 'ALUGAR', subtitle: 'Ganhe dinheiro', icon: '2' },
    { title: 'RECEBA OS LUCROS', subtitle: 'Reinvista em outros imóveis', icon: '3' },
    { title: 'COMPRE MAIS IMÓVEIS', subtitle: 'O imóvel se paga sozinho', icon: '4' },
    { title: 'REPITA O PROCESSO', subtitle: 'Aumente os seus Lucros', icon: '5' }
  ];
  
  steps.forEach((step, index) => {
    const cardX = startX + index * (cardWidth + 5);
    
    // Card background com sombra
    pdf.setFillColor(240, 240, 240);
    pdf.rect(cardX + 2, yPosition + 2, cardWidth, cardHeight, 'F');
    
    // Card principal
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.5);
    pdf.rect(cardX, yPosition, cardWidth, cardHeight, 'FD');
    
    // Círculo personalizado para o ícone
    const circleRadius = 8;
    const circleX = cardX + cardWidth/2;
    const circleY = yPosition + 15;
    
    pdf.setFillColor(acR, acG, acB);
    pdf.circle(circleX, circleY, circleRadius, 'F');
    
    // Número dentro do círculo - centralizado precisamente
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    const textDimensions = pdf.getTextDimensions(step.icon);
    const numberX = circleX - (textDimensions.w / 2);
    const numberY = circleY + (textDimensions.h / 2) - 1;
    pdf.text(step.icon, numberX, numberY);
    
    // Título do passo - com quebra de linha se necessário
    pdf.setFontSize(9);
    pdf.setTextColor(bgR, bgG, bgB);
    const titleLines = pdf.splitTextToSize(step.title, cardWidth - 4);
    let titleStartY = yPosition + 30;
    
    titleLines.forEach((line: string, lineIndex: number) => {
      const lineWidth = pdf.getTextWidth(line);
      const lineX = cardX + (cardWidth - lineWidth)/2;
      pdf.text(line, lineX, titleStartY + lineIndex * 4);
    });
    
    // Subtítulo com quebra de linha adequada
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const subtitleLines = pdf.splitTextToSize(step.subtitle, cardWidth - 6);
    let subtitleStartY = titleStartY + (titleLines.length * 4) + 5;
    
    subtitleLines.forEach((line: string, lineIndex: number) => {
      const lineWidth = pdf.getTextWidth(line);
      const lineX = cardX + (cardWidth - lineWidth)/2;
      pdf.text(line, lineX, subtitleStartY + lineIndex * 3.5);
    });
  });
  
  // Descrição abaixo dos cards
  yPosition += cardHeight + 25;
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  const description = `Metodologia comprovada em 5 etapas que transforma crédito em patrimônio através de investimentos imobiliários estratégicos.
  
Cada etapa foi desenhada para maximizar seus resultados e minimizar riscos, garantindo uma jornada segura rumo à independência financeira.`;
  
  const descLines = pdf.splitTextToSize(description, 160);
  descLines.forEach((line: string) => {
    pdf.text(line, 25, yPosition);
    yPosition += 7;
  });
};

const renderContemplationMethods = (pdf: jsPDF, branding: any) => {
  let yPosition = 70;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  const contemplationMethods = [
    { 
      title: 'SORTEIO', 
      description: 'Contemplação através de sorteio mensal realizado pela administradora'
    },
    { 
      title: 'LANCE LIVRE', 
      description: 'Oferta de lance livre em assembleia para contemplação imediata'
    },
    { 
      title: 'LANCE FIXO', 
      description: 'Lance de 30% ou 50% onde definimos a estratégia com base no conhecimento da nossa curadoria'
    }
  ];
  
  contemplationMethods.forEach((method, index) => {
    // Method card
    pdf.setFillColor(252, 252, 252);
    pdf.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
    
    pdf.setDrawColor(acR, acG, acB);
    pdf.setLineWidth(1);
    pdf.rect(20, yPosition - 5, pageWidth - 40, 25, 'S');
    
    // Accent personalizado
    pdf.setFillColor(acR, acG, acB);
    pdf.rect(20, yPosition - 5, 5, 25, 'F');
    
    // Method title
    pdf.setFontSize(12);
    pdf.setTextColor(bgR, bgG, bgB);
    pdf.text(method.title, 35, yPosition + 3);
    
    // Method description
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    const descLines = pdf.splitTextToSize(method.description, 140);
    descLines.forEach((line: string, lineIndex: number) => {
      pdf.text(line, 35, yPosition + 10 + lineIndex * 5);
    });
    
    yPosition += 35;
  });
};

const renderCommitments = (pdf: jsPDF, branding: any) => {
  let yPosition = 70;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  const commitments = [
    'Manter o aporte mensal conforme planejado na simulação',
    'Reinvestir a renda gerada para acelerar os resultados',
    'Manter documentação e prazos sempre em dia',
    'Seguir a disciplina financeira e orientações da consultoria',
    'Participar de revisões periódicas da estratégia de investimento'
  ];
  
  commitments.forEach((commitment, index) => {
    // Item de compromisso com estilo elegante
    pdf.setFillColor(248, 250, 252);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 20, 'F');
    
    pdf.setDrawColor(acR, acG, acB);
    pdf.setLineWidth(0.5);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 20, 'S');
    
    // Círculo numerado - centralização precisa
    const circleRadius = 7;
    const circleX = 35;
    const circleY = yPosition + 7;
    
    pdf.setFillColor(bgR, bgG, bgB);
    pdf.circle(circleX, circleY, circleRadius, 'F');
    
    // Número dentro do círculo - centralizado precisamente
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    const numberText = (index + 1).toString();
    const textDimensions = pdf.getTextDimensions(numberText);
    const numberX = circleX - (textDimensions.w / 2);
    const numberY = circleY + (textDimensions.h / 2) - 0.5;
    pdf.text(numberText, numberX, numberY);
    
    // Texto do compromisso
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    const commitmentLines = pdf.splitTextToSize(commitment, 130);
    commitmentLines.forEach((line: string, lineIndex: number) => {
      pdf.text(line, 50, yPosition + 5 + lineIndex * 6);
    });
    
    yPosition += 28;
  });
  
  // Nota final
  yPosition += 15;
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  const finalNote = `O cumprimento destes compromissos é essencial para o sucesso da estratégia de investimento e para alcançar os resultados projetados na simulação.`;
  const noteLines = pdf.splitTextToSize(finalNote, 160);
  noteLines.forEach((line: string) => {
    pdf.text(line, 25, yPosition);
    yPosition += 6;
  });
};