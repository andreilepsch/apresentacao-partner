import { useState, useEffect, useRef } from "react";
import { Brain, Calculator, TrendingUp, Target, CheckCircle } from "lucide-react";

interface LoadingAnalysisProps {
  durationMs?: number;
  onComplete?: () => void;
}

const LoadingAnalysis = ({ durationMs = 7000, onComplete }: LoadingAnalysisProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const steps = [
    { icon: Calculator, text: "Analisando seu perfil e entradas", color: "#193D32" },
    { icon: TrendingUp, text: "Projetando patrimônio e renda", color: "#B78D4A" },
    { icon: Target, text: "Ajustando sua estratégia ideal", color: "#355F4D" },
    { icon: Brain, text: "Aplicando inteligência financeira", color: "#D4B570" }
  ];

  useEffect(() => {
    const startTime = Date.now();
    startTimeRef.current = startTime;
    
    // Usar tanto requestAnimationFrame quanto setInterval para garantir atualização suave
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / durationMs, 1);
      
      setProgress(newProgress * 100);
      setCurrentStep(Math.min(Math.floor(newProgress * steps.length), steps.length - 1));

      if (newProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          onComplete?.();
        }, 200);
      }
    };

    animate();
    
    // Fallback com setInterval para garantir que a animação funcione
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / durationMs, 1);
      
      setProgress(newProgress * 100);
      setCurrentStep(Math.min(Math.floor(newProgress * steps.length), steps.length - 1));
      
      if (newProgress >= 1) {
        clearInterval(intervalId);
      }
    }, 50); // Atualiza a cada 50ms

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(intervalId);
    };
  }, [durationMs, onComplete]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-manrope flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Logo/Icon Area */}
        <div className="mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-[#193D32] to-[#355F4D] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#193D32] mb-2">
            Construindo sua Projeção
          </h2>
          <p className="text-[#666666]">
            Aguarde enquanto analisamos as melhores estratégias para você
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#193D32] to-[#B78D4A] h-3 rounded-full transition-transform duration-700 ease-out will-change-transform origin-left"
              style={{ transform: `scaleX(${progress / 100})` }}
            ></div>
          </div>
          <div className="text-sm text-[#666666] font-semibold">
            {Math.round(progress)}% concluído
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const StepIcon = step.icon;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isCurrent
                    ? 'bg-white shadow-lg border-l-4'
                    : isCompleted
                      ? 'bg-green-50 border-l-4 border-green-500'
                      : 'bg-gray-50'
                }`}
                style={{ borderLeftColor: isCurrent ? step.color : undefined }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                      ? 'bg-white shadow-md'
                      : 'bg-gray-200'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <StepIcon className={`w-5 h-5 ${isCurrent ? 'text-[#193D32]' : 'text-gray-400'}`} />
                  )}
                </div>
                <span className={`font-medium ${
                  isCompleted
                    ? 'text-green-700'
                    : isCurrent
                      ? 'text-[#193D32]'
                      : 'text-gray-400'
                }`}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Loading Animation */}
        <div className="mt-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B78D4A]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnalysis;
