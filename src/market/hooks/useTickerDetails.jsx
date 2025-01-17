import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";


export default function useTickerDetails(symbol) {
    const [tickerDetails, setTickerDetails] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setError(null);
            setLoading(true);
            try {
                const details = await invoke("get_ticker", { symbol });
                setTickerDetails(details);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [symbol]);

    return { tickerDetails, loading, error };
}