import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export function useFetchTimeSeries(command, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await invoke(command, params);
        setData(result);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [command, JSON.stringify(params)]); // Include params in dependency array

  return { data, loading, error };
}

export const ONE_MINUTE = "OneMinute";
export const FIVE_MINUTES = "FiveMinutes";
export const FIFTEEN_MINUTES = "FifteenMinutes";
export const THIRTY_MINUTES = "ThirtyMinutes";
export const SIXTY_MINUTES = "SixtyMinutes";

export function getTimeSeriesIntraday(ticker, interval) {
  return useFetchTimeSeries("get_time_series_intraday", { symbol: ticker, interval });
}

export function getTimeSeriesDailyFull(ticker) {
  return useFetchTimeSeries("get_time_series_daily_full", { symbol: ticker });
}

export function getTimeSeriesWeeklyFull(ticker) {
  return useFetchTimeSeries("get_time_series_weekly_full", { symbol: ticker });
}

export function getTimeSeriesMonthlyFull(ticker) {
  return useFetchTimeSeries("get_time_series_monthly_full", { symbol: ticker });
}
