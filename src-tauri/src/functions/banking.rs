use crate::state::AppState;
use tauri::State;
use trading_engine::bank::accounts::{Account, AccountType, CheckingAccount, InvestmentAccount};

#[tauri::command]
pub async fn get_checking_accounts(state: State<'_, AppState>) -> Result<Vec<CheckingAccount>, String> {
    let accounts = state
        .bank
        .lock()
        .await
        .get_checking_accounts()
        .iter()
        .map(|(_, account)| account.clone())
        .collect();
    Ok(accounts)
}

#[tauri::command]
pub async fn get_investment_accounts(
    state: State<'_, AppState>,
) -> Result<Vec<InvestmentAccount>, String> {
    let accounts = state
        .bank
        .lock()
        .await
        .get_investment_accounts()
        .iter()
        .map(|(_, account)| account.clone())
        .collect();
    Ok(accounts)
}

#[tauri::command]
pub async fn create_checking_account(state: State<'_, AppState>, name: String) -> Result<(), String> {
    state
        .bank
        .lock()
        .await
        .open_account(Some(name), AccountType::Checking)
        .map_err(|e| e.to_string())?;
    let _ = state.save().await;
    Ok(())
}

#[tauri::command]
pub async fn create_investment_account(state: State<'_, AppState>, name: String) -> Result<(), String>{
    state
        .bank
        .lock()
        .await
        .open_account(Some(name), AccountType::Investment)
        .map_err(|e| e.to_string())?;
    let _ = state.save().await;
    Ok(())
}

#[tauri::command]
pub async fn add_funds(state: State<'_, AppState>, id: u32, amount: f64, account_type: AccountType) -> Result<(), String> {
    let mut bank = state
        .bank
        .lock()
        .await;


    match account_type {
        AccountType::Checking => {
            bank.get_checking_account_mut(id).map_err(|e| e.to_string())?.deposit(amount);
        },
        AccountType::Investment => {
            bank.get_investment_account_mut(id).map_err(|e| e.to_string())?.deposit(amount);
        },
    };

    // unlpck the bank
    drop(bank);
    let _ = state.save().await.map_err(|e| e.to_string())?;
    Ok(())
}