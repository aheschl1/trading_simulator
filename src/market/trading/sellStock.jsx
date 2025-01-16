import { invoke } from "@tauri-apps/api/core";

export default async function sellShares(
    sellQuantity,
    symbol,
    accountId,
    date
){
    await invoke("sell_shares", {
        "quantity": sellQuantity,
        "symbol": symbol,
        "accountId": accountId,
        "dateTime": date
    });
}