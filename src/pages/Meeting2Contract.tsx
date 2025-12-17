import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useBranding } from "@/contexts/BrandingContext";
import DynamicLogo from "@/components/DynamicLogo";

export default function Meeting2Contract() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  useScrollToTop();
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    setIsAccepted(true);
    // Navegar para como escolhemos o consórcio após breve atraso
    setTimeout(() => {
      navigate("/meeting2/consortium-selection");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/80 via-primary to-primary/75 relative overflow-hidden">
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/80"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate("/meeting2/consultoria")}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            <span className="font-medium">Contrato de Consultoria</span>
          </div>
        </header>

        {/* Contract Card */}
        <Card className="bg-white shadow-2xl">
          <CardContent className="p-8">
            {/* Header with Logo */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                <DynamicLogo size="md" variant="light" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{branding.contractCompanyName.toUpperCase()}</h1>
                <p className="text-gray-600">Consultoria em Investimentos</p>
              </div>
            </div>

            {/* Contract Title */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA
              </h2>
            </div>

            {/* Contract Content */}
            <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold">CONTRATANTE:</span>
                  <div className="mt-1 text-xs">
                    <p>Nome: ________________________</p>
                    <p>CPF: _________________________</p>
                    <p>Endereço: ____________________</p>
                    <p>Telefone: _____________________</p>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">{branding.contractCompanyName}:</span>
                  <div className="mt-1 text-xs">
                    <p>CNPJ/MF nº {branding.contractCnpj}</p>
                    <p>Endereço: {branding.contractAddress}</p>
                    <p>CEP {branding.contractCep}</p>
                    <p>{branding.contractCity}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p>
                  <span className="font-semibold">CLÁUSULA 1 – DO OBJETO</span>
                </p>
                <p className="text-sm">
                  1.1. O presente contrato tem por objeto a prestação de serviços de consultoria especializada por parte da empresa {branding.contractCompanyName}, doravante denominada CONTRATADA, ao CONTRATANTE, abrangendo as seguintes atividades:
                </p>
                <div className="text-xs space-y-1 pl-4">
                  <p>I – Análise do melhor grupo de consórcio de acordo com o perfil do CONTRATANTE;</p>
                  <p>II – Escolha do grupo de consórcio;</p>
                  <p>III – Contratação do crédito consorcial;</p>
                  <p>IV – Emissão e envio dos boletos mensais;</p>
                  <p>V – Execução e gestão dos lances mensais para contemplação mais rápida e efetiva;</p>
                  <p>VI – Auxílio no processo de faturamento após contemplação;</p>
                  <p>VII – Estudo de rentabilidade do investimento;</p>
                  <p>VIII – Escolha do imóvel;</p>
                  <p>IX – Assessoria na compra do imóvel;</p>
                  <p>X – Apoio com decoração e mobília;</p>
                  <p>XI – Anúncio do imóvel em plataformas de locação;</p>
                  <p>XII – Gestão do preço dinâmico conforme demanda de mercado;</p>
                  <p>XIII – Apoio nos processos de check-in e check-out de inquilinos ou hóspedes;</p>
                  <p>XIV – Organização dos serviços de limpeza e manutenção do imóvel;</p>
                  <p>XV – Gestão completa da locação, seja por temporada ou contrato tradicional.</p>
                </div>

                <p>
                  <span className="font-semibold">2. OBRIGAÇÕES DO CONTRATANTE:</span> São obrigações do CONTRATANTE: I – Realizar os pagamentos dos boletos em dia; II – Cumprir com as obrigações contratuais a serem firmadas diretamente com a Administradora do Consórcio; III – Fornecer todos os documentos e informações solicitados pela {branding.contractCompanyName}, necessários para o cumprimento deste Contrato; IV – Seguir as estratégias apresentadas pela {branding.contractCompanyName}.
                </p>

                <p>
                  <span className="font-semibold">3. DA REMUNERAÇÃO:</span> Em decorrência dos serviços a serem prestados pela {branding.contractCompanyName}, fica estabelecida uma remuneração no valor a definir.
                </p>

                <p>
                  <span className="font-semibold">4. PRAZO DA RELAÇÃO COMERCIAL:</span> O presente Contrato vigorará por indeterminado, podendo ser rescindido mediante aviso prévio com ao menos 30 (trinta) dias de antecedência, a partir do 13º (décimo terceiro) mês a contar da assinatura deste Contrato, sem qualquer penalidade.
                </p>

                <p>
                  <span className="font-semibold">5. HIPÓTESES DE RESCISÃO:</span> Fica estabelecido que o presente Contrato poderá ser rescindido nas seguintes hipóteses: I – Por qualquer das partes, caso a {branding.contractCompanyName} deixe de atuar no segmento de consórcios/crédito imobiliário; II – Pela {branding.contractCompanyName}, em caso de atraso no pagamento de qualquer dos boletos do consórcio pelo CONTRATANTE; III Por qualquer das partes, na hipótese de outros descumprimentos contratuais, não sanados no prazo de até 30 (trinta) dias a contar da notificação sobre o descumprimento; IV – Por comum acordo entre as partes.
                </p>

                <p>
                  <span className="font-semibold">6. VALORES:</span> Para fins deste Contrato, fica estabelecido que o valor de parcela mensal pelo CONTRATANTE com a administradora de consórcios é de R$_______.
                </p>

                <p>
                  <span className="font-semibold">7. DA CONFIDENCIALIDADE:</span> As Partes concordam que todas as informações confidenciais e proprietárias trocadas no âmbito deste Contrato, incluindo, mas não se limitando a informações técnicas, comerciais, estratégicas e financeiras, serão mantidas em sigilo absoluto. Nenhuma das Partes deverá divulgar tais informações a terceiros sem o consentimento prévio por escrito da outra Parte, exceto conforme exigido por lei. Esta obrigação de confidencialidade permanecerá em vigor por um período de 3 (três) anos após a rescisão ou término deste Contrato.
                </p>

                <p>
                  <span className="font-semibold">8. DA IRREVOGABILIDADE E IRRETRATABILIDADE:</span> Este Contrato é celebrado em caráter irrevogável e irretratável e obriga as Partes e seus respectivos sucessores e cessionários autorizados, a qualquer título, e somente poderá ser alterado por meio de aditivo, por escrito, devidamente assinado pelas Partes.
                </p>

                <p>
                  <span className="font-semibold">9. DA CESSÃO:</span> O presente Contrato e os direitos e obrigações oriundos do mesmo não poderão ser cedidos ou transferidos, parcial ou integralmente, pelas Partes, sem o prévio e expresso consentimento das demais Partes.
                </p>

                <p>
                  <span className="font-semibold">10. FORO DE ELEIÇÃO:</span> As Partes elegem o Foro de Brasília, no Distrito Federal para dirimir quaisquer questões advindas do presente Contato, renunciando a qualquer outro, por mais privilegiado que seja.
                </p>


                <p className="text-sm">
                  E assim, por estarem justas e acertadas, assinam as Partes o presente Contrato, em via única, de forma eletrônica, na presença das duas testemunhas abaixo assinadas.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-6">
                  São Paulo, _____ de _____________ de 2024
                </p>
                
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="border-t border-gray-400 mt-16 pt-2">
                      <p className="font-semibold">CONTRATANTE</p>
                    </div>
                  </div>
                  <div>
                    <div className="border-t border-gray-400 mt-16 pt-2">
                      <p className="font-semibold">{branding.contractCompanyName.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center mt-8">
          {!isAccepted ? (
            <Button
              onClick={handleAccept}
              className="bg-secondary hover:bg-secondary/90 text-white font-medium px-8 py-3 shadow-lg transition-all hover:scale-105"
            >
              <Check className="mr-2 h-4 w-4" />
              Aceitar Contrato
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-white bg-green-600 px-6 py-3 rounded-lg">
              <Check className="h-4 w-4" />
              <span>Contrato Aceito!</span>
            </div>
          )}
        </div>

        {/* Next Step Preview */}
        {isAccepted && (
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl mt-8">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Próxima Etapa: Como Escolhemos o Consórcio
                </h2>
                <p className="text-gray-700 text-lg">
                  Agora vamos explicar nossa metodologia de 3 pilares para escolher o consórcio ideal
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}