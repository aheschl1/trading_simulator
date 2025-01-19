import { Dialog, DialogContent, DialogTitle, Typography, Button, Box, Card, CardContent, Link, Grid, CardMedia } from "@mui/material";
import { use, useEffect, useState } from "react";
import { useTicker } from "../context/TickerContext";
import TickerChart from "./TickerChart";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";
import useCurrentPrice from "../hooks/useCurrentPrice";
import useCompanyNews from "../hooks/useCompanyNews";
import { Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const CompanyNewsSection = ({ symbol }) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const { companyNews, loading: companyNewsLoading, error: companyNewsError } = useCompanyNews(symbol);

    const toggleDetailsOpen = () => setDetailsOpen((prev) => !prev);

    return (
        <Box>
            <Button
                onClick={toggleDetailsOpen}
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
                {detailsOpen ? "Hide News" : "Show News"}
            </Button>
            <Collapse in={detailsOpen}>
                {companyNewsLoading ? (
                    <Typography variant="body1">Loading...</Typography>
                ) : companyNewsError ? (
                    <Typography variant="body1" color="error">
                        {companyNewsError}
                    </Typography>
                ) : (
                    companyNews.map((news, index) => (
                        <Card
                            key={index}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "16px",
                                padding: "8px",
                                boxShadow: 2,
                                borderRadius: 4,
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={news.image ? 8 : 12}>
                                    <CardContent>
                                        <Typography variant="body1" gutterBottom>
                                            <strong>
                                                <Link
                                                    href={news.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener"
                                                    underline="hover"
                                                >
                                                    {news.source}
                                                </Link>
                                            </strong>{" "}
                                            &nbsp;-&nbsp;
                                            <Link
                                                href={news.url}
                                                target="_blank"
                                                rel="noopener"
                                                underline="hover"
                                            >
                                                {news.headline}
                                            </Link>
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            {news.summary}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(news.datetime).toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Grid>
                                {news.image && (
                                    <Grid item xs={4}>
                                        <CardMedia
                                            component="img"
                                            image={news.image}
                                            alt={news.headline}
                                            sx={{
                                                borderRadius: 2,
                                                maxHeight: "150px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Card>
                    ))
                )}
            </Collapse>
        </Box>
    );
};

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
    let { companyNews, loading: companyNewsLoading, error: companyNewsError } = useCompanyNews(symbol);

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
                    <CompanyNewsSection symbol={symbol} />
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
