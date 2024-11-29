# Air Quality Prediction Widget

This project is a prediction widget designed for **Digital Signage** in collaboration with **Pulse Eco**. The widget fetches historical air quality data from the Pulse Eco API, calculates trends, and predicts air quality (PM10 levels) for the next 7 days.

## Features

- **Historical Data Analysis**:
  - Fetches the last month's air quality data using the Pulse Eco API.
  - Analyzes trends and patterns in air quality measurements.

- **Prediction**:
  - Utilizes both short-term and long-term trends for predictions.
  - Incorporates daily seasonal patterns to improve accuracy.
  - Predicts PM10 levels for the next 7 days with distinct calculations:
    - **Day 1-2**: Heavily influenced by short-term trends.
    - **Day 3-5**: Balances between seasonal patterns and long-term trends.
    - **Day 6-7**: Focuses more on seasonal patterns.

- **Air Quality Status**:
  - Classifies predictions into `good`, `moderate`, or `unhealthy` based on configurable thresholds.

## How It Works

1. **Data Fetching**:
   - The widget uses the Pulse Eco API to fetch data for the last 31 days.
   - Example API endpoint:
     ```
     https://skopje.pulse.eco/rest/dataRaw?type=pm10&from={date_from}&to={date_to}&sensorId={sensor_id}
     ```

2. **Calculations**:
   - **Daily Patterns**: Identifies hourly trends in historical data.
   - **Short-Term Trend**: Linear regression on the last 7 days of data.
   - **Long-Term Trend**: Linear regression on the last 30 days of data.
   - Combines all factors to provide predictions.

3. **Visualization**:
   - Displays predictions in a chart.
   - Highlights daily air quality status with color-coded icons and detailed tooltips.

## Configurations

- API base URL and authentication can be configured in the `CONFIG` file:
  ```javascript
  export const CONFIG = {
    API_BASE_URL: "https://skopje.pulse.eco/rest",
    API_AUTH: btoa("username:password"),
    PM10_THRESHOLDS: {
      good: 50,
      moderate: 100,
    },
  };



1.Usage

Clone the repository:
git clone https://github.com/your-repo-name.git
cd your-repo-name

2.Install dependencies:
npm install

3.Run the development server:
npm start


Developed for enhancing environmental awareness through innovative Digital Signage solutions. 🌍


### Instructions:
- Replace `"https://github.com/your-repo-name.git"` with the actual GitHub repository URL.
- Update `CONFIG` details (e.g., API credentials) if required.
