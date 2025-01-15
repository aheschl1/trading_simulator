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
    Ok(())
}