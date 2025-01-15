import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export default function useFavoriteTickers() {
    const [favoriteTickers, setFavoriteTickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavoriteTickers = async () => {
            setLoading(true);
            try {
                const results = await invoke("get_favorite_tickers");
                setFavoriteTickers(results);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteTickers();
    }, []);

    return { favoriteTickers, setFavoriteTickers, loading, error };
}

export function addFavoriteTicker(ticker) {
    const addTicker = async () => {
        try {
            await invoke("add_favorite_ticker", { "symbol": ticker });
        } catch (error) {
            console.error("Failed to add favorite ticker:", error);
        }
    };

    addTicker();
}