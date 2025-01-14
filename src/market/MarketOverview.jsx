import { TickerProvider } from "./context/TickerContext";
import "./MarketOverview.css";
import TickerOverview from "./widgets/TickerOverview";

export default function MarketOverview(){
    return <div className="tickers">
        <TickerProvider symbol="AAPL">
            <TickerOverview/>
        </TickerProvider>
        <TickerProvider symbol="GOOGL">
            <TickerOverview/>
        </TickerProvider>
        <TickerProvider symbol="IBM">
            <TickerOverview/>
        </TickerProvider>
    </div>
}