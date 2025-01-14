import React, { createContext, useState, useEffect } from 'react';

const SimulatedDateContext = createContext();

export function SimulatedDateProvider({ children }) {
    const now = new Date(); // Current date and time
    const twentyFourHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const [simulatedDate, setSimulatedDate] = useState(twentyFourHoursAgo);

    useEffect(() => {
        const interval = setInterval(() => {
            setSimulatedDate((prevDate) => {
                const newDate = new Date(prevDate.getTime() + 60 * 1000); // Add 1 minute
                return newDate;
            });
        }, 60000); // Interval of 60000 ms (1 minute)
        return () => clearInterval(interval);
    }, []); 

    return (
        <SimulatedDateContext.Provider value={{ simulatedDate, setSimulatedDate }}>
            {children}
        </SimulatedDateContext.Provider>
    );
}

export function useSimulatedDate() {
    return React.useContext(SimulatedDateContext);
}

export default SimulatedDateContext;
