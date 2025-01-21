import { invoke } from "@tauri-apps/api/core";

export default async function refreshIntraday(
    symbol
){
    try{
        await invoke("refresh_intraday_cache", {
            "symbol": symbol
        });
    } catch (error){
        console.error(error);
    }
}