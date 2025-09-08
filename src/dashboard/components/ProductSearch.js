import { Box, Typography, TextField, Button } from '@mui/material'
import * as React from 'react'

import { emitRefresh } from './refreshBusProduct';

export default function ProductSearch()
{
    const [stockCodes, setStockCodes] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    const [notFound, setNotFound] = React.useState("");

    const [code, setCode] = React.useState("");

    //fetch data

    React.useEffect(() => {
    let cancelled = false;

    (async () => {
        try {
        const res = await fetch("https://10.1.1.12:8005/api/StockCard", {
            headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json(); 

        if (!cancelled) {
            const arr = Array.isArray(json?.data) ? json.data : [];
            setStockCodes(arr.map((r) => ({ idStockCard: r.idStockCard, stockCode: r.stockCode })));
        }




        } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
        } finally {
        if (!cancelled) setLoading(false);
        }
    })();

    return () => { cancelled = true; };
    }, []);



    function searchCode()
    {
        if (stockCodes.map( r => r.stockCode).includes(code))
        {
            const found = stockCodes.find(r => r.stockCode === code);
            setNotFound("");
            console.log(found.idStockCard);
            localStorage.setItem('productOnDisplay', JSON.stringify(found.idStockCard));
            emitRefresh();

        }   
        else
        {
            setNotFound("Ürün bulunamadı");
            
        }     

    }



    if (loading) return <Typography sx={{ p: 2 }}>Yükleniyor…</Typography>;
    if (error)   return <Typography sx={{ p: 2, color: "crimson" }}>{error}</Typography>;

    return(
        <Box
        sx={{display: 'flex', flexDirection:'column', alignItems: 'center', marginTop: '5px'}}>
            <Typography align='center' variant='h4' margin='10px'>
                Stok Kodunu Giriniz
            </Typography>
            <TextField
                helperText={notFound}
                size="small"
                label="Stok Kodu"
                value={code}
                onChange={(e) => setCode(e.target.value)}

            />
            <Button
                variant="outlined"
                size='large'
                onClick={() => searchCode()}
                sx={{marginTop: '15px', marginBottom: '15px'}}> 
                ARA 
            </Button>
        </Box>
    )
}