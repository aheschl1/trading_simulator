import { Card, ButtonBase, Button } from "@mui/material";

const handleClick = () => {
    
}

export default function AccountCard({ account }) {
    let accountType = account.assets === undefined ? "Checking" : "Investment";
    return (
        <ButtonBase onClick = {handleClick} sx={{width: "100%", display: "block", textAlign: "left"}}>
            <Card key={account.id} style={{ paddingLeft: "20px", paddingRight: "20px", margin: "8px" }}>
                <h3 style={{"marginBottom": "0px"}}>{account.nickname}</h3>
                <h6 style={{"marginTop": "2px"}}>{accountType}</h6>
                <p>Balance: ${account.balance}</p>
            </Card>
        </ButtonBase>
    );
}