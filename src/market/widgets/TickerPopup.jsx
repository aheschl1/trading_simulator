import { Dialog, DialogContent, DialogTitle, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useTicker } from "../context/TickerContext";
import TickerChart from "./TickerChart";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";
import useCurrentPrice from "../hooks/useCurrentPrice";

export default function TickerPopup({open, setOpen, purchase, loadingPurchase}){

    let [lastUpdated, setLastUpdated] = useState(null)

    let { symbol, intradayData } = useTicker();
    let { simulatedDate } = useSimulatedDate();
    let { currentPrice, loading: currentPriceLoading, error: currentPriceError} = useCurrentPrice(symbol, simulatedDate);

    useEffect(()=>{
        if(!intradayData)
            return
        setLastUpdated(new Date(intradayData.last_refreshed).toLocaleString())
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
                Current Price: {currentPriceLoading ? "Loading..." : currentPriceError ? "Error" : `$${currentPrice}`}
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