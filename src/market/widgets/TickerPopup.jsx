import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";

export default function TickerPopup({open, setOpen, symbol, intradayData}){
    return <Dialog open={open} fullWidth maxWidth="md" onClose={()=>setOpen(false)}>
        <DialogTitle>{symbol}</DialogTitle>
        {intradayData && <DialogContent>
            <Typography variant="body1">
                Last Updated: {new Date(intradayData.last_refreshed).toLocaleString()}
            </Typography>
            <Typography variant="body1">
                Current Price: ${intradayData.entries[intradayData.entries.length - 1].close}
            </Typography>
            <Typography variant="body1">
                Open: ${intradayData.entries[intradayData.entries.length - 1].open}
            </Typography>
            <Typography variant="body1">
                High: ${intradayData.entries[intradayData.entries.length - 1].high}
            </Typography>
            <Typography variant="body1">
                Low: ${intradayData.entries[intradayData.entries.length - 1].low}
            </Typography>
            <Typography variant="body1">
                Volume: {intradayData.entries[intradayData.entries.length - 1].volume}
            </Typography>
        </DialogContent>}
    </Dialog>
}