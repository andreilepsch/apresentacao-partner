
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import RCButton from "@/components/RCButton";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-rc-background font-manrope">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-rc-accent rounded-full flex items-center justify-center mx-auto mb-8">
          <Home className="w-12 h-12 text-rc-primary" />
        </div>
        <h1 className="text-h1 text-rc-primary mb-4">404</h1>
        <p className="text-h3 text-rc-type/70 mb-4">Página não encontrada</p>
        <p className="text-body text-rc-type/60 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <RCButton 
          variant="primary" 
          onClick={() => navigate("/")}
          className="text-h3"
        >
          Voltar ao Início
        </RCButton>
      </div>
    </div>
  );
};

export default NotFound;
