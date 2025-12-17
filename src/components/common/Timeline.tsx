import { Home, Users, TrendingUp, PlusCircle, Repeat } from "lucide-react";

interface TimelineStep {
  id: number;
  title: string;
  icon: any;
}

export default function Timeline() {
  const steps: TimelineStep[] = [
    {
      id: 1,
      title: "Crédito Facilitado",
      icon: Home
    },
    {
      id: 2,
      title: "Alugamos o seu Imóvel",
      icon: Users
    },
    {
      id: 3,
      title: "Receba seus Lucros",
      icon: TrendingUp
    },
    {
      id: 4,
      title: "Compre outro Imóvel",
      icon: PlusCircle
    },
    {
      id: 5,
      title: "Repita o Processo",
      icon: Repeat
    }
  ];

  return (
    <div className="relative py-16 px-4">
      {/* Curved Timeline Path */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M50 250 Q 200 50 300 150 Q 500 280 700 120 Q 800 50 950 180"
          stroke="url(#timeline-gradient)"
          strokeWidth="2"
          fill="none"
          className="opacity-70"
        />
        <defs>
          <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" />
            <stop offset="25%" stopColor="hsl(var(--accent))" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" />
            <stop offset="75%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Timeline Steps */}
      <div className="relative grid grid-cols-5 gap-4">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          
          return (
            <div
              key={step.id}
              className="flex flex-col items-center text-center group"
              style={{ 
                animationDelay: `${index * 150}ms`,
                zIndex: 10 
              }}
            >
              {/* Icon Container */}
              <div className="relative mb-6 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-secondary/30 group-hover:ring-4 group-hover:ring-secondary/50 transition-all duration-500 group-hover:scale-110">
                  <StepIcon className="w-8 h-8 text-white" />
                </div>
                
                {/* Step Number */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white">
                  {step.id}
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-8 w-4 h-0.5 bg-gradient-to-r from-secondary/60 to-transparent hidden lg:block"></div>
                )}

                {/* Glow Effect */}
                <div className="absolute inset-0 w-16 h-16 bg-secondary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>

              {/* Step Title */}
              <div className="px-2">
                <h3 className="text-sm md:text-base lg:text-lg font-bold text-white group-hover:text-accent transition-colors duration-300 animate-fade-in leading-tight">
                  {step.title}
                </h3>
              </div>

              {/* Progress Dot */}
              <div className="mt-4 w-2 h-2 bg-secondary/60 rounded-full group-hover:bg-accent group-hover:scale-150 transition-all duration-300 animate-fade-in shadow-lg"></div>
            </div>
          );
        })}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-1 h-1 bg-secondary/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-12 right-12 w-1.5 h-1.5 bg-accent/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/4 right-1/3 w-0.5 h-0.5 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
    </div>
  );
}