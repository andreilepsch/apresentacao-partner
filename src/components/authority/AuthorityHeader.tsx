import PageBadge from "@/components/common/PageBadge";
import SectionDivider from "@/components/common/SectionDivider";
import DynamicLogo from "@/components/DynamicLogo";
import DynamicCompanyName from "@/components/DynamicCompanyName";
import { useBranding } from "@/contexts/BrandingContext";
import { Award } from "lucide-react";

const AuthorityHeader = () => {
  const { branding } = useBranding();

  return (
    <div className="text-center mb-12 animate-fade-in">
      {/* Logo Principal */}
      <div className="mb-6 flex justify-center">
        <DynamicLogo size="lg" variant="light" />
      </div>

      {/* Badge Premium */}
      <PageBadge
        icon={Award}
        text="CONSULTORIA PREMIUM"
        className="mb-8"
      />

      {/* Subtítulo */}
      <p className="text-lg md:text-xl text-[#333333] mb-8 max-w-4xl mx-auto leading-relaxed">
        {branding.companyTagline}
      </p>

      {/* Divisor visual */}
      <SectionDivider className="mb-12" />
    </div>
  );
};

export default AuthorityHeader;