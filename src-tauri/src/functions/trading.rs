use std::thread::spawn;

use chrono::{DateTime, FixedOffset};
use tauri::{self, State};

use crate::state::AppState;

#[tauri::command]
pub async fn purchase_shares(state: State<'_, AppState>, symbol: &str, quantity: f64, account_id: u32, date_time: DateTime<FixedOffset>) -> Result<(), String>{
    state.broker.lock().await
        .buy(symbol, quantity, account_id, Some(date_time))
        .await
        .map_err(|e| format!("{:?}", e))?;
    
    let _ = state.save().await;
    Ok(())
}

#[tauri::command]
pub async fn sell_shares(state: State<'_, AppState>, symbol: &str, quantity: f64, account_id: u32, date_time: DateTime<FixedOffset>) -> Result<(), String>{
    state.broker.lock().await
        .sell(symbol, quantity, account_id, Some(date_time))
        .await
        .map_err(|e| format!("{:?}", e))?;
    
    let _ = state.save().await;
    Ok(())
}