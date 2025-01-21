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

        return `${weekday} the ${dayWithOrdinal} of ${month}`;
    };

    const { simulatedDate } = useSimulatedDate();
    const [displayTime, setDisplayTime] = useState(simulatedDate);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayTime((oldTime) => new Date(oldTime.getTime() + 1000)); // Add 1 second
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <div
            style={{
                fontSize: "24px",
                color: "#333",
                backgroundColor: "#f9f9f9", // Softer grey background
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                maxWidth: "300px",
                margin: "20px auto",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                fontFamily: "'Roboto', sans-serif", // Clean font style
            }}
        >
            {/* Top row - Date */}
            <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}>
                {formatDateWithDay(displayTime)}
            </div>

            {/* Bottom row - Time */}
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#0078D4" }}>
                {formatTime(displayTime)}
            </div>

            {/* Message saying - simulation 24h behind */}
            <div style={{ fontSize: "14px", marginTop: "8px" }}>
                Simulation time is 24 hours behind real time.
            </div>
        </div>
    );
}
