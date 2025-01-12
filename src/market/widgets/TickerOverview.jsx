import { 
    ONE_MINUTE, 
    FIFTEEN_MINUTES, 
    FIVE_MINUTES,SIXTY_MINUTES,
    THIRTY_MINUTES, 
    getTimeSeriesDailyFull,
    getTimeSeriesIntraday, 
    getTimeSeriesWeeklyFull,
    getTimeSeriesMonthlyFull
} from "../hooks/useTimeSeries" 



export default function TickerOverview({ticker}){
    let timeSeriesIntraday =  getTimeSeriesIntraday(ticker, THIRTY_MINUTES)
    let timeSeriesDaily = getTimeSeriesDailyFull(ticker);
    let timeSeriesWeekly = getTimeSeriesWeeklyFull(ticker);
    let timeSeriesMonthly = getTimeSeriesMonthlyFull(ticker);

    return <div>
        <h1>ticker</h1>
    </div>
}