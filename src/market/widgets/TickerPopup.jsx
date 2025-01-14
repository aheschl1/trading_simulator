import { Dialog, DialogContent, DialogTitle, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useTicker } from "../context/TickerContext";
import TickerChart from "./TickerChart";

export default function TickerPopup({open, setOpen, purchase, loadingPurchase}){

    let [lastUpdated, setLastUpdated] = useState(null)
    let [currentPrice, setCurrentPrice] = useState(null)

    let { symbol, intradayData } = useTicker();

    useEffect(()=>{
        if(!intradayData)
            return
        setLastUpdated(new Date(intradayData.last_refreshed).toLocaleString())
        setCurrentPrice(intradayData.entries[intradayData.entries.length - 1].close)
    }, [intradayData])
    

    return <Dialog open={open} fullWidth maxWidth="md" onClose={()=>setOpen(false)}>
        <DialogTitle>{symbol}</DialogTitle>
        {intradayData && 
        <DialogContent>
            <TickerChart/>
            <div style={{ height: "16px" }}/>
            <Typography variant="body1">
                Last Updated: {lastUpdated}
            </Typography>
            <Typography variant="body1">
                Current Price: ${currentPrice}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                    await purchase()
                }}
                fullWidth
                disabled={loadingPurchase}
                sx={{ marginTop: "16px" }}>
                {!loadingPurchase ? "Purchase" : "Loading..."}
            </Button>
        </DialogContent>}
    </Dialog>
}