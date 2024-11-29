import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  linearRegression,
  linearRegressionLine,
  mean,
} from "simple-statistics";
import { Clock } from "lucide-react";
import { Card, CardContent } from "./Card";
import { AirQualityInfo } from "./AirQualityInfo";
import { PredictedData } from "../types/sensor";
import { fetchSensorData } from "../utils/api";
import {
  getAirQualityStatus,
  formatDisplayDate,
  calculateDailyPattern,
} from "../utils/helpers";
import { CONFIG } from "../config";

interface PredictionWidgetProps {
  latitude: number;
  longitude: number;
  measurementType?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const status = getAirQualityStatus(value);
    const statusColors = {
      good: "text-green-600",
      moderate: "text-yellow-600",
      unhealthy: "text-red-600",
    };

    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-gray-700">{label}</p>
        <p className={`font-bold ${statusColors[status]}`}>{value} µg/m³</p>
        <p className="text-sm capitalize">{status}</p>
      </div>
    );
  }
  return null;
};

const SimpleWeekView = ({ predictions }: { predictions: PredictedData[] }) => {
  return (
    <div className="flex justify-between mt-4 px-4">
      {predictions.map((day, index) => (
        <div key={index} className="flex flex-col items-center">
          <span className="text-sm">{day.displayDate}</span>
          <span className="text-2xl mt-1">
            {getAirQualityStatus(day.value) === "good"
              ? "😊"
              : getAirQualityStatus(day.value) === "moderate"
              ? "😐"
              : "😷"}
          </span>
        </div>
      ))}
    </div>
  );
};

const PredictionWidget: React.FC<PredictionWidgetProps> = ({
  latitude,
  longitude,
  measurementType = "pm10",
}) => {
  const [predictions, setPredictions] = useState<PredictedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<number | null>(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const measurements = await fetchSensorData(measurementType);

      if (!measurements || measurements.length === 0) {
        throw new Error("No data available");
      }

      setCurrentValue(Number(measurements[measurements.length - 1].value));

      // Calculate seasonal patterns from 30 days of data
      const dailyPattern = calculateDailyPattern(measurements);

      // Get recent trends from last 7 days (168 hours)
      const recentTrend = linearRegression(
        measurements
          .slice(-168)
          .map((m, index) => [index, Number(m.value)])
      );
      const recentTrendLine = linearRegressionLine(recentTrend);

      // Get long-term trends from 30 days (720 hours)
      const longTermTrend = linearRegression(
        measurements
          .slice(-720)
          .map((m, index) => [index, Number(m.value)])
      );
      const longTermTrendLine = linearRegressionLine(longTermTrend);

      const futurePredictions: PredictedData[] = Array.from(
        { length: 7 },
        (_, dayIndex) => {
          const predictionDate = new Date();
          predictionDate.setDate(predictionDate.getDate() + dayIndex + 1);

          const hour = predictionDate.getHours();
          
          // Get the historical pattern for this hour
          const seasonalPattern = dailyPattern[hour] || 
            mean(measurements.map((m) => Number(m.value)));

          // Calculate both short and long term trends
          const recentTrendValue = recentTrendLine(168 + dayIndex * 24);
          const longTermTrendValue = longTermTrendLine(720 + dayIndex * 24);

          // Weight factors based on prediction distance
          const dayWeight = dayIndex / 7;
          
          // For near-term predictions, favor recent trends
          // For longer-term predictions, favor seasonal patterns
          const recentTrendWeight = Math.max(0.2, 1 - dayWeight);
          const longTermTrendWeight = Math.min(0.4, dayWeight);
          const seasonalWeight = Math.min(0.4, dayWeight);

          // Combine all factors
          const predictedValue = Math.max(
            0,
            Number(
              (
                recentTrendValue * recentTrendWeight +
                longTermTrendValue * longTermTrendWeight +
                seasonalPattern * seasonalWeight
              ).toFixed(1)
            )
          );

          return {
            displayDate: formatDisplayDate(predictionDate),
            value: predictedValue,
            status: getAirQualityStatus(predictedValue),
          };
        }
      );

      setPredictions(futurePredictions);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  const interval = setInterval(fetchData, 15 * 60 * 1000);
  return () => clearInterval(interval);
}, [latitude, longitude, measurementType]);

  if (loading) {
    return (
      <Card className="w-full h-[500px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-lg">Проверка на квалитетот на воздухот...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[500px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const currentStatus = currentValue
    ? getAirQualityStatus(currentValue)
    : "moderate";
  const statusStyles = {
    good: "bg-green-50 border-green-200",
    moderate: "bg-yellow-50 border-yellow-200",
    unhealthy: "bg-red-50 border-red-200",
  };

  return (
    <div
      className={`w-full h-[500px] p-4 rounded-lg border shadow-sm ${statusStyles[currentStatus]}`}
    >
      {currentValue && (
        <AirQualityInfo status={currentStatus} value={currentValue} />
      )}

      <SimpleWeekView predictions={predictions} />

      <div className="h-[250px] w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={predictions}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayDate" interval={0} />
            <YAxis
              label={{
                value: "Air Quality",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <ReferenceLine
              y={CONFIG.PM10_THRESHOLDS.good}
              stroke="green"
              strokeDasharray="3 3"
              label={{ value: "Good", position: "right" }}
            />
            <ReferenceLine
              y={CONFIG.PM10_THRESHOLDS.moderate}
              stroke="orange"
              strokeDasharray="3 3"
              label={{ value: "Moderate", position: "right" }}
            />
            <Tooltip content={<CustomTooltip />} />
            // Before (problematic code)
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1d4ed8"
              name="Air Quality"
              dot={{
                fill: (entry: any) => {
                  switch (entry.status) {
                    case "good":
                      return "#22c55e";
                    case "moderate":
                      return "#eab308";
                    case "unhealthy":
                      return "#ef4444";
                    default:
                      return "#1d4ed8";
                  }
                },
              }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-500 text-center mt-2">
        <Clock className="inline h-4 w-4 mr-1" />
        Updated every 15 minutes • Податоците се ажурираат на секои 15 минути
      </div>
    </div>
  );
};

export default PredictionWidget;
