import React from 'react';
import { useState } from 'react';

import AccountCard from './widgets/AccountCard';
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import './BankingInfo.css';
import useAccounts from "./hooks/useAccounts";
// tauri API invocation
import { message } from '@tauri-apps/plugin-dialog';


export default function BankingInfo(){

    const {
        checkingAccounts,
        investmentAccounts,
        addCheckingAccount,
        addInvestmentAccount,
        loading,
        error,
    } = useAccounts();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [accountType, setAccountType] = useState("checking");
    const [accountName, setAccountName] = useState("");

    const handleAddAccount = async () => {
        if (!accountName.trim()) {
            message("Account name is required.");
            return;
        }

        let success = false;

        if (accountType === "checking") {
            success = await addCheckingAccount(accountName);
        } else if (accountType === "investment") {
            success = await addInvestmentAccount(accountName);
        }

        if (success) {
            message('Account added successfully');
            setDialogOpen(false);
        }
    };

    return (
        <div className='bankingInfo'>
            {loading && <p>Loading accounts...</p>}
            {error && <p className="error">{error}</p>}

             <div className="cardSlot">
                {checkingAccounts.length === 0 && <p className="noAccounts">No checking accounts yet</p>}
                {checkingAccounts.map((account) => <AccountCard key={account.id} account={account} />)}
                {investmentAccounts.length === 0 && <p className="noAccounts">No investment accounts yet</p>}
                {investmentAccounts.map((account) => <AccountCard key={account.id} account={account} />)}
            </div>
            <Button
                className="actionButton"
                variant="contained"
                color="primary"
                onClick={() => setDialogOpen(true)}
                disabled={loading}
            >
                Add Account
            </Button>
            
            {/* Add account dialog*/ }
            <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>
            <DialogTitle>Add New Account</DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        style={{ marginBottom: "20px" }}
                    >
                        <MenuItem value="checking">Checking</MenuItem>
                        <MenuItem value="investment">Investment</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        label="Account Name"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleAddAccount}>
                        Add Account
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
} 