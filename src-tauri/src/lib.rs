use state::AppState;
mod state;
mod utils;
mod functions;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = AppState::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(app_state)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            functions::banking::get_checking_accounts,
            functions::banking::get_investment_accounts,
            functions::banking::create_checking_account,
            functions::banking::create_investment_account,
            functions::banking::add_funds
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
