import React, { createContext, useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

const SimulatedDateContext = createContext();

export function SimulatedDateProvider({ children }) {

    const now = new Date(); // Current date and time
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [simulatedDate, setSimulatedDate] = useState(twentyFourHoursAgo);


    useEffect(() => {
        async function fetchSimulatedDate() {
            try {
                const response = await invoke('get_simulated_date_utc');
                const newDate = new Date(response);
                setSimulatedDate(newDate);
            } catch (error) {
                console.error('Failed to fetch simulated date:', error);
            }
        }
 
        fetchSimulatedDate(); // Initial fetch

        const interval = setInterval(fetchSimulatedDate, 60 * 1000); // Fetch every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <SimulatedDateContext.Provider value={{ simulatedDate }}>
            {children}
        </SimulatedDateContext.Provider>
    );
}

export function useSimulatedDate() {
    return React.useContext(SimulatedDateContext);
}

export default SimulatedDateContext;
