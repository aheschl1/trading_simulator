import { invoke } from "@tauri-apps/api/core";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";

export default async function purchaseShares(
    purchaseQuantity,
    symbol,
    accountId,
    date
){
    await invoke("purchase_shares", {
        "quantity": purchaseQuantity,
        "symbol": symbol,
        "accountId": accountId,
        "dateTime": date
    });
}