
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const ProgressBar = ({ currentStep, totalSteps = 4 }: ProgressBarProps) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#193D32]">
          Ciclo {currentStep} de {totalSteps}
        </h2>
        <div className="text-lg text-[#333333]">
          {Math.round((currentStep / totalSteps) * 100)}% concluído
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-[#B78D4A] to-[#355F4D] h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
