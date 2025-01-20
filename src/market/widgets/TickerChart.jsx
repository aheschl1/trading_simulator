import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useTicker } from "../context/TickerContext";
import "./TickerChart.css";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";
import { Typography } from "@mui/material";

export default function TickerChart() {
  const [timeFrame, setTimeFrame] = useState("1d");
  const [chartData, setChartData] = useState(null);
  const { 
    intradayFiveMinuteData, 
    dailyData, 
    weeklyData, 
    monthlyData, 
    intradayFiveMinuteLoading, 
    dailyLoading, 
    weeklyLoading, 
    monthlyLoading, 
    intradayFiveMinuteError, 
    intradaySixtyMinuteError,
    intradaySixtyMinuteData,
    intradaySixtyMinuteLoading,
    dailyError, 
    weeklyError, 
    monthlyError, 
    symbol 
  } = useTicker();

  const { simulatedDate } = useSimulatedDate();

  const oneDayThreshold = new Date(simulatedDate.getTime() - 24 * 60 * 60 * 1000);
  const weekThreshold = new Date(simulatedDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthThreshold = new Date(simulatedDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const threeMonthThreshold = new Date(simulatedDate.getTime() - 90 * 24 * 60 * 60 * 1000);
  const yearThreshold = new Date(simulatedDate.getTime() - 365 * 24 * 60 * 60 * 1000);
  const fiveYearThreshold = new Date(simulatedDate.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);

  const timeSeries = {
    "1d": (intradayFiveMinuteLoading || intradayFiveMinuteError) ? undefined : intradayFiveMinuteData.entries.filter((entry) => {
      const entryDate = new Date(entry.date); 
      return oneDayThreshold <= entryDate && entryDate <= simulatedDate;
    }),
    "1w": (intradaySixtyMinuteLoading || intradaySixtyMinuteError) ? undefined : intradaySixtyMinuteData.entries.filter((entry) => {
      const entryDate = new Date(entry.date); 
      return weekThreshold <= entryDate && entryDate <= simulatedDate;
    }),
    "1m": (dailyLoading || dailyError) ? undefined : dailyData.entries.filter((entry) => {
      const entryDate = new Date(entry.date); 
      return monthThreshold <= entryDate && entryDate <= simulatedDate;
    }),
    "3m": (dailyLoading || dailyError) ? undefined : dailyData.entries.filter((entry) => {
      const entryDate = new Date(entry.date); 
      return threeMonthThreshold <= entryDate && entryDate <= simulatedDate;
    }),
    "1y": (weeklyLoading || weeklyError) ? undefined : weeklyData.entries.filter((entry) => {
      const entryDate = new Date(entry.date); 
      return yearThreshold <= entryDate && entryDate <= simulatedDate;
    }),
    "5y": (monthlyLoading || monthlyError) ? undefined : monthlyData.entries.filter((entry) => {
      const entryDate = new Date(entry.date); 
      return fiveYearThreshold <= entryDate && entryDate <= simulatedDate;
    }),
  }[timeFrame];

  const isLoading = intradayFiveMinuteLoading || intradaySixtyMinuteLoading || dailyLoading || weeklyLoading || monthlyLoading;
  const hasError = intradayFiveMinuteError || intradaySixtyMinuteError || dailyError || weeklyError || monthlyError;
  const noData = timeSeries && timeSeries.length === 0;

  useEffect(() => {
    if (timeSeries && !isLoading && !hasError) {
      setChartData({
        labels: timeSeries.map((entry) => new Date(entry.date).toLocaleString()),
        datasets: [
          {
            label: `${symbol} Stock Price`,
            data: timeSeries.map((entry) => entry.adjusted_close ? entry.adjusted_close : entry.close),
            borderColor: noData ? "rgba(169, 169, 169, 1)" : "rgba(75, 192, 192, 1)", // Grayed out if no data
            backgroundColor: noData ? "rgba(169, 169, 169, 0.2)" : "rgba(75, 192, 192, 0.2)", // Grayed out if no data
            fill: false,
            pointRadius: 0,
          },
        ],
      });
    }
  }, [isLoading, hasError, timeFrame, noData]);

  return (
    <div className=".parent">
      {noData ? (
        <Typography 
          variant="h6" 
          fontSize="18px"
          textAlign="center" 
        >No data available for this range</Typography>
      ) : chartData ? (
        <Line
          data={chartData}
          className="chart"
          options={{
            interaction: {
              mode: "index", // Activates tooltip for the nearest x-axis point
              axis: "x", // Cursor movement along the x-axis triggers tooltips
              intersect: false, // Allows hovering even if not directly on a point
            },
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              x: {
                display: false,
                ticks: {
                  maxTicksLimit: 10, // Limits the number of ticks
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Stock Price (USD)",
                },
              },
            },
          }}
        />
      ) : null}

      <div className="buttons">
        {["1d", "1w", "1m", "3m", "1y", "5y"].map((frame) => (
          <button
            key={frame}
            onClick={() => setTimeFrame(frame)}
            style={{
              padding: "8px 12px",
              margin: "4px",
              backgroundColor: timeFrame === frame ? "#007bff" : "#e0e0e0",
              color: timeFrame === frame ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {frame.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
