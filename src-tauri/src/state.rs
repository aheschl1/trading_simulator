use crate::utils;
use std::{fs, ops::Deref, str::FromStr};
use tauri::async_runtime::Mutex;
use trading_engine::bank::Bank;

const CACHE_PATH: &str = "~/.cache/trading_simulator";
const BANK_PATH: &str = "~/.cache/trading_simulator/bank.json";

pub struct AppState {
    pub bank: Mutex<Bank>,
}

impl AppState {
    pub fn new() -> Self {
        // first, check if there is a cached bank at ~/.trading-simulator/bank.json
        // if there is, load it
        // if there isn't, create a new bank and save it
        match fs::create_dir(utils::expand_tilde(CACHE_PATH)) {
            Ok(_) => (),
            Err(_) => (),
        }
        let bank_path = utils::expand_tilde(BANK_PATH);
        let bank = match fs::read_to_string(&bank_path) {
            Ok(contents) => Bank::from_str(&contents).unwrap_or(Bank::empty()),
            Err(_) => Bank::empty(),
        };

        AppState {
            bank: Mutex::new(bank),
        }
    }

    pub async fn save(&self) -> Result<(), std::io::Error> {
        let bank_path = utils::expand_tilde(BANK_PATH);
        let bank_json = self.bank.lock().await.to_string();
        fs::write(&bank_path, bank_json)?;
        Ok(())
    }
}
