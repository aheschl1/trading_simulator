import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAccounts } from "../context/AccountContext";

export default function createAccount() {

    const { fetchAccounts } = useAccounts();

    const addCheckingAccount = async (name) => {
        try {
            await invoke("create_checking_account", { name });
            await fetchAccounts(); // Refresh accounts after adding
            return true;
        } catch (err) {
            console.error("Error adding checking account:", err);
            setError("Failed to add account. Please try again.");
            return false;
        }
    };

    const addInvestmentAccount = async (name) => {
        try {
            await invoke("create_investment_account", { name });
            await fetchAccounts();
            return true;
        } catch (err) {
            console.error("Error adding investment account:", err);
            setError("Failed to add account. Please try again.");
            return false;
        }
    };

    return {
        addCheckingAccount,
        addInvestmentAccount,
    };
}
