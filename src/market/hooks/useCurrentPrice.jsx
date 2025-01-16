import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";


export default function useCurrentPrice(symbol, dateLimit) {
    const [currentPrice, setCurrentPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentPrice = async () => {
            setError(null);
            setLoading(true);
            try {
                const price = await invoke("get_current_price", { symbol, dateLimit });
                setCurrentPrice(price);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCurrentPrice();
    }, [symbol, dateLimit]);

    return { currentPrice, loading, error };
}