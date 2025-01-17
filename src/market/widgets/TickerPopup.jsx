import { Dialog, DialogContent, DialogTitle, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useTicker } from "../context/TickerContext";
import TickerChart from "./TickerChart";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";
import useCurrentPrice from "../hooks/useCurrentPrice";
import { Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function TickerPopup({ open, setOpen, purchase, loadingPurchase }) {

    let [lastUpdated, setLastUpdated] = useState(null)

    let { symbol, intradayFiveMinuteData, tickerDetails, tickerDetailsLoading, tickerDetailsError } = useTicker();
    let { simulatedDate } = useSimulatedDate();
    let { currentPrice, loading: currentPriceLoading, error: currentPriceError } = useCurrentPrice(symbol, simulatedDate);
    let [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        if (!intradayFiveMinuteData)
            return
        setLastUpdated(new Date(intradayFiveMinuteData.last_refreshed).toLocaleString())
    }, [intradayFiveMinuteData])


    return <Dialog open={open} fullWidth maxWidth="md" onClose={() => setOpen(false)}>
        <DialogTitle>{symbol}</DialogTitle>
        {intradayFiveMinuteData &&
            <DialogContent>
                <TickerChart />
                <div style={{ height: "16px" }} />
                <Typography variant="body1">
                    Last Updated: {lastUpdated}
                </Typography>
                <Typography variant="body1">
                    Current Price: {currentPriceLoading ? "Loading..." : currentPriceError ? "Error" : `$${currentPrice}`}
                </Typography>
                {
                    tickerDetailsLoading ? (
                        <Typography variant="body1">Loading...</Typography>
                    ) : tickerDetailsError ? (
                        <Typography variant="body1" color="error">
                            {tickerDetailsError}
                        </Typography>
                    ) : (
                        <>
                            <Button
                                onClick={() => setDetailsOpen(!detailsOpen)}
                                startIcon={<ExpandMoreIcon />}
                                variant="contained"
                                color={"primary"}
                                sx={{
                                    textTransform: "none", // Disable uppercase text for a cleaner look
                                    borderRadius: 4,       // Add rounded corners
                                    padding: "8px 16px",   // Increase padding for better touch area
                                    fontWeight: "bold",    // Make the text stand out
                                    boxShadow: 3,          // Add a subtle shadow for depth
                                    marginTop: "16px",      // Add margin to separate the button from other elements
                                    marginBottom: "16px"    // Add margin to separate the button from other elements
                                }}
                            >
                                {detailsOpen ? "Hide Details" : "Show Details"}
                            </Button>

                            <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
                                <Typography variant="body2"><strong>Name:</strong> {tickerDetails.name}</Typography>
                                <Typography variant="body2"><strong>Type:</strong> {tickerDetails.stock_type}</Typography>
                                <Typography variant="body2"><strong>Region:</strong> {tickerDetails.region}</Typography>
                                <Typography variant="body2"><strong>Market Open:</strong> {tickerDetails.market_open}</Typography>
                                <Typography variant="body2"><strong>Market Close:</strong> {tickerDetails.market_close}</Typography>
                                <Typography variant="body2"><strong>Timezone:</strong> {tickerDetails.timezone}</Typography>
                                <Typography variant="body2"><strong>Currency:</strong> {tickerDetails.currency}</Typography>
                            </Collapse>
                        </>
                    )
                }

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