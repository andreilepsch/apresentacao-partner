
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DynamicCompanyName from "@/components/DynamicCompanyName";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona automaticamente para a autenticação
    navigate("/auth");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-rc-primary">
      <div className="text-center">
        <h1 className="text-h1 font-manrope text-white mb-4"><DynamicCompanyName /></h1>
        <p className="text-body font-manrope text-white/80">Carregando apresentação...</p>
      </div>
    </div>
  );
};

export default Index;
