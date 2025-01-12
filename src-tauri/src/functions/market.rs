use alphavantage::time_series::IntradayInterval;
use tauri::{self, State};

use crate::state::AppState;

#[tauri::command]
pub async fn get_time_series_daily_full(state: State<'_, AppState>, symbol: String) -> Result<String, String> {
    let time_series = 
        state.broker.lock().await
        .get_time_series_daily_full(&symbol).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(serde_json::to_string(&time_series).map_err(|e| format!("{:?}", e))?)
}

#[tauri::command]
pub async fn get_time_series_weekly_full(state: State<'_, AppState>, symbol: String) -> Result<String, String> {
    let time_series = 
        state.broker.lock().await
        .get_time_series_weekly_full(&symbol).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(serde_json::to_string(&time_series).map_err(|e| format!("{:?}", e))?)
}

#[tauri::command]
pub async fn get_time_series_monthly_full(state: State<'_, AppState>, symbol: String) -> Result<String, String> {
    let time_series = 
        state.broker.lock().await
        .get_time_series_monthly_full(&symbol).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(serde_json::to_string(&time_series).map_err(|e| format!("{:?}", e))?)
}

#[tauri::command]
pub async fn get_time_series_intraday(state: State<'_, AppState>, symbol: String, interval: IntradayInterval) -> Result<String, String> {
    let time_series = 
        state.broker.lock().await
        .get_time_series_intraday(&symbol, interval).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(serde_json::to_string(&time_series).map_err(|e| format!("{:?}", e))?)
}