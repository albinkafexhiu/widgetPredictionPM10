import React from 'react';
import { Wind, Stethoscope } from 'lucide-react';

interface AirQualityInfoProps {
  status: 'good' | 'moderate' | 'unhealthy';
  value: number;
}

const getHealthMessage = (status: 'good' | 'moderate' | 'unhealthy') => {
  switch (status) {
    case 'good':
      return {
        title: "Воздухот е чист!",
        subtitle: "Air is Clean!",
        message: "Perfect for outdoor activities",
        recommendation: "Enjoy your time outside",
        icon: "😊"
      };
    case 'moderate':
      return {
        title: "Воздухот е загаден!",
        subtitle: "Air quality is moderate",
        message: "Acceptable for most people",
        recommendation: "Sensitive individuals should limit prolonged outdoor activities",
        icon: "😐"
      };
    case 'unhealthy':
      return {
        title: "Воздухот е многу загаден!",
        subtitle: "Air quality is poor",
        message: "May cause breathing discomfort",
        recommendation: "Consider reducing outdoor activities",
        icon: "😷"
      };
  }
};

export const AirQualityInfo: React.FC<AirQualityInfoProps> = ({ status, value }) => {
  const healthInfo = getHealthMessage(status);
  
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-4xl">{healthInfo.icon}</span>
          <div>
            <h3 className="text-2xl font-bold">{healthInfo.title}</h3>
            <p className="text-lg">{healthInfo.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{value.toFixed(1)}</div>
          <div className="text-sm text-gray-600">µg/m³</div>
        </div>
      </div>
      
      <div className="mt-2 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          <span>{healthInfo.message}</span>
        </div>
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          <span>{healthInfo.recommendation}</span>
        </div>
      </div>
    </div>
  );
};