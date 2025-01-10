use state::AppState;
use tauri::State;
use trading_engine::bank::accounts::{AccountType, CheckingAccount, InvestmentAccount};
mod utils;
mod state;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn get_checking_accounts(state: State<'_, AppState>) -> Result<Vec<CheckingAccount>, String> {
    let accounts = state
        .bank.lock().await
        .get_checking_accounts()
        .iter()
        .map(|(_, account)| account.clone())
        .collect();
    Ok(accounts)
}

#[tauri::command]
async fn get_investment_accounts(state: State<'_, AppState>) -> Result<Vec<InvestmentAccount>, String> {
    let accounts = state
        .bank.lock().await
        .get_investment_accounts()
        .iter()
        .map(|(_, account)| account.clone())
        .collect();
    Ok(accounts)
}

#[tauri::command]
async fn create_checking_account(state: State<'_, AppState>, name: String) -> Result<(), String>{
    state.bank
        .lock().await
        .open_account(Some(name), AccountType::Checking)
        .map_err(|e| e.to_string())?;
    let _ = state.save().await;
    Ok(())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = AppState::new();

    tauri::Builder::default()
        .manage(app_state)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_checking_accounts, get_investment_accounts, create_checking_account])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
