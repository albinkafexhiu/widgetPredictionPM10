import { SensorData } from '../types/sensor';
import { CONFIG } from '../config';

export const formatDateForApi = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}%2b01:00`;
};

export const fetchSensorData = async (
  measurementType: string = 'pm10',
  sensorId: string = '3d5e32fb-3c41-427f-b6ef-ed19e84026dd'
): Promise<SensorData[]> => {
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const response = await fetch(
    `${CONFIG.API_BASE_URL}/dataRaw?type=${measurementType}&from=${formatDateForApi(weekAgo)}&to=${formatDateForApi(now)}&sensorId=${sensorId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${CONFIG.API_AUTH}`,
        'Accept': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};