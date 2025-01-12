
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export const ONE_MINUTE = "OneMinute"
export const FIVE_MINUTES = "FiveMinutes"
export const FIFTEEN_MINUTES = "FifteenMinutes"
export const THIRTY_MINUTES = "ThirtyMinutes"
export const SIXTY_MINUTES = "SixtyMinutes"

export function getTimeSeriesIntraday(ticker, interval){
    const [timeSeries, setTimeSeries] = useState([])

    useEffect(() => {
        const fetchTimeSeries = async () => {
            const timeSeries = await invoke("get_time_series_intraday", {"symbol": ticker, interval})
            setTimeSeries(timeSeries)
        }
        fetchTimeSeries()
    }, [ticker, interval])

    return timeSeries
}

export function getTimeSeriesDailyFull(ticker){
    const [timeSeries, setTimeSeries] = useState([])

    useEffect(() => {
        const fetchTimeSeries = async () => {
            const timeSeries = await invoke("get_time_series_daily_full", {"symbol": ticker})
            setTimeSeries(timeSeries)
        }
        fetchTimeSeries()
    }, [ticker])

    return timeSeries
}

export function getTimeSeriesWeeklyFull(ticker){
    const [timeSeries, setTimeSeries] = useState([])

    useEffect(() => {
        const fetchTimeSeries = async () => {
            const timeSeries = await invoke("get_time_series_weekly_full", {"symbol": ticker})
            setTimeSeries(timeSeries)
        }
        fetchTimeSeries()
    }, [ticker])

    return timeSeries
}

export function getTimeSeriesMonthlyFull(ticker){
    const [timeSeries, setTimeSeries] = useState([])

    useEffect(() => {
        const fetchTimeSeries = async () => {
            const timeSeries = await invoke("get_time_series_monthly_full", {"symbol": ticker})
            setTimeSeries(timeSeries)
        }
        fetchTimeSeries()
    }, [ticker])

    return timeSeries
}

