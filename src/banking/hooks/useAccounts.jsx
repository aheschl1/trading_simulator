import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function useAccounts() {
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

    const addCheckingAccount = useCallback(async (name) => {
        try {
            await invoke("create_checking_account", { name });
            await fetchAccounts(); // Refresh accounts after adding
            return true;
        } catch (err) {
            console.error("Error adding checking account:", err);
            setError("Failed to add account. Please try again.");
            return false;
        }
    }, [fetchAccounts]);

    const addInvestmentAccount = useCallback(async (name) => {
        try {
            await invoke("create_investment_account", { name });
            await fetchAccounts();
            return true;
        } catch (err) {
            console.error("Error adding investment account:", err);
            setError("Failed to add account. Please try again.");
            return false;
        }
    });

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return {
        checkingAccounts,
        investmentAccounts,
        addCheckingAccount,
        addInvestmentAccount,
        loading,
        error,
    };
}
