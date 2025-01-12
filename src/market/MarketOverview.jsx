import "./MarketOverview.css";
import TickerOverview from "./widgets/TickerOverview";

export default function MarketOverview(){
    return <div className="tickerGrid">
        <TickerOverview ticker="AAPL"/>
        <TickerOverview ticker="GOOGL"/>
    </div>
}