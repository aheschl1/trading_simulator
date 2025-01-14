import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useTicker } from "../context/TickerContext";
import "./TickerChart.css";

export default function TickerChart (){

    const [timeFrame, setTimeFrame] = useState("1d");
    const [chartData, setChartData] = useState(null);
    const { 
        intradayData, 
        dailyData, 
        weeklyData, 
        monthlyData, 
        intradayLoading, 
        dailyLoading, 
        weeklyLoading, 
        monthlyLoading, 
        intradayError, 
        dailyError, 
        weeklyError, 
        monthlyError, 
        symbol 
    } = useTicker();

    const timeSeries = {
        "1d": intradayLoading ? undefined : intradayData.entries,
        "1w": dailyLoading ? undefined : dailyData.entries.slice(-7),
        "1m": dailyLoading ? undefined : dailyData.entries.slice(-30),
        "3m": weeklyLoading ? undefined : weeklyData.entries.slice(-13),
        "1y": weeklyLoading ? undefined : weeklyData.entries.slice(-52),
        "5y": monthlyLoading ? undefined : monthlyData.entries.slice(-60),
    }[timeFrame];
    const isLoading =intradayLoading || dailyLoading || weeklyLoading || monthlyLoading;
    const hasError = intradayError || dailyError || weeklyError || monthlyError;
    

    useEffect(() => {
        if (timeSeries && !isLoading && !hasError) {
          setChartData({
            labels: timeSeries.map((entry) => new Date(entry.date).toLocaleString()),
            datasets: [
              {
                label: `${symbol} Stock Price`,
                data: timeSeries.map((entry) => entry.adjusted_close ? entry.adjusted_close : entry.close),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
              },
            ],
          });
        }
      }, [isLoading, hasError, timeFrame]);

    return <div className=".parent">
    {chartData && 
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "top",
          }
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            title: {
              display: true,
              text: "Stock Price (USD)",
            },
          },
        },
      }}
    />}
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
}