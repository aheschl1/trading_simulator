import { useState } from "react";
import { TickerProvider } from "./context/TickerContext";
import "./MarketOverview.css";
import TickerOverview from "./widgets/TickerOverview";
import { TextField, Card, CardContent, Typography } from '@mui/material';


export default function MarketOverview() {

    const [searchResults, setSearchResults] = useState([]);

    const onSearchChange = (e) => {
        const searchValue = e.target.value;
        if (searchValue.length > 0) {
            const results = [
                {
                    symbol: "AAPL",
                    name: "Apple Inc.",
                    stock_type: "Equity",
                    region: "United States",
                    market_open: "09:30",
                    market_close: "16:00",
                    timezone: "EST",
                    currency: "USD",
                    match_score: 0.95
                },
                {
                    symbol: "MSFT",
                    name: "Microsoft Corporation",
                    stock_type: "Equity",
                    region: "United States",
                    market_open: "09:30",
                    market_close: "16:00",
                    timezone: "EST",
                    currency: "USD",
                    match_score: 0.92
                }
            ];
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }

    return <div className="market-overview">
        <div className="search">
            <TextField
                id="search-bar"
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={onSearchChange}
            />
            <div className="search-results">
                {searchResults.map((result, index) => (
                    <Card
                        key={index}
                        variant="outlined"
                        sx={{
                            marginBottom: 2, // Improved spacing
                            width: "100%",
                            boxShadow: 1, // Subtle shadow for depth
                            borderRadius: 2, // Rounded corners
                            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out", // Hover effect
                            '&:hover': {
                                transform: "scale(1.02)", // Slight scale-up on hover
                                boxShadow: 3, // Stronger shadow on hover
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                                {result.symbol}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {result.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {result.region}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
        <div className="tickers">
            <TickerProvider symbol="GOOGL">
                <TickerOverview />
            </TickerProvider>
            <TickerProvider symbol="IBM">
                <TickerOverview />
            </TickerProvider>
        </div>
    </div>
}