import { useState } from "react";
import { TickerProvider } from "./context/TickerContext";
import "./MarketOverview.css";
import TickerOverview from "./widgets/TickerOverview";
import { TextField, Card, CardContent, Typography } from '@mui/material';
import useSearchResults from "./hooks/useSearchResults";


export default function MarketOverview() {

    const [searchValue, setSearchValue] = useState("");
    const {searchResults, loading: searchLoading, error: searchError} = useSearchResults(searchValue); 

    return <div className="market-overview">
        <div className="search">
            <TextField
                id="search-bar"
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e)=>setSearchValue(e.target.value)}
            />
            <div className="search-results">
                {searchLoading && <Typography variant="body1">Loading...</Typography>}
                {searchError && <Typography variant="body1" color="error">{searchError}</Typography>}
                {!searchLoading && !searchError && searchResults.map((result, index) => (
                    <Card
                        key={index}
                        variant="outlined"
                        sx={{
                            marginBottom: 2, // Improved spacing
                            width: "90%",
                            boxShadow: 1, // Subtle shadow for depth
                            borderRadius: 2, // Rounded corners
                            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out", // Hover effect
                            '&:hover': {
                                transform: "scale(1.02)", // Slight scale-up on hover
                                boxShadow: 3, // Stronger shadow on hover
                            },
                            minHeight: 100 // Improved spacing
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