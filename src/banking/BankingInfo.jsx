import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import './BankingInfo.css';
import { useState, useEffect } from 'react'; 
// tauri API invocation
import { invoke } from "@tauri-apps/api/core";

async function addAccount(){
    // This function will be called when the user clicks the "Add Account" button
    // We will need to prompt the user for the account name and initial balance
    // Then we will call the Rust function to add the account
    // Finally, we will update the state to reflect the new account
    // TODO collect user input
    return await invoke('create_checking_account', {name: "New Account"})
        .then((_) => true)
        .catch((error) => {
            console.error(error);
            return false;
        });
}

export default function BankingInfo(){

    let [accounts, setAccounts] = useState(Array(0));
    let [refresh, setRefresh] = useState(0);

    // Fetch the initial state from Rust
    useEffect(() => {
        invoke('get_checking_accounts', {})
        .then((response) => {
          console.log(response);
          setAccounts(response);
        })
        .catch((error) => {
          console.error(error);
        });

    }, [refresh]);

    return (
        <div className='bankingInfo'>
            <div className='cardSlot'>
                {accounts.length == 0 ? <p className='noAccounts'>No accounts yet</p> : accounts.map(account => (
                    <Card key={account.id} style={{ padding: '20px', margin: '10px' }}>
                        <h3>{account.nickname}</h3>
                        <p>Balance: ${account.balance}</p>
                    </Card>
                ))}
            </div>
            <Button className='actionButton' variant='contained' color='primary' onClick={async ()=>{
                let result = await addAccount();
                if (result) {
                    setRefresh(refresh + 1);
                }
            }}>
                Add Account
            </Button>
        </div>
    );
} 