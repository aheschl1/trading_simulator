use tauri::{self, State};

use crate::state::AppState;

#[tauri::command]
pub async fn get_market_data(state: State<'_, AppState>) -> Result<(), String> {
    Ok(())
}