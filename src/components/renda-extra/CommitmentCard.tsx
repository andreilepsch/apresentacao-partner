
import { CheckCircle } from "lucide-react";

interface CommitmentCardProps {
  commitment: {
    number: string;
    title: string;
    description: string;
    image: string;
  };
  index: number;
}

const CommitmentCard = ({ commitment, index }: CommitmentCardProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Content */}
      <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#B78D4A] rounded-full flex items-center justify-center text-white font-bold text-xl">
            {commitment.number}
          </div>
          <h2 className="text-2xl font-bold text-[#193D32]">
            {commitment.title}
          </h2>
        </div>
        
        <p className="text-[#333333] leading-relaxed text-lg">
          {commitment.description}
        </p>

        <div className="flex items-center gap-3 text-[#B78D4A]">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Compromisso essencial</span>
        </div>
      </div>

      {/* Image */}
      <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
        <div className="rounded-xl aspect-[16/10] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <img 
            src={commitment.image} 
            alt={`Compromisso ${commitment.number}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CommitmentCard;
