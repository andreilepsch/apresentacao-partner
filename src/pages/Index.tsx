
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import DynamicCompanyName from "@/components/DynamicCompanyName";

const Index = () => {
  const navigate = useNavigate();

  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    if (user) {
      navigate("/meeting-selection");
    } else {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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
