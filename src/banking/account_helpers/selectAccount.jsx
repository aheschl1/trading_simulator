import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useAccounts } from '../context/AccountContext';

const SelectAccountDialog = ({ open, onClose }) => {
    const [accountType, setAccountType] = useState('Checking');
    const [selectedAccount, setSelectedAccount] = useState(undefined);

    const {checkingAccounts, investmentAccounts, loading, error} = useAccounts()

    const handleAccountTypeChange = (event) => {
        setAccountType(event.target.value);
        setSelectedAccount(undefined);
    };

    const handleAccountChange = (event) => {
        setSelectedAccount(event.target.value);
    };

    const handleSubmit = () => {
        // Handle the account selection
        onClose(selectedAccount);
    };

    const filteredAccounts = accountType === 'Checking' ? checkingAccounts : investmentAccounts;

    return (
        <Dialog open={open} onClose={() => onClose(null)}>
            <DialogTitle>Select an Account</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Account Type</InputLabel>
                    <Select value={accountType} onChange={handleAccountTypeChange}>
                        <MenuItem value="Investment">Investment</MenuItem>
                        <MenuItem value="Checking">Checking</MenuItem>
                    </Select>
                </FormControl>
                {accountType && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Account</InputLabel>
                        <Select value={selectedAccount} onChange={handleAccountChange}>
                            {filteredAccounts.map(account => (
                                <MenuItem key={account.id} value={account}>
                                    {account.nickname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(undefined)} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" disabled={!selectedAccount}>
                    Select
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectAccountDialog;