use std::rc;

use chrono::{DateTime, FixedOffset, Utc};
use tauri::State;
use trading_engine::bank::stock::Asset;

use crate::state::AppState;
use crate::utils;


#[tauri::command]
pub async fn get_favorite_tickers(state: State<'_, AppState>) -> Result<Vec<Asset>, String> {
    Ok(state.favorite_tickers.lock().await.clone())
}

#[tauri::command]
pub async fn add_favorite_ticker(state: State<'_, AppState>, symbol: String) -> Result<(), String> {
    let ticker = Asset::new(symbol);
    state.favorite_tickers.lock().await.push(ticker);
    let _ = state.save().await;
    Ok(())
}

#[tauri::command]
pub async fn remove_favorite_ticker(state: State<'_, AppState>, symbol: String) -> Result<(), String> {
    let mut favorite_tickers = state.favorite_tickers.lock().await;
    favorite_tickers.retain(|ticker| ticker.symbol != symbol);
    drop(favorite_tickers);
    let _ = state.save().await;
    Ok(())
}

#[tauri::command]
pub async fn get_simulated_date_utc(state: State<'_, AppState>) -> Result<DateTime<Utc>, String> {
    // convert to fixed offset
    Ok(state.get_simulated_date_utc())
}

#[tauri::command]
pub async fn refresh_intraday_cache(state: State<'_, AppState>, symbol: String) -> Result<(), String> {
    const CACHE_ROOT: &str = "~/.cache/alphavantage/get_time_series_intraday";
    let cache_path_b = utils::expand_tilde(format!("{}/{}_OneMinute", CACHE_ROOT, symbol).as_str());
    let cache_path_c = utils::expand_tilde(format!("{}/{}_FiveMinutes", CACHE_ROOT, symbol).as_str());
    let cache_path_a = utils::expand_tilde(format!("{}/{}_ThirtyMinutes", CACHE_ROOT, symbol).as_str());
    let cache_path_d = utils::expand_tilde(format!("{}/{}_SixtyMinutes", CACHE_ROOT, symbol).as_str());
    // if folder exists, delete it
    let ra = std::fs::remove_dir_all(&cache_path_a);
    let rb = std::fs::remove_dir_all(&cache_path_b);
    let rc = std::fs::remove_dir_all(&cache_path_c);
    let rd = std::fs::remove_dir_all(&cache_path_d);

    // if all remove operations are failures, return an error
    if ra.is_err() && rb.is_err() && rc.is_err() && rd.is_err() {
        return Err("Failed to remove cache directories".to_string());
    }

    Ok(())
}