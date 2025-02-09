use crate::utils;
use std::{fs, ops::Deref, result, str::FromStr, sync::Arc};
use chrono::{DateTime, Utc};
use tauri::{async_runtime::Mutex};
use trading_engine::{bank::Bank, brokerage::Broker};
use alphavantage::cache_enabled::client::Client;
use std::env;
use trading_engine::bank::stock::Asset;

const CACHE_PATH: &str = "~/.cache/trading_simulator";
const BANK_PATH: &str = "~/.cache/trading_simulator/bank.json";
const FAVORITE_TICKERS_PATH: &str = "~/.cache/trading_simulator/favorite_tickers.json";

pub struct AppState {
    pub broker: Mutex<Broker>,
    pub bank: Arc<Mutex<Bank>>,
    pub favorite_tickers: Mutex<Vec<Asset>>,
    pub finnhub_client: finnhub_rs::client::Client,
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
        let bank = Arc::new(Mutex::new(bank));
        // favorites
        let favorite_tickers_path = utils::expand_tilde(FAVORITE_TICKERS_PATH);
        let favorite_tickers: Vec<Asset> = match fs::read_to_string(&favorite_tickers_path) {
            Ok(contents) => serde_json::from_str(&contents).unwrap_or(Vec::new()),
            Err(_) => Vec::new(),
        };
        // make the broker
        let key = env::var("ALPHAVANTAGE_TOKEN").expect("ALPHAVANTAGE_TOKEN must be set");
        let finnhub_key = env::var("FINNHUB_TOKEN").expect("FINNHUB_TOKEN must be set");
        let client = Client::new(&key);
        let finnhub_client = finnhub_rs::client::Client::new(finnhub_key);
        let broker = Broker::new(client, bank.clone());

        // This is a blocking call, so we need to run it in a tokio runtime
        tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap()
            .block_on(async {
                let result = broker.check_dividend_payments(Some(get_simulated_date_utc().fixed_offset())).await;
                if let Err(e) = result {
                    println!("Error checking dividend payments: {:?}", e);
                }
            });

        AppState {
            broker: Mutex::new(broker),
            bank: bank.clone(),
            favorite_tickers: Mutex::new(favorite_tickers),
            finnhub_client,
        }
    }

    pub async fn save(&self) -> Result<(), std::io::Error> {
        let bank_path = utils::expand_tilde(BANK_PATH);
        let bank_json = self.bank.lock().await.to_string();
        fs::write(&bank_path, bank_json)?;
        // save favorites
        let favorite_tickers_path = utils::expand_tilde(FAVORITE_TICKERS_PATH);
        let favorites = &self.favorite_tickers.lock().await.to_vec();
        let favorite_tickers_json = serde_json::to_string(favorites)?;
        fs::write(&favorite_tickers_path, favorite_tickers_json)?;
        Ok(())
    }


    /**
     * The simulation runs 24 hours behind the current date
     */
    pub fn get_simulated_date_utc(&self) -> DateTime<Utc> {
        get_simulated_date_utc() 
    } 
}

fn get_simulated_date_utc() -> DateTime<Utc> {
    let now = chrono::Utc::now();
    now - chrono::Duration::days(1)
}