import React, { useState, useEffect } from "react";
import { useSimulatedDate } from "../contexts/SimulatedDateContext";

export default function DigitalClock() {

    const getOrdinalSuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return "th";
        }
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    const formatDateWithDay = (date) => {
        const options = { weekday: "long", month: "long", day: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

        // Customize to add "the"
        const [weekday, month, day] = formattedDate.split(" ");
        const dayWithOrdinal = `${day}${getOrdinalSuffix(parseInt(day))}`;

        return `${month} ${weekday} the ${dayWithOrdinal}`;
    };

    const { simulatedDate } = useSimulatedDate();
    const [displayTime, setDisplayTime] = useState(simulatedDate);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayTime((oldTime) => {
                return new Date(oldTime.getTime() + 1000); // Add 1 second
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,  // Optional: Use 12-hour format
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div style={{
            fontSize: "20px",
            color: "black",
            backgroundColor: "#f0f0f0", // Light grey color
            padding: "16px",
            borderRadius: "8px",
            textAlign: "center",
            maxWidth: "250px",
            margin: "auto"
        }}>
            {/* Top row - Date */}
            <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
                {formatDateWithDay(displayTime)}
            </div>
            
            {/* Bottom row - Time */}
            <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                {formatTime(displayTime)}
            </div>
        </div>
    );
}
