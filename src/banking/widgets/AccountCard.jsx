import {
    Card, ButtonBase, Button, Dialog,
    DialogTitle, DialogContent, List, ListItem,
    ListItemText, Collapse, Typography, Box
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { message } from '@tauri-apps/plugin-dialog';
import { useAccounts } from "../context/AccountContext";
import useCurrentValue from "../hooks/useCurrentValue";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";
import sellShares from "../../market/trading/sellStock";

// Utility to convert ISO timestamp to MM/DD/YYYY
const convertToMMDDYYYY = (isoTimestamp) => {
    const date = new Date(isoTimestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

// Transaction list item component
const TransactionListItem = ({ transaction }) => {

    const getTransactionTitle = () => {
        // Deposit, or, {Purchase: [{symbol: "AAPL"}, 234.6]}
        if (typeof transaction.transaction_type === "string") {
            return transaction.transaction_type
        }
        if ("Purchase" in transaction.transaction_type) {
            return `Purchase: ${transaction.transaction_type.Purchase[1]} shares of ${transaction.transaction_type.Purchase[0].symbol}`;
        }
    }

    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    return (
        <ListItem key={transaction.id} alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
            <ListItemText
                primary={getTransactionTitle()}
                secondary={`$${transaction.amount} on ${convertToMMDDYYYY(transaction.date)}`} />
            <Collapse in={descriptionExpanded} timeout="auto" unmountOnExit>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: "8px", paddingLeft: "16px", width: "100%" }}
                >
                    {transaction.description || "No description available."}
                </Typography>
            </Collapse>
            <Button
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                size="small"
                sx={{ textTransform: "none", marginTop: "8px" }}>
                {descriptionExpanded ? "Hide Description" : "Show Description"}
            </Button>
        </ListItem>
    );
};

const HoldingListItem = ({ symbol, holding, accountId }) => {

    const { simulatedDate } = useSimulatedDate();
    const { currentValue, loading, error } = useCurrentValue(symbol, holding.quantity, simulatedDate);
    const { fetchAccounts } = useAccounts();

    const profitLoss = (currentValue - holding.average_cost_per_unit * holding.quantity).toFixed(2);
    const percentGain = ((profitLoss / (holding.average_cost_per_unit * holding.quantity)) * 100).toFixed(2);

    const handleSell = async () => {
        try{
            let quantity = prompt(`Enter the number of shares you would like to sell. Type MAX to sell all shares.`);
            if (!quantity) return;
            if (quantity.toLowerCase() === "max") {
                quantity = holding.quantity;
            }else{
                quantity = parseInt(quantity);
                if (isNaN(quantity) || quantity <= 0 || quantity > holding.quantity) {
                    message("Please enter a valid number of shares to sell.", {title: "Invalid quantity", type: "error"});
                    return;
                }
            }
            await sellShares(quantity, symbol, accountId, simulatedDate)
            fetchAccounts()
            message(`Successfully sold ${quantity} shares of ${symbol}.`);
        } catch (e) {
            message(e, {title: "Error selling shares", type: "error"})
        }
    }

    return <ListItem key={symbol} sx={{ padding: 0 }}>
        <Card
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 2,
                padding: 2,
                boxShadow: 2,
                borderRadius: 2,
                backgroundColor: "#f9f9f9"
            }}
        >
            <Box sx={{ flex: 1 }}>
                <ListItemText
                    primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                            {`${holding.quantity} shares of ${symbol}`}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" color="textSecondary">
                            {`Average Cost: $${holding.average_cost_per_unit.toFixed(2)}`}
                        </Typography>
                    }
                />
                <ListItemText
                    primary={
                        <Typography
                            variant="subtitle1"
                            sx={{ color: profitLoss >= 0 ? "green" : "red", fontWeight: "bold" }}
                        >
                            {loading ? "Loading..." : (error ? "Error" : `Current Value: $${currentValue.toFixed(2)}`)}
                        </Typography>
                    }
                    secondary={
                        <Typography
                            variant="body2"
                            sx={{ color: profitLoss >= 0 ? "green" : "red", fontWeight: "bold" }}
                        >
                            {loading ? "Loading..." : (error ? error : `Profit/Loss: $${profitLoss} (${percentGain}%)`)}
                        </Typography>
                    }
                />
            </Box>
            <Button
                variant="contained"
                color="error"
                sx={{ marginLeft: 2, fontWeight: "bold" }}
                onClick={() => handleSell(symbol)} // Define `handleSell` in your component
            >
                Sell
            </Button>
        </Card>
    </ListItem>

}


// Function to add funds to an account
const addFunds = async (account, accountType) => {
    const amount = prompt("Enter the amount you would like to add to your account");
    if (!amount) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Please enter a positive number.");
    }

    try {
        await invoke("add_funds", { id: account.id, amount: parsedAmount, accountType });
        // message("Funds added successfully.");
    } catch (e) {
        // alert(`Failed to add funds to account: ${e}`);
        throw new Error(`Failed to add funds to account: ${e}`);
    }
};

// Main account card component
export default function AccountCard({ account }) {
    const [popupOpen, setPopupOpen] = useState(false);
    const [transactionsExpanded, setTransactionsExpanded] = useState(false);
    const { fetchAccounts } = useAccounts();

    const accountType = account.assets ? "Investment" : "Checking";

    return (
        <>
            {/* Account card clickable button */}
            <ButtonBase
                onClick={() => setPopupOpen(true)}
                sx={{ width: "100%", display: "block", textAlign: "left" }}
            >
                <Card sx={{ padding: "20px", margin: "8px" }}>
                    <Typography variant="h6" component="div">
                        {account.nickname}
                    </Typography>
                    <Typography variant="subtitle2" component="div">
                        {accountType}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Balance: ${account.balance.toFixed(2)}
                    </Typography>
                    {
                        accountType === "Investment" && (
                            <Typography variant="body2" component="p">
                                Total Assets: ${Object.values(account.assets).reduce((acc, asset) => acc + asset.quantity * asset.average_cost_per_unit, 0).toFixed(2)}
                            </Typography>
                        )
                    }
                </Card>
            </ButtonBase>

            {/* Account details dialog */}
            <Dialog open={popupOpen} fullWidth maxWidth="md" onClose={() => setPopupOpen(false)}>
                <DialogTitle>{account.nickname}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Balance: ${account.balance.toFixed(2)}
                    </Typography>
                    <Typography variant="h6" sx={{ marginTop: "16px" }}>
                        Account Details
                    </Typography>
                    <Typography variant="body2">
                        Account Type: {accountType}
                    </Typography>
                    <Typography variant="body2">
                        Opened: {convertToMMDDYYYY(account.created_at)}
                    </Typography>
                    {/* Assets */}
                    {accountType === "Investment" && (
                        <>
                            <Typography variant="h6" sx={{ marginTop: "16px" }}>
                                Assets
                            </Typography>
                            <List>
                                {Object.entries(account.assets).map(([symbol, holding]) => <HoldingListItem symbol={symbol} holding={holding} accountId = {account.id}/>)}
                            </List>
                        </>
                    )}

                    {account.transactions.length > 0 && (
                        <>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                marginTop: "16px",
                            }}>
                                <Typography variant="h6" style={{ "marginRight": "16px" }}>Transactions</Typography>
                                <Button
                                    onClick={() => setTransactionsExpanded(!transactionsExpanded)}
                                    sx={{ textTransform: "none" }}>{transactionsExpanded ? "Hide" : "Expand"}
                                </Button>
                            </div>
                            <Collapse in={transactionsExpanded} timeout="auto" unmountOnExit>
                                <List>
                                    {account.transactions.map((transaction) => (
                                        <TransactionListItem transaction={transaction} key={transaction.date} />
                                    )).reverse()}
                                </List>
                            </Collapse>
                        </>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            try {
                                await addFunds(account, accountType)
                                message("Funds added successfully.");
                                fetchAccounts();
                            } catch (e) {
                                alert(e);
                            }
                        }}
                        fullWidth
                        sx={{ marginTop: "16px" }}
                    >
                        Add Funds
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
