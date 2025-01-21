use std::thread::spawn;

use alphavantage::{cache_enabled::{tickers::{Entry, SearchResults}, time_series::TimeSeries}, time_series::IntradayInterval};
use chrono::{format::{self, Fixed}, DateTime, FixedOffset};
use disk_cache::cache_async;
use finnhub_rs::types::CompanyProfile;
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
    let ticker = 
        state.broker.lock().await
        .get_ticker(symbol.clone()).await
        .map_err(|e| format!("{:?}", e))?.map_err(|e| format!("{:?}", e))?;
    Ok(ticker)
}

#[tauri::command]
pub async fn get_current_price(state: State<'_, AppState>, symbol: String) -> Result<f64, String> {
    let date_limit = state.get_simulated_date_utc();
    let price = 
        state.broker.lock().await
        .get_price(&symbol, Some(date_limit.into())).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(price)
}

/// This is a cached call to the finnhub company profile
#[cache_async(cache_root = "~/.cache/finnhub/company_profile/{symbol}", invalidate_rate = 1210000)]
async fn get_company_profile_cached(state: State<'_, AppState>, symbol: String) -> Result<CompanyProfile, String> {
    let company_profile = 
        state.finnhub_client
        .company_profile2(finnhub_rs::types::ProfileToParam::Symbol, symbol).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(company_profile.0)
}

#[tauri::command]
pub async fn get_company_profile(state: State<'_, AppState>, symbol: String) -> Result<CompanyProfile, String> {
    let result = get_company_profile_cached(state, symbol)
        .await.map_err(|e| format!("{e:?}"))??;
    Ok(result)
}

/// Get the company news for a given symbol, cached
#[cache_async(cache_root = "~/.cache/finnhub/company_news/{symbol}", invalidate_rate = 86400)]
async fn get_company_news_cached(state: State<'_, AppState>, symbol: String) -> Result<Vec<finnhub_rs::types::CompanyNews>, String> {
    let simulated_date = state.get_simulated_date_utc();
    // 3 days ago
    let from = simulated_date - chrono::Duration::days(3);
    let from: String = from.format("%Y-%m-%d").to_string();
    let to = simulated_date.format("%Y-%m-%d").to_string();

    let news = 
        state.finnhub_client
        .company_news(symbol, from, to).await
        .map_err(|e| format!("{:?}", e))?;
    Ok(news.0)
}

#[tauri::command]
pub async fn get_company_news(state: State<'_, AppState>, symbol: String) -> Result<Vec<finnhub_rs::types::CompanyNews>, String> {
    let result = get_company_news_cached(state, symbol)
        .await.map_err(|e| format!("{e:?}"))??;
    Ok(result)
}