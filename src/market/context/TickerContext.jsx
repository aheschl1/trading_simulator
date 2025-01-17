import { createContext } from "react";
import { 
    getTimeSeriesIntraday,
    getTimeSeriesDailyFull,
    getTimeSeriesWeeklyFull,
    getTimeSeriesMonthlyFull,
    THIRTY_MINUTES 
} from "../hooks/useTimeSeries";
import { useContext } from "react";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";
import useTickerDetails from "../hooks/useTickerDetails";


const TickerContext = createContext()

export function TickerProvider({ children, symbol}) {
    const { data: intradayData, loading: intradayLoading, error: intradayError } = getTimeSeriesIntraday(symbol, THIRTY_MINUTES);
    const { data: dailyData, loading: dailyLoading, error: dailyError } = getTimeSeriesDailyFull(symbol);
    const { data: weeklyData, loading: weeklyLoading, error: weeklyError } = getTimeSeriesWeeklyFull(symbol);
    const { data: monthlyData, loading: monthlyLoading, error: monthlyError } = getTimeSeriesMonthlyFull(symbol);
    const { tickerDetails, loading: tickerDetailsLoading, error: tickerDetailsError } = useTickerDetails(symbol);

    const isLoading =intradayLoading || dailyLoading || weeklyLoading || monthlyLoading;
    const hasError = intradayError || dailyError || weeklyError || monthlyError;

    return <TickerContext.Provider value={{
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
        isLoading,
        hasError,
        symbol,
        tickerDetails,
        tickerDetailsLoading,
        tickerDetailsError
    }}>{children}</TickerContext.Provider>
}

export function useTicker(){
    return useContext(TickerContext)
}