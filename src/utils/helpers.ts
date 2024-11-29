import { mean } from 'simple-statistics';
import { SensorData } from '../types/sensor';
import { CONFIG } from '../config';

export const getAirQualityStatus = (value: number): 'good' | 'moderate' | 'unhealthy' => {
  if (value <= CONFIG.PM10_THRESHOLDS.good) return 'good';
  if (value <= CONFIG.PM10_THRESHOLDS.moderate) return 'moderate';
  return 'unhealthy';
};

export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });
};

export const calculateDailyPattern = (measurements: SensorData[]) => {
  const hourlyData: Record<number, number[]> = {};
  
  measurements.forEach(measurement => {
    const hour = new Date(measurement.stamp).getHours();
    if (!hourlyData[hour]) {
      hourlyData[hour] = [];
    }
    hourlyData[hour].push(Number(measurement.value));
  });

  const dailyPattern = Array.from({ length: 24 }, (_, hour) => {
    const values = hourlyData[hour] || [];
    return values.length > 0 ? mean(values) : null;
  });

  // Fill in missing values with interpolation
  for (let i = 0; i < 24; i++) {
    if (dailyPattern[i] === null) {
      let prev = i - 1;
      let next = i + 1;
      while (prev >= 0 && dailyPattern[prev] === null) prev--;
      while (next < 24 && dailyPattern[next] === null) next++;
      
      const prevVal = prev >= 0 ? dailyPattern[prev] : dailyPattern[next];
      const nextVal = next < 24 ? dailyPattern[next] : dailyPattern[prev];
      
      if (prevVal !== null && nextVal !== null) {
        dailyPattern[i] = (prevVal + nextVal) / 2;
      } else {
        dailyPattern[i] = prevVal !== null ? prevVal : nextVal;
      }
    }
  }

  return dailyPattern;
};