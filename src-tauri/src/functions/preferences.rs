use chrono::{DateTime, FixedOffset, Utc};
use tauri::State;
use trading_engine::bank::stock::Asset;

use crate::state::AppState;


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