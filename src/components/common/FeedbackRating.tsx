import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";

interface FeedbackRatingProps {
  onRatingChange: (rating: number) => void;
  rating: number;
}

const FeedbackRating = ({ onRatingChange, rating }: FeedbackRatingProps) => {
  const handleSliderChange = (value: number[]) => {
    onRatingChange(value[0]);
  };

  const getRatingText = (rating: number) => {
    if (rating === 0) return "";
    if (rating <= 3) return "Precisa melhorar";
    if (rating <= 6) return "Bom";
    if (rating <= 8) return "Muito bom";
    return "Gostei Muito";
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-8 py-12">
      {/* Slider Section */}
      <div className="mb-12">
        <div className="relative mb-8">
          <Slider
            value={[rating]}
            onValueChange={handleSliderChange}
            max={10}
            min={0}
            step={1}
            className="w-full slider-custom"
          />
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-400 mb-8">
          <span className="font-medium">0</span>
          <span className="font-medium">10</span>
        </div>
      </div>
      
      {/* Rating Display */}
      {rating > 0 && (
        <div className="text-center animate-fade-in">
          <p className="text-2xl font-bold text-[#193D32] mb-6">
            {getRatingText(rating)}
          </p>
          
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  i < Math.ceil(rating / 2) 
                    ? "fill-[#B78D4A] text-[#B78D4A]" 
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          
          <p className="text-lg font-semibold text-[#193D32]">
            Sua avaliação: {rating}/10
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackRating;