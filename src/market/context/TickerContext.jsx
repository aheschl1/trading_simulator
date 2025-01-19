import { createContext } from "react";
import { 
    getTimeSeriesIntraday,
    getTimeSeriesDailyFull,
    getTimeSeriesWeeklyFull,
    getTimeSeriesMonthlyFull,
    SIXTY_MINUTES,
    FIVE_MINUTES
} from "../hooks/useTimeSeries";
import { useContext } from "react";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";
import useTickerDetails from "../hooks/useTickerDetails";
import useCompanyProfile from "../hooks/useCompanyProfile";


const TickerContext = createContext()

export function TickerProvider({ children, symbol}) {
    const { data: intradayFiveMinuteData, loading: intradayFiveMinuteLoading, error: intradayFiveMinuteError } = getTimeSeriesIntraday(symbol, FIVE_MINUTES);
    const { data: intradaySixtyMinuteData, loading: intradaySixtyMinuteLoading, error: intradaySixtyMinuteError } = getTimeSeriesIntraday(symbol, SIXTY_MINUTES);
    const { data: dailyData, loading: dailyLoading, error: dailyError } = getTimeSeriesDailyFull(symbol);
    const { data: weeklyData, loading: weeklyLoading, error: weeklyError } = getTimeSeriesWeeklyFull(symbol);
    const { data: monthlyData, loading: monthlyLoading, error: monthlyError } = getTimeSeriesMonthlyFull(symbol);
    const { companyProfile, loading: companyProfileLoading, error: companyProfileError } = useCompanyProfile(symbol);
    const { tickerDetails, loading: tickerDetailsLoading, error: tickerDetailsError } = useTickerDetails(symbol);

    const isLoading =intradayFiveMinuteLoading || dailyLoading || weeklyLoading || monthlyLoading;
    const hasError = intradayFiveMinuteError || dailyError || weeklyError || monthlyError;

    return <TickerContext.Provider value={{
        intradayFiveMinuteData,
        dailyData,
        weeklyData,
        monthlyData,
        intradayFiveMinuteLoading,
        dailyLoading,
        weeklyLoading,
        monthlyLoading,
        intradayFiveMinuteError,
        intradaySixtyMinuteData,
        intradaySixtyMinuteLoading,
        intradaySixtyMinuteError,
        dailyError,
        weeklyError,
        monthlyError,
        isLoading,
        hasError,
        symbol,
        tickerDetails,
        tickerDetailsLoading,
        tickerDetailsError,
        companyProfile,
        companyProfileLoading,
        companyProfileError
    }}>{children}</TickerContext.Provider>
}

export function useTicker(){
    return useContext(TickerContext)
}