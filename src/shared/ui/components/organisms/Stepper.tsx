import React from 'react';
import { CheckCircle2, LucideIcon } from 'lucide-react';

export interface StepItem {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface StepperProps {
  currentStep: number;
  steps: StepItem[];
}

export const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="z-20 relative space-y-8">
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <div key={step.id} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-yellow-400 text-blue-950 scale-110 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : isCompleted ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
              {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
            </div>
            <div>
              <p className={`text-sm font-bold uppercase tracking-wider ${isActive ? 'text-yellow-400' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                Passo {step.id}
              </p>
              <p className={`font-medium ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`}>
                {step.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
