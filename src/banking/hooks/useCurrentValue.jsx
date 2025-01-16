import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";


export default function useCurrentValue(ticker, quantity, date_limit) {
    const [currentValue, setCurrentValue] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await invoke("get_current_value", { symbol: ticker, quantity: quantity, "dateLimit": date_limit });
                setCurrentValue(result);
            } catch (err) { 
                console.error(err);
                setError(err.message || "Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ticker, quantity, date_limit]);

    return { currentValue, loading, error };
}