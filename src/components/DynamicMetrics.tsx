import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';
import { TrendingUp, Users, Globe } from 'lucide-react';
import StatsCard from '@/components/common/StatsCard';

const iconMap = {
  0: TrendingUp,
  1: Users,
  2: Globe,
};

const DynamicMetrics: React.FC = () => {
  const { branding } = useBranding();
  
  const metrics = branding.metricsJson || [
    { value: "R$ 2.4Bi", label: "Em créditos gerenciados" },
    { value: "15 anos", label: "De experiência no mercado" },
    { value: "98%", label: "De satisfação dos clientes" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <StatsCard
          key={index}
          icon={iconMap[index as keyof typeof iconMap] || TrendingUp}
          value={metric.value}
          label={metric.label}
          description=""
          index={index}
        />
      ))}
    </div>
  );
};

export default DynamicMetrics;
