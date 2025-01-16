use alphavantage::{cache_enabled::{tickers::SearchResults, time_series::TimeSeries}, time_series::IntradayInterval};
use chrono::{format::{self, Fixed}, DateTime, FixedOffset};
use tauri::{self, State};

use crate::state::AppState;

#[tauri::command]
pub async fn get_time_series_daily_full(state: State<'_, AppState>, symbol: String) -> Result<TimeSeries, String> {
    let time_series = 
        state.broker.lock().await
        .get_time_series_daily_full(&symbol).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(time_series)
}

#[tauri::command]
pub async fn get_time_series_weekly_full(state: State<'_, AppState>, symbol: String) -> Result<TimeSeries, String> {
    let time_series = 
        state.broker.lock().await
        .get_time_series_weekly_full(&symbol).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(time_series)
}

#[tauri::command]
pub async fn get_time_series_monthly_full(state: State<'_, AppState>, symbol: String) -> Result<TimeSeries, String> {
    let time_series = 
        state.broker.lock().await
        .get_time_series_monthly_full(&symbol).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(time_series)
}

#[tauri::command]
pub async fn get_time_series_intraday(state: State<'_, AppState>, symbol: String, interval: IntradayInterval) -> Result<TimeSeries, String> {
    let time_series = 
        state.broker.lock().await
        .get_time_series_intraday(&symbol, interval).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(time_series)
}

#[tauri::command]
pub async fn get_tickers(state: State<'_, AppState>, query: String) -> Result<SearchResults, String> {
    let tickers = 
        state.broker.lock().await
        .get_tickers(&query).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(tickers)
}

#[tauri::command]
pub async fn get_current_price(state: State<'_, AppState>, symbol: String, date_limit: DateTime<FixedOffset>) -> Result<f64, String> {
    let price = 
        state.broker.lock().await
        .get_price(&symbol, Some(date_limit)).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(price)
}