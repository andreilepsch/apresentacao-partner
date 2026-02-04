
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PreviewModeProvider } from "@/contexts/PreviewModeContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import ThemeApplier from "@/components/ThemeApplier";
import PreviewBanner from "@/components/PreviewBanner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import BrandingSettings from "./pages/BrandingSettings";
import MeetingSelection from "./pages/MeetingSelection";
import Meeting2Selection from "./pages/Meeting2Selection";
import Meeting2 from "./pages/Meeting2";
import Meeting2Steps from "./pages/Meeting2Steps";
import Meeting2Consultoria from "./pages/Meeting2Consultoria";
import Meeting2Contract from "./pages/Meeting2Contract";
import Meeting2ConsortiumSelection from "./pages/Meeting2ConsortiumSelection";
import Meeting2ChosenAdministrator from "./pages/Meeting2ChosenAdministrator";
import Meeting2Security from "./pages/Meeting2Security";
import Meeting2PricingOptions from "./pages/Meeting2PricingOptions";
import Meeting2Commitments from "./pages/Meeting2Commitments";
import Meeting2ContractForm from "./pages/Meeting2ContractForm";
import Meeting2Form from "./pages/Meeting2Form";
import Meeting2FormSimple from "./pages/Meeting2FormSimple";
import Meeting2Hibrida from "./pages/Meeting2Hibrida";
import Meeting2HibridaSteps from "./pages/Meeting2HibridaSteps";

import Meeting2HibridaFerramentas from "./pages/Meeting2HibridaFerramentas";
import Meeting2HibridaConclusao from "./pages/Meeting2HibridaConclusao";

import ProtectedRoute from "./components/ProtectedRoute";
import PendingApproval from "./pages/PendingApproval";
import UserApprovals from "./pages/admin/UserApprovals";
import EditUserProfile from "./pages/admin/EditUserProfile";
import CompaniesManager from "./pages/admin/CompaniesManager";
import CompanyBrandingEdit from "./pages/admin/CompanyBrandingEdit";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Settings from "./pages/Settings";
import PersonalSettings from "./pages/PersonalSettings";

// Etapas principais
import Step1Authority from "./pages/Step1Authority";
import Step2Presence from "./pages/Step2Presence";
import Step3Media from "./pages/Step3Media";
import Step4WhatWeDo from "./pages/Step4WhatWeDo";
import Step5Method from "./pages/Step5Method";
import Step6InvestmentOptions from "./pages/Step6InvestmentOptions";

// Caminho Renda Extra
import RendaExtraStep1 from "./pages/renda-extra/Step1DiagnosisForm";
import RendaExtraStep2 from "./pages/renda-extra/Step2Cycles";
import RendaExtraStep4 from "./pages/renda-extra/Step4PropertyPresentation";
import RendaExtraStep5 from "./pages/renda-extra/Step5LocationAnalysis";
import RendaExtraStep6 from "./pages/renda-extra/Step6RealCase";
import RendaExtraStep7 from "./pages/renda-extra/Step7MarketAnalysis";
import RendaExtraStep8 from "./pages/renda-extra/Step8InvestmentWays";
import RendaExtraStep9 from "./pages/renda-extra/Step9ContemplationForms";
import RendaExtraStep10 from "./pages/renda-extra/Step10PaymentMethods";
import RendaExtraStep11 from "./pages/renda-extra/Step11ClientCommitments";
import RendaExtraStep12 from "./pages/renda-extra/Step12Feedback";

// Caminho Casa Própria
import CasaPropriaStep1 from "./pages/casa-propria/Step1";
import CasaPropriaStep2 from "./pages/casa-propria/Step2";
import CasaPropriaStep4 from "./pages/casa-propria/Step4PropertyPresentation";
import CasaPropriaStep5 from "./pages/casa-propria/Step5LocationAnalysis";
import CasaPropriaStep6 from "./pages/casa-propria/Step6RealCase";
import CasaPropriaStep7 from "./pages/casa-propria/Step7MarketAnalysis";
import CasaPropriaStep8 from "./pages/casa-propria/Step8InvestmentWays";
import CasaPropriaStep9 from "./pages/casa-propria/Step9ContemplationForms";
import CasaPropriaStep10 from "./pages/casa-propria/Step10PaymentMethods";
import CasaPropriaStep11 from "./pages/casa-propria/Step11ClientCommitments";
import CasaPropriaStep12 from "./pages/casa-propria/Step12Feedback";

// Caminho Aposentadoria
import AposentadoriaStep1 from "./pages/aposentadoria/Step1";
import AposentadoriaStep2 from "./pages/aposentadoria/Step2";
import AposentadoriaStep3 from "./pages/aposentadoria/Step3PropertyPresentation";
import AposentadoriaStep4 from "./pages/aposentadoria/Step4LocationAnalysis";
import AposentadoriaStep5 from "./pages/aposentadoria/Step5RealCase";
import AposentadoriaStep6 from "./pages/aposentadoria/Step6MarketAnalysis";
import AposentadoriaStep7 from "./pages/aposentadoria/Step7DiagnosisForm";
import AposentadoriaStep8 from "./pages/aposentadoria/Step8Cycles";
import AposentadoriaStep9 from "./pages/aposentadoria/Step9InvestmentWays";
import AposentadoriaStep10 from "./pages/aposentadoria/Step10ConsortiumInstrument";
import AposentadoriaStep11 from "./pages/aposentadoria/Step11ContemplationForms";
import AposentadoriaStep12 from "./pages/aposentadoria/Step12PaymentMethods";
import AposentadoriaStep13 from "./pages/aposentadoria/Step13ClientCommitments";
import AposentadoriaStep14 from "./pages/aposentadoria/Step14Feedback";

// Ferramentas
import Ferramentas from "./pages/Ferramentas";
import CalculadoraInteligente from "./pages/CalculadoraInteligente";
import MapaApresentacao from "./pages/MapaApresentacao";
import EstudosDeGrupo from "./pages/estudos-grupo/EstudosDeGrupo";
import NovoGrupo from "./pages/estudos-grupo/NovoGrupo";
import DetalhesGrupo from "./pages/estudos-grupo/DetalhesGrupo";
import NovaAnalise from "./pages/estudos-grupo/NovaAnalise";
import EditarGrupo from "./pages/estudos-grupo/EditarGrupo";
import EditarAnalise from "./pages/estudos-grupo/EditarAnalise";
import Comparativo from "./pages/estudos-grupo/Comparativo";
import AdministradorasManager from "./pages/ferramentas/AdministradorasManager";
import AdministradoraDetalhes from "./pages/ferramentas/AdministradoraDetalhes";
import SimuladorContemplacao from "./pages/ferramentas/SimuladorContemplacao";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <PreviewModeProvider>
          <BrandingProvider>
            <ThemeApplier />
            <PreviewBanner />
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/pending-approval" element={<PendingApproval />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><UserApprovals /></ProtectedRoute>} />
                <Route path="/admin/users/edit/:userId" element={<ProtectedRoute><EditUserProfile /></ProtectedRoute>} />
                <Route path="/admin/companies" element={<ProtectedRoute><CompaniesManager /></ProtectedRoute>} />
                <Route path="/admin/company-branding/:companyId" element={<ProtectedRoute><CompanyBrandingEdit /></ProtectedRoute>} />

                {/* Settings Routes */}
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/settings/personal" element={<ProtectedRoute><PersonalSettings /></ProtectedRoute>} />
                <Route path="/settings/branding" element={<ProtectedRoute><BrandingSettings /></ProtectedRoute>} />
                <Route path="/branding" element={<ProtectedRoute><BrandingSettings /></ProtectedRoute>} /> {/* Alias for backward compatibility */}
                <Route path="/meeting-selection" element={<ProtectedRoute><MeetingSelection /></ProtectedRoute>} />
                <Route path="/meeting2-selection" element={<ProtectedRoute><Meeting2Selection /></ProtectedRoute>} />
                <Route path="/meeting2" element={<ProtectedRoute><Meeting2 /></ProtectedRoute>} />
                <Route path="/meeting2/steps" element={<ProtectedRoute><Meeting2Steps /></ProtectedRoute>} />
                <Route path="/meeting2/consultoria" element={<ProtectedRoute><Meeting2Consultoria /></ProtectedRoute>} />
                <Route path="/meeting2/contract" element={<ProtectedRoute><Meeting2Contract /></ProtectedRoute>} />
                <Route path="/meeting2/consortium-selection" element={<ProtectedRoute><Meeting2ConsortiumSelection /></ProtectedRoute>} />
                <Route path="/meeting2/chosen-administrator" element={<ProtectedRoute><Meeting2ChosenAdministrator /></ProtectedRoute>} />
                <Route path="/meeting2/security" element={<ProtectedRoute><Meeting2Security /></ProtectedRoute>} />
                <Route path="/meeting2/pricing-options" element={<ProtectedRoute><Meeting2PricingOptions /></ProtectedRoute>} />
                <Route path="/meeting2/commitments" element={<ProtectedRoute><Meeting2Commitments /></ProtectedRoute>} />
                <Route path="/meeting2/contract-form" element={<ProtectedRoute><Meeting2ContractForm /></ProtectedRoute>} />
                <Route path="/meeting2/hibrida/form" element={<ProtectedRoute><Meeting2Form /></ProtectedRoute>} />
                <Route path="/meeting2/hibrida" element={<ProtectedRoute><Meeting2Hibrida /></ProtectedRoute>} />
                <Route path="/meeting2/hibrida/steps" element={<ProtectedRoute><Meeting2HibridaSteps /></ProtectedRoute>} />

                <Route path="/meeting2/hibrida/ferramentas" element={<ProtectedRoute><Meeting2HibridaFerramentas /></ProtectedRoute>} />
                <Route path="/meeting2/hibrida/conclusao" element={<ProtectedRoute><Meeting2HibridaConclusao /></ProtectedRoute>} />

                {/* Etapas principais */}
                <Route path="/step1-authority" element={<ProtectedRoute><Step1Authority /></ProtectedRoute>} />
                <Route path="/step2-presence" element={<ProtectedRoute><Step2Presence /></ProtectedRoute>} />
                <Route path="/step3-media" element={<ProtectedRoute><Step3Media /></ProtectedRoute>} />
                <Route path="/step4-what-we-do" element={<ProtectedRoute><Step4WhatWeDo /></ProtectedRoute>} />
                <Route path="/step5-method" element={<ProtectedRoute><Step5Method /></ProtectedRoute>} />
                <Route path="/step6-investment-options" element={<ProtectedRoute><Step6InvestmentOptions /></ProtectedRoute>} />

                {/* Caminho Renda Extra */}
                <Route path="/renda-extra/step1" element={<ProtectedRoute><RendaExtraStep1 /></ProtectedRoute>} />
                <Route path="/renda-extra/step2" element={<ProtectedRoute><RendaExtraStep2 /></ProtectedRoute>} />
                <Route path="/renda-extra/step4" element={<ProtectedRoute><RendaExtraStep4 /></ProtectedRoute>} />
                <Route path="/renda-extra/step5" element={<ProtectedRoute><RendaExtraStep5 /></ProtectedRoute>} />
                <Route path="/renda-extra/step6" element={<ProtectedRoute><RendaExtraStep6 /></ProtectedRoute>} />
                <Route path="/renda-extra/step7" element={<ProtectedRoute><RendaExtraStep7 /></ProtectedRoute>} />
                <Route path="/renda-extra/step8" element={<ProtectedRoute><RendaExtraStep8 /></ProtectedRoute>} />
                <Route path="/renda-extra/step9" element={<ProtectedRoute><RendaExtraStep9 /></ProtectedRoute>} />
                <Route path="/renda-extra/step10" element={<ProtectedRoute><RendaExtraStep10 /></ProtectedRoute>} />
                <Route path="/renda-extra/step11" element={<ProtectedRoute><RendaExtraStep11 /></ProtectedRoute>} />
                <Route path="/renda-extra/step12" element={<ProtectedRoute><RendaExtraStep12 /></ProtectedRoute>} />

                {/* Caminho Casa Própria */}
                <Route path="/casa-propria/step1" element={<ProtectedRoute><CasaPropriaStep1 /></ProtectedRoute>} />
                <Route path="/casa-propria/step2" element={<ProtectedRoute><CasaPropriaStep2 /></ProtectedRoute>} />
                <Route path="/casa-propria/step4" element={<ProtectedRoute><CasaPropriaStep4 /></ProtectedRoute>} />
                <Route path="/casa-propria/step5" element={<ProtectedRoute><CasaPropriaStep5 /></ProtectedRoute>} />
                <Route path="/casa-propria/step6" element={<ProtectedRoute><CasaPropriaStep6 /></ProtectedRoute>} />
                <Route path="/casa-propria/step7" element={<ProtectedRoute><CasaPropriaStep7 /></ProtectedRoute>} />
                <Route path="/casa-propria/step8" element={<ProtectedRoute><CasaPropriaStep8 /></ProtectedRoute>} />
                <Route path="/casa-propria/step9" element={<ProtectedRoute><CasaPropriaStep9 /></ProtectedRoute>} />
                <Route path="/casa-propria/step10" element={<ProtectedRoute><CasaPropriaStep10 /></ProtectedRoute>} />
                <Route path="/casa-propria/step11" element={<ProtectedRoute><CasaPropriaStep11 /></ProtectedRoute>} />
                <Route path="/casa-propria/step12" element={<ProtectedRoute><CasaPropriaStep12 /></ProtectedRoute>} />

                {/* Caminho Aposentadoria */}
                <Route path="/aposentadoria/step1" element={<ProtectedRoute><AposentadoriaStep1 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step2" element={<ProtectedRoute><AposentadoriaStep2 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step3" element={<ProtectedRoute><AposentadoriaStep3 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step4" element={<ProtectedRoute><AposentadoriaStep4 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step5" element={<ProtectedRoute><AposentadoriaStep5 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step6" element={<ProtectedRoute><AposentadoriaStep6 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step7" element={<ProtectedRoute><AposentadoriaStep7 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step8" element={<ProtectedRoute><AposentadoriaStep8 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step9" element={<ProtectedRoute><AposentadoriaStep9 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step10" element={<ProtectedRoute><AposentadoriaStep10 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step11" element={<ProtectedRoute><AposentadoriaStep11 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step12" element={<ProtectedRoute><AposentadoriaStep12 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step13" element={<ProtectedRoute><AposentadoriaStep13 /></ProtectedRoute>} />
                <Route path="/aposentadoria/step14" element={<ProtectedRoute><AposentadoriaStep14 /></ProtectedRoute>} />

                {/* Ferramentas */}
                <Route path="/ferramentas" element={<ProtectedRoute><Ferramentas /></ProtectedRoute>} />
                <Route path="/calculadora-inteligente" element={<ProtectedRoute><CalculadoraInteligente /></ProtectedRoute>} />
                <Route path="/mapa-apresentacao" element={<ProtectedRoute><MapaApresentacao /></ProtectedRoute>} />
                <Route path="/estudos-grupo" element={<ProtectedRoute><EstudosDeGrupo /></ProtectedRoute>} />
                <Route path="/estudos-grupo/novo" element={<ProtectedRoute><NovoGrupo /></ProtectedRoute>} />
                <Route path="/estudos-grupo/:id" element={<ProtectedRoute><DetalhesGrupo /></ProtectedRoute>} />
                <Route path="/estudos-grupo/:id/editar" element={<ProtectedRoute><EditarGrupo /></ProtectedRoute>} />
                <Route path="/estudos-grupo/:id/nova-analise" element={<ProtectedRoute><NovaAnalise /></ProtectedRoute>} />
                <Route path="/estudos-grupo/:grupoId/analise/:analiseId/editar" element={<ProtectedRoute><EditarAnalise /></ProtectedRoute>} />
                <Route path="/estudos-grupo/comparativo" element={<ProtectedRoute><Comparativo /></ProtectedRoute>} />
                <Route path="/ferramentas/administradoras" element={<ProtectedRoute><AdministradorasManager /></ProtectedRoute>} />
                <Route path="/ferramentas/administradoras/:id/grupos" element={<ProtectedRoute><AdministradoraDetalhes /></ProtectedRoute>} />
                <Route path="/ferramentas/simulador-contemplacao" element={<ProtectedRoute><SimuladorContemplacao /></ProtectedRoute>} />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BrandingProvider>
        </PreviewModeProvider>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
