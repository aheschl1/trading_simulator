import { invoke } from '@tauri-apps/api/core';
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const FavoritesContext = createContext();


// Create a provider component
export const FavoritesProvider = ({ children }) => {
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

    const addFavorite = (symbol) => {
        const addTicker = async () => {
            try {
                await invoke("add_favorite_ticker", { "symbol": symbol });
            } catch (error) {
                console.error("Failed to add favorite ticker:", error);
            }
        };
        addTicker();
        setFavoriteTickers([...favoriteTickers, {"symbol": symbol}]);
    };

    const removeFavorite = (symbol) => {
        const removeTicker = async () => {
            try {
                await invoke("remove_favorite_ticker", { "symbol": symbol });
            } catch (error) {
                console.error("Failed to remove favorite ticker:", error);
            }
        };
    
        removeTicker();
        setFavoriteTickers(favoriteTickers.filter(fav => fav.symbol != symbol));
    };

    return (
        <FavoritesContext.Provider value={{ favoriteTickers, error, loading, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Create a custom hook to use the FavoritesContext
export const useFavorites = () => {
    return useContext(FavoritesContext);
};
