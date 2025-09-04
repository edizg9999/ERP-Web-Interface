import * as React from 'react';
import { Box, Typography, Grid } from '@mui/material';




export default function Currency() {

    const [usd, setUsd] = React.useState([]);
    const [eur, setEur] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
  
    React.useEffect(() => {
      let cancelled = false;
  
      (async () => {
        try {
          const res = await fetch("https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_ggSa7xVjr4HSzAD0qh3MEKCuI41EtuQ04oJRtnQQ&currencies=EUR%2CUSD&base_currency=TRY", {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json(); 
  
          if (!cancelled) {
            const arr = json.data;

            console.log(json);

            setEur(arr.EUR);
            setUsd(arr.USD);


          } 
        } 
        catch (e) {
          if (!cancelled) setError(e.message || "Failed to load");
        } 
        finally {
          if (!cancelled) setLoading(false);
        }
      })();
  
      return () => { cancelled = true; };
    }, []);

    if (loading) return <Typography sx={{ p: 2 }}>Yükleniyor…</Typography>;
    if (error)   return <Typography sx={{ p: 2, color: "crimson" }}>{error}</Typography>;

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '170px' }}}>
          <Grid>
            <Typography>
                EUR: {(1/eur).toFixed(4)}
            </Typography>
            <Typography>
                USD: {(1/usd).toFixed(4)}
            </Typography>
          </Grid>
    </Box>
  );
}