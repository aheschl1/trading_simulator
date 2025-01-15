import { useState } from "react";
import { TickerProvider } from "./context/TickerContext";
import "./MarketOverview.css";
import TickerOverview from "./widgets/TickerOverview";
import { TextField, Card, CardContent, Typography } from '@mui/material';
import useSearchResults from "./hooks/useSearchResults";
import useFavoriteTickers, { addFavoriteTicker } from "./hooks/useFavoriteTickers";


export default function MarketOverview() {

    const [searchValue, setSearchValue] = useState("");
    const {searchResults, loading: searchLoading, error: searchError} = useSearchResults(searchValue);
    const {favoriteTickers, loading: favoriteLoading, error: favoriteError, setFavoriteTickers} = useFavoriteTickers();


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
                        marginBottom: 2,
                        width: "98%",
                        boxShadow: 1,
                        borderRadius: 2,
                        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        '&:hover': {
                            transform: "scale(1.02)",
                            boxShadow: 3,
                        },
                        minHeight: 120,
                    }}
                    onClick={() => {
                        addFavoriteTicker(result.symbol);
                        setFavoriteTickers([...favoriteTickers, result]);
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
                            Region: {result.region}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Currency: {result.currency}
                        </Typography>
                    </CardContent>
                </Card>                
                ))}
            </div>
        </div>
        <div className="tickers">
            {favoriteLoading && <Typography variant="body1">Loading...</Typography>}
            {favoriteError && <Typography variant="body1" color="error">{favoriteError}</Typography>}
            {!favoriteLoading && !favoriteError && favoriteTickers.length === 0 && <Typography variant="body1">No favorite tickers</Typography>}
            {!favoriteLoading && !favoriteError && favoriteTickers.map((ticker, index) => {
                return <TickerProvider key={index} symbol={ticker.symbol}>
                    <TickerOverview />
                </TickerProvider>
            })}
        </div>
    </div>
}