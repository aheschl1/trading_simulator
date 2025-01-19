import { Dialog, DialogContent, DialogTitle, Typography, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useTicker } from "../context/TickerContext";
import TickerChart from "./TickerChart";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";
import useCurrentPrice from "../hooks/useCurrentPrice";
import { Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function TickerPopup({ open, setOpen, purchase, loadingPurchase }) {
    let [lastUpdated, setLastUpdated] = useState(null);

    let {
        symbol,
        intradayFiveMinuteData,
        tickerDetails,
        tickerDetailsLoading,
        tickerDetailsError,
        companyProfile,
        companyProfileLoading,
        companyProfileError,
    } = useTicker();

    let { simulatedDate } = useSimulatedDate();
    let { currentPrice, loading: currentPriceLoading, error: currentPriceError } = useCurrentPrice(symbol, simulatedDate);
    let [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        if (!intradayFiveMinuteData) return;
        setLastUpdated(new Date(intradayFiveMinuteData.last_refreshed).toLocaleString());
    }, [intradayFiveMinuteData]);

    return (
        <Dialog open={open} fullWidth maxWidth="md" onClose={() => setOpen(false)}>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    {companyProfileLoading ? (
                        <Typography variant="body1">Loading company profile...</Typography>
                    ) : companyProfileError ? (
                        <Typography variant="body1" color="error">
                            {companyProfileError}
                        </Typography>
                    ) : (
                        companyProfile && (
                            <img
                                src={companyProfile.logo}
                                alt={`${symbol} Logo`}
                                style={{ maxWidth: "50px", height: "auto", marginRight: "16px" }}
                            />
                        )
                    )}
                    <Typography variant="h6">{symbol}</Typography>
                </Box>
            </DialogTitle>
            {intradayFiveMinuteData && (
                <DialogContent>
                    <TickerChart />
                    <div style={{ height: "16px" }} />
                    <Typography variant="body1">Last Updated: {lastUpdated}</Typography>
                    <Typography variant="body1">
                        Current Price: {currentPriceLoading ? "Loading..." : currentPriceError ? "Error" : `$${currentPrice}`}
                    </Typography>
                    {tickerDetailsLoading ? (
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
                                color="primary"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 4,
                                    padding: "8px 16px",
                                    fontWeight: "bold",
                                    boxShadow: 3,
                                    marginTop: "16px",
                                    marginBottom: "16px",
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
                                <Typography variant="body2"><strong>Industry:</strong> {companyProfile ? companyProfile.finnhubIndustry : "Loading..."}</Typography>
                                {companyProfile && (
                                    <Typography variant="body2">
                                        <strong>Website:</strong>{" "}
                                        <a
                                            href={companyProfile.weburl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: "none", color: "#007BFF" }}
                                        >
                                            {companyProfile.weburl}
                                        </a>
                                    </Typography>
                                )}
                            </Collapse>
                        </>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            await purchase();
                        }}
                        fullWidth
                        disabled={loadingPurchase}
                        sx={{ marginTop: "16px" }}
                    >
                        {!loadingPurchase ? "Purchase" : "Loading..."}
                    </Button>
                </DialogContent>
            )}
        </Dialog>
    );
}
