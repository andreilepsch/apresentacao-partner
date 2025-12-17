import jsPDF from 'jspdf';
import { useBranding } from '@/contexts/BrandingContext';

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [22, 59, 54]; // fallback to default dark green
};

export interface Meeting2ReportData {
  clientName: string;
  selectedCredit: {
    creditValue: string;
    installment: string;
    estimatedIncome: string;
    patrimony: string;
  };
  administrator: {
    name: string;
    highlights: string[];
    trustIndicators: { number: string; label: string; }[];
  };
  commitments: { 
    title: string; 
    description: string; 
    icon: string;
  }[];
  cycles: any[];
}

export const useMeeting2PDFGenerator = () => {
  const { branding: contextBranding } = useBranding();
  
  const generateMeeting2PDF = async (reportData: Meeting2ReportData, brandingData?: any) => {
    const branding = brandingData || contextBranding;
    
    console.log('📄 Iniciando geração do PDF da Segunda Reunião...', reportData);
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
      
      // 1. CAPA
      createCoverPage(pdf, reportData.clientName, branding);
      
      // 2. Consultoria Referência
      pdf.addPage();
      addPageHeader(pdf, 'CONSULTORIA ' + branding.companyName.toUpperCase(), branding);
      renderConsultoriaReferencia(pdf, branding);
      
      // 3. Administradora
      pdf.addPage();
      addPageHeader(pdf, 'ADMINISTRADORA ESCOLHIDA', branding);
      renderAdministradoraCanopus(pdf, reportData.administrator, branding);
      
      // 4. Crédito Selecionado
      pdf.addPage();
      addPageHeader(pdf, 'CRÉDITO SELECIONADO', branding);
      renderCreditoSelecionado(pdf, reportData.selectedCredit, branding);
      
      // 5. Compromissos
      pdf.addPage();
      addPageHeader(pdf, 'COMPROMISSOS DO CLIENTE', branding);
      renderCompromissosCliente(pdf, reportData.commitments, branding);
      
      // 6. Próximos Passos
      pdf.addPage();
      addPageHeader(pdf, 'PRÓXIMOS PASSOS', branding);
      renderInstrucoesAssinatura(pdf, branding);
      
      addFooter(pdf, branding);
      
      const currentDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
      const clientNameForFile = reportData.clientName.replace(/[^a-zA-Z0-9]/g, '-');
      const fileName = `Relatorio-Segunda-Reuniao-${clientNameForFile}-${currentDate.replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF da Segunda Reunião:', error);
      throw error;
    }
  };
  
  return { generateMeeting2PDF };
};

const createCoverPage = (pdf: jsPDF, clientName: string, branding: any) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  pdf.setFillColor(bgR, bgG, bgB);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  const tagline = "Relatório da Consultoria";
  const taglineWidth = pdf.getTextWidth(tagline);
  pdf.text(tagline, (pageWidth - taglineWidth) / 2, 40);
  
  const logoWidth = 60;
  const logoHeight = 60;
  const logoX = (pageWidth - logoWidth) / 2;
  const logoY = (pageHeight - logoHeight) / 2 - 40;
  
  try {
    // Usar a logo configurada para PDF ou fallback para logo principal, depois logo padrão
    const pdfLogoSrc = branding.pdfLogoUrl || branding.logoUrl || '/lovable-uploads/logo-partner-gold.png';
    console.log('📄 Meeting2 PDF Cover - Using logo:', pdfLogoSrc);
    pdf.addImage(pdfLogoSrc, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.error('❌ Erro ao carregar logo da capa:', error);
    pdf.setFontSize(32);
    pdf.setTextColor(acR, acG, acB);
    const logoText = "R";
    const logoTextWidth = pdf.getTextWidth(logoText);
    pdf.text(logoText, (pageWidth - logoTextWidth) / 2, pageHeight / 2 - 15);
  }
  
  pdf.setFontSize(24);
  pdf.setTextColor(acR, acG, acB);
  const clientText = `${clientName}`;
  const clientWidth = pdf.getTextWidth(clientText);
  pdf.text(clientText, (pageWidth - clientWidth) / 2, pageHeight / 2 + 30);
  
  const footerY = pageHeight - 30;
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  const cnpjText = `CNPJ: ${branding.contractCnpj} • ${branding.contractWebsite}`;
  const cnpjWidth = pdf.getTextWidth(cnpjText);
  pdf.text(cnpjText, (pageWidth - cnpjWidth) / 2, footerY);
};

const addPageHeader = (pdf: jsPDF, title: string, branding: any) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  pdf.setFillColor(bgR, bgG, bgB);
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  pdf.setFillColor(acR, acG, acB);
  pdf.rect(0, 40, pageWidth, 5, 'F');
  
  const logoWidth = 10;
  const logoHeight = 10;
  const logoX = 20;
  
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  const titleHeight = pdf.getTextDimensions(title).h;
  const titleY = 25;
  const logoY = titleY - (titleHeight / 2) - (logoHeight / 2);
  
  try {
    // Usar a logo configurada para PDF ou fallback para logo principal, depois logo padrão
    const pdfLogoSrc = branding.pdfLogoUrl || branding.logoUrl || '/lovable-uploads/logo-partner-gold.png';
    console.log('📄 Meeting2 PDF Header - Using logo:', pdfLogoSrc);
    pdf.addImage(pdfLogoSrc, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.error('❌ Erro ao carregar logo do header:', error);
    pdf.setFontSize(12);
    pdf.setTextColor(acR, acG, acB);
    pdf.text('R', logoX + 3, titleY);
  }
  
  pdf.text(title, logoX + logoWidth + 12, titleY);
};

const addFooter = (pdf: jsPDF, branding: any) => {
  const pageCount = pdf.internal.pages.length - 1;
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    if (i === 1) continue;
    
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    pdf.setFillColor(248, 248, 248);
    pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    pdf.setDrawColor(acR, acG, acB);
    pdf.setLineWidth(0.5);
    pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${branding.companyName} - ${branding.companyTagline}`, 20, pageHeight - 12);
    pdf.text(`CNPJ: ${branding.contractCnpj} • ${branding.contractWebsite}`, 20, pageHeight - 7);
    
    pdf.setTextColor(bgR, bgG, bgB);
    pdf.text(`Página ${i-1} de ${pageCount-1}`, pageWidth - 40, pageHeight - 7);
  }
};

const renderConsultoriaReferencia = (pdf: jsPDF, branding: any) => {
  let yPosition = 70;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  const introText = branding.pdfIntroText;
  
  const introLines = pdf.splitTextToSize(introText, 160);
  introLines.forEach((line: string) => {
    pdf.text(line, 25, yPosition);
    yPosition += 6;
  });
  
  yPosition += 15;
  
  // Diferenciais
  pdf.setFontSize(14);
  pdf.setTextColor(bgR, bgG, bgB);
  pdf.text('Nossos Diferenciais', 25, yPosition);
  yPosition += 10;
  
  const diferenciais = [
    'Consultoria personalizada e acompanhamento completo',
    'Análise detalhada de créditos e administradoras',
    'Estratégias comprovadas de investimento imobiliário',
    'Suporte em todas as etapas do processo'
  ];
  
  diferenciais.forEach((diferencial) => {
    pdf.setFillColor(252, 252, 252);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 12, 'F');
    
    pdf.setDrawColor(acR, acG, acB);
    pdf.setLineWidth(0.5);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 12, 'S');
    
    pdf.setFillColor(acR, acG, acB);
    pdf.rect(25, yPosition - 3, 4, 12, 'F');
    
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    pdf.text(diferencial, 35, yPosition + 4);
    
    yPosition += 17;
  });
};

const renderAdministradoraCanopus = (pdf: jsPDF, administrator: any, branding: any) => {
  let yPosition = 70;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  // Nome da administradora
  pdf.setFontSize(16);
  pdf.setTextColor(bgR, bgG, bgB);
  pdf.text(administrator.name, 25, yPosition);
  yPosition += 15;
  
  // Indicadores de confiança
  if (administrator.trustIndicators && administrator.trustIndicators.length > 0) {
    const cardWidth = 50;
    const startX = (pageWidth - (administrator.trustIndicators.length * cardWidth + (administrator.trustIndicators.length - 1) * 5)) / 2;
    
    administrator.trustIndicators.forEach((indicator: any, index: number) => {
      const cardX = startX + index * (cardWidth + 5);
      
      pdf.setFillColor(252, 252, 252);
      pdf.rect(cardX, yPosition, cardWidth, 30, 'F');
      
      pdf.setDrawColor(acR, acG, acB);
      pdf.setLineWidth(0.5);
      pdf.rect(cardX, yPosition, cardWidth, 30, 'S');
      
      pdf.setFontSize(18);
      pdf.setTextColor(bgR, bgG, bgB);
      const numberWidth = pdf.getTextWidth(indicator.number);
      pdf.text(indicator.number, cardX + (cardWidth - numberWidth) / 2, yPosition + 12);
      
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      const labelLines = pdf.splitTextToSize(indicator.label, cardWidth - 4);
      let labelY = yPosition + 20;
      labelLines.forEach((line: string) => {
        const lineWidth = pdf.getTextWidth(line);
        pdf.text(line, cardX + (cardWidth - lineWidth) / 2, labelY);
        labelY += 4;
      });
    });
    
    yPosition += 45;
  }
  
  // Destaques
  if (administrator.highlights && administrator.highlights.length > 0) {
    pdf.setFontSize(12);
    pdf.setTextColor(bgR, bgG, bgB);
    pdf.text('Destaques', 25, yPosition);
    yPosition += 10;
    
    administrator.highlights.forEach((highlight: string) => {
      pdf.setFillColor(252, 252, 252);
      pdf.rect(25, yPosition - 3, pageWidth - 50, 12, 'F');
      
      pdf.setDrawColor(acR, acG, acB);
      pdf.setLineWidth(0.5);
      pdf.rect(25, yPosition - 3, pageWidth - 50, 12, 'S');
      
      pdf.setFillColor(acR, acG, acB);
      pdf.circle(30, yPosition + 3, 2, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      pdf.text(highlight, 35, yPosition + 4);
      
      yPosition += 17;
    });
  }
};

const renderCreditoSelecionado = (pdf: jsPDF, selectedCredit: any, branding: any) => {
  let yPosition = 70;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  const creditData = [
    { label: 'Valor do Crédito', value: selectedCredit.creditValue },
    { label: 'Parcela Mensal', value: selectedCredit.installment },
    { label: 'Renda Estimada', value: selectedCredit.estimatedIncome },
    { label: 'Patrimônio Projetado', value: selectedCredit.patrimony }
  ];
  
  creditData.forEach((item) => {
    pdf.setFillColor(252, 252, 252);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 18, 'F');
    
    pdf.setDrawColor(acR, acG, acB);
    pdf.setLineWidth(0.5);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 18, 'S');
    
    pdf.setFillColor(acR, acG, acB);
    pdf.rect(25, yPosition - 3, 4, 18, 'F');
    
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(item.label, 35, yPosition + 4);
    
    pdf.setFontSize(14);
    pdf.setTextColor(bgR, bgG, bgB);
    pdf.text(item.value, 35, yPosition + 12);
    
    yPosition += 25;
  });
};

const renderCompromissosCliente = (pdf: jsPDF, commitments: any[], branding: any) => {
  let yPosition = 70;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  commitments.forEach((commitment, index) => {
    if (yPosition > 230) {
      pdf.addPage();
      addPageHeader(pdf, 'COMPROMISSOS DO CLIENTE', branding);
      yPosition = 60;
    }
    
    pdf.setFillColor(248, 250, 252);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 20, 'F');
    
    pdf.setDrawColor(acR, acG, acB);
    pdf.setLineWidth(0.5);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 20, 'S');
    
    const circleRadius = 7;
    const circleX = 35;
    const circleY = yPosition + 7;
    
    pdf.setFillColor(bgR, bgG, bgB);
    pdf.circle(circleX, circleY, circleRadius, 'F');
    
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    const numberText = (index + 1).toString();
    const textDimensions = pdf.getTextDimensions(numberText);
    const numberX = circleX - (textDimensions.w / 2);
    const numberY = circleY + (textDimensions.h / 2) - 0.5;
    pdf.text(numberText, numberX, numberY);
    
    pdf.setFontSize(11);
    pdf.setTextColor(bgR, bgG, bgB);
    pdf.text(commitment.title, 50, yPosition + 5);
    
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    const descLines = pdf.splitTextToSize(commitment.description, 130);
    descLines.forEach((line: string, lineIndex: number) => {
      pdf.text(line, 50, yPosition + 11 + lineIndex * 4);
    });
    
    yPosition += 28;
  });
};

const renderInstrucoesAssinatura = (pdf: jsPDF, branding: any) => {
  let yPosition = 70;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const [bgR, bgG, bgB] = hexToRgb(branding.pdfBackgroundColor);
  const [acR, acG, acB] = hexToRgb(branding.pdfAccentColor);
  
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  const introText = 'Para dar continuidade ao processo, siga os passos abaixo:';
  pdf.text(introText, 25, yPosition);
  yPosition += 15;
  
  const steps = [
    'Assinar digitalmente o contrato enviado por e-mail',
    'Enviar documentação solicitada (RG, CPF, comprovante de residência)',
    'Aguardar aprovação da administradora (prazo de 3-5 dias úteis)',
    'Realizar o primeiro pagamento conforme orientações',
    'Acompanhar o processo através do portal do cliente'
  ];
  
  steps.forEach((step, index) => {
    pdf.setFillColor(252, 252, 252);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 15, 'F');
    
    pdf.setDrawColor(acR, acG, acB);
    pdf.setLineWidth(0.5);
    pdf.rect(25, yPosition - 3, pageWidth - 50, 15, 'S');
    
    const circleRadius = 6;
    const circleX = 33;
    const circleY = yPosition + 5;
    
    pdf.setFillColor(bgR, bgG, bgB);
    pdf.circle(circleX, circleY, circleRadius, 'F');
    
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    const numberText = (index + 1).toString();
    const textDimensions = pdf.getTextDimensions(numberText);
    const numberX = circleX - (textDimensions.w / 2);
    const numberY = circleY + (textDimensions.h / 2) - 0.5;
    pdf.text(numberText, numberX, numberY);
    
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    const stepLines = pdf.splitTextToSize(step, 140);
    stepLines.forEach((line: string, lineIndex: number) => {
      pdf.text(line, 45, yPosition + 4 + lineIndex * 5);
    });
    
    yPosition += 20;
  });
  
  yPosition += 15;
  pdf.setFontSize(11);
  pdf.setTextColor(bgR, bgG, bgB);
  const contactText = `Em caso de dúvidas, entre em contato:`;
  pdf.text(contactText, 25, yPosition);
  yPosition += 8;
  
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  if (branding.contactPhone) {
    pdf.text(`Telefone: ${branding.contactPhone}`, 25, yPosition);
    yPosition += 6;
  }
  if (branding.contactEmail) {
    pdf.text(`E-mail: ${branding.contactEmail}`, 25, yPosition);
    yPosition += 6;
  }
  if (branding.contactWhatsapp) {
    pdf.text(`WhatsApp: ${branding.contactWhatsapp}`, 25, yPosition);
  }
};
