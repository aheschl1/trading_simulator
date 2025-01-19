import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";


export default function useCompanyNews(symbol) {
    const [companyNews, setCompanyNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setError(null);
            setLoading(true);
            try {
                const result = await invoke("get_company_news", { symbol });
                setCompanyNews(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, [symbol]);

    return { companyNews, loading, error };
}