import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
 // const results = [
//     {
//         symbol: "AAPL",
//         name: "Apple Inc.",
//         stock_type: "Equity",
//         region: "United States",
//         market_open: "09:30",
//         market_close: "16:00",
//         timezone: "EST",
//         currency: "USD",
//         match_score: 0.95
//     },
//     {
//         symbol: "MSFT",
//         name: "Microsoft Corporation",
//         stock_type: "Equity",
//         region: "United States",
//         market_open: "09:30",
//         market_close: "16:00",
//         timezone: "EST",
//         currency: "USD",
//         match_score: 0.92
//     }
// ];

export default function useSearchResults(searchValue){
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try{
                const results = await invoke("get_tickers", { query: searchValue });
                setSearchResults(results["entries"]);
            } catch (error) {
                setError(error); 
            } finally {
                setLoading(false);
            }
        }
        if (searchValue.length > 0) {
            fetchSearchResults();
        } else {
            setSearchResults([]);
        }
    }, [searchValue]);

    return {searchResults, loading, error};
}