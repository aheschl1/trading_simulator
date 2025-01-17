use std::thread::spawn;

use alphavantage::{cache_enabled::{tickers::{Entry, SearchResults}, time_series::TimeSeries}, time_series::IntradayInterval};
use chrono::{format::{self, Fixed}, DateTime, FixedOffset};
use tauri::{self, State};

use crate::{state::AppState, utils::expand_tilde};

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


/// Get the tickers for a given query
/// 
/// This function fetches the tickers from the broker and caches them individually in the background
/// 
/// # Arguments
/// 
/// * `query` - The query to search for
/// 
/// # Returns
/// 
/// The search results for the given query
#[tauri::command]
pub async fn get_tickers(state: State<'_, AppState>, query: String) -> Result<SearchResults, String> {
    let tickers = 
        state.broker.lock().await
        .get_tickers(&query).await
        .map_err(|e| format!("{:?}", e))?;

    let to_cache = tickers.entries.clone();
    spawn(move || {
        // cache all the tickers in the background to ~/.cache/trading_simulator/tickers
        for entry in to_cache {
            let path  = expand_tilde("~/.cache/trading_simulator/tickers")
                .join(format!("{}.json", entry.symbol));
            // make sure the directory exists
            let _ = std::fs::create_dir_all(path.parent().unwrap());
            let json = serde_json::to_string(&entry).unwrap();
            let _ = std::fs::write(path, json);
        }    
    });

    Ok(tickers)
}


/// Get the ticker for a given symbol
/// 
/// This function first checks the cache for the ticker, and if it doesn't exist, it fetches the tickers
/// 
/// # Arguments
/// 
/// * `symbol` - The symbol of the ticker to fetch
/// 
/// # Returns
/// 
/// The ticker for the given symbol
/// 
/// # Errors
/// 
/// If the symbol is not found, an error is returned
#[tauri::command]
pub async fn get_ticker(state: State<'_, AppState>, symbol: String) -> Result<Entry, String> {
    // first check the cache
    let path = expand_tilde("~/.cache/trading_simulator/tickers")
        .join(format!("{}.json", symbol));
    if path.exists() {
        let json = std::fs::read_to_string(path).map_err(|e| format!("{:?}", e))?;
        let entry: Entry = serde_json::from_str(&json).map_err(|e| format!("{:?}", e))?;
        return Ok(entry);
    }
    // no cache hit, so load the tickers and filter
    let tickers: Vec<alphavantage::cache_enabled::tickers::Entry> = 
        state.broker.lock().await
        .get_tickers(&symbol).await
        .map_err(|e| format!("{:?}", e))?
        .entries
        .into_iter()
        .filter(|entry| entry.symbol == symbol)
        .collect();
    if tickers.len() != 1 {
        return Err(format!("No ticker found for symbol: {}", symbol));
    }
    let result = tickers[0].clone();
    // cache the result
    spawn(move || {
        let path = expand_tilde("~/.cache/trading_simulator/tickers")
            .join(format!("{}.json", symbol));
        let json = serde_json::to_string(&result).unwrap();
        let _ = std::fs::create_dir_all(path.parent().unwrap());
        let _ = std::fs::write(path, json);
    });
    Ok(tickers[0].clone())
}

#[tauri::command]
pub async fn get_current_price(state: State<'_, AppState>, symbol: String, date_limit: DateTime<FixedOffset>) -> Result<f64, String> {
    let price = 
        state.broker.lock().await
        .get_price(&symbol, Some(date_limit)).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(price)
}