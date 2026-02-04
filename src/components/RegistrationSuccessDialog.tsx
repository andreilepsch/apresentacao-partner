import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { CheckCircle } from "lucide-react";

interface RegistrationSuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const RegistrationSuccessDialog = ({
    open,
    onOpenChange,
    onConfirm,
}: RegistrationSuccessDialogProps) => {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        // URL pública de animação de sucesso (Check Mark)
        // Usando uma URL do lottiefiles.com que costuma ser acessível
        fetch("https://lottie.host/8cbf165e-257a-42c2-841f-1736b432a58b/Zdb69R8qwF.json")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((data) => setAnimationData(data))
            .catch((err) => {
                console.warn("Failed to load Lottie animation, falling back to icon", err);
                setAnimationData(null);
            });
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#1A3A52] border-white/20 text-white sm:max-w-md shadow-2xl">
                <DialogHeader className="flex flex-col items-center gap-4 pt-4">

                    <div className="w-40 h-40 flex items-center justify-center">
                        {animationData ? (
                            <Lottie
                                animationData={animationData}
                                loop={false}
                                className="w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 animate-in zoom-in duration-500">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                        )}
                    </div>

                    <DialogTitle className="text-2xl text-center font-bold text-[#C9A45C]">
                        Solicitação Enviada!
                    </DialogTitle>
                </DialogHeader>

                <div className="text-center text-white/80 space-y-3 py-2 px-4">
                    <p className="text-base">
                        Seu cadastro foi recebido com sucesso.
                    </p>
                    <p className="text-sm text-white/60">
                        O administrador verificará seus dados e as informações da sua empresa. Você receberá um e-mail de confirmação assim que seu acesso for aprovado.
                    </p>
                </div>

                <DialogFooter className="sm:justify-center pb-4">
                    <Button
                        onClick={onConfirm}
                        className="w-full sm:w-auto min-w-[160px] bg-[#C9A45C] hover:bg-[#B78D4A] text-white font-semibold transition-all duration-300 hover:scale-105"
                    >
                        Entendido, obrigado!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
