export interface SensorData {
    sensorId: string;
    value: number;
    type: string;
    stamp: string;
  }
  
  export interface PredictedData {
    displayDate: string;
    value: number;
    status: 'good' | 'moderate' | 'unhealthy';
  }