import React, { createContext, useContext, useState, useCallback } from 'react';
import { invoke } from "@tauri-apps/api/core";

const AccountsContext = createContext();

export function AccountsProvider({ children }) {
    const [checkingAccounts, setCheckingAccounts] = useState([]);
    const [investmentAccounts, setInvestmentAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [checking, investment] = await Promise.all([
                invoke("get_checking_accounts", {}),
                invoke("get_investment_accounts", {}),
            ]);
            setCheckingAccounts(checking);
            setInvestmentAccounts(investment);
        } catch (err) {
            console.error("Error fetching accounts:", err);
            setError("Failed to fetch accounts. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AccountsContext.Provider value={{ checkingAccounts, investmentAccounts, loading, error, fetchAccounts }}>
            {children}
        </AccountsContext.Provider>
    );
}

export function useAccounts() {
    return useContext(AccountsContext);
}