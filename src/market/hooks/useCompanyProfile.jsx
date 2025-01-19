import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";


export default function useCompanyProfile(symbol) {
    const [companyProfile, setCompanyProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setError(null);
            setLoading(true);
            try {
                const result = await invoke("get_company_profile", { symbol });
                setCompanyProfile(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [symbol]);

    return { companyProfile, loading, error };
}