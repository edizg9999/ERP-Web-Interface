import * as React from 'react';
import Button from '@mui/material/Button';
import { Box, Checkbox, Typography } from '@mui/material';
import StockTable from './StockTable';
import { emitRefresh } from './refreshBus';




export default function WarehouseSearch()
{

    const [stockCount, setStockCount] = React.useState([]);

    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const [ignoreQuantity, setIgnoreQuantity] = React.useState(false);

    localStorage.setItem('ignoreQuantity', (ignoreQuantity? "1" : "0"));


    function handleChange()
    {
        if (ignoreQuantity) setIgnoreQuantity(false);
        else setIgnoreQuantity(true);

    }


    
    function sumOfQuantity(item, select) 
    {
        const quantities = item.counts.map(r => r.quantity);
        let sum = 0;
        for (let i = 0; i < quantities.length; i++) 
        {
            if (select[i]) sum += quantities[i];
        }
        return sum;
    }

async function GetQuantityData() {

    setLoading(true);
    setError("");

        try {

            const res1 = await fetch("https://10.1.1.12:8005/api/StockCard", {
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            });
            if (!res1.ok) throw new Error(`HTTP ${res1.status}`);
            const json1 = await res1.json();
            const cards = Array.isArray(json1?.data) ? json1.data : [];

            const initialStock = cards.map(r => ({ id: r.idStockCard, stockQuantity: 0 }));
            setStockCount(initialStock); 

            const ids = initialStock.map(r => r.id);
            const res2 = await fetch("https://10.1.1.12:8005/api/StockCard/GetStockCountListByIdList", {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify(ids),
            });
            if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
            const json2 = await res2.json();
            const raw = Array.isArray(json2?.data) ? json2.data : [];

            const dataArr = raw.map(r => ({ counts: r.warehouseStockCounts }));
            setData(dataArr);

            const select = JSON.parse(localStorage.getItem("warehouseSelect") || "[]");
            const updatedStock = initialStock.map((row, idx) => ({
            ...row,
            stockQuantity: sumOfQuantity(dataArr[idx] || { counts: [] }, select),
            }));

            setStockCount(updatedStock);
            localStorage.setItem('stockQuantity', JSON.stringify(updatedStock));
            localStorage.setItem('ignoreQuantity', (ignoreQuantity? "1" : "0"));
            emitRefresh();
        } 
        catch (e) 
        {
            setError(e.message || "Failed to load");
        } 
        finally 
        {
            setLoading(false);        
        }

        console.log(stockCount);
    }


    return(
        <>
        <Box marginBottom='15px' display='flex' sx={{
            marginLeft: '15px',
        }}>
            <Box marginRight='15px' alignItems='center' display="flex">
                <Typography variant='b1'>Adet Önemsiz</Typography>
                <Checkbox checked={ignoreQuantity} onChange={handleChange} />
            </Box>
            <Button
                variant="outlined"
                size='large'
                onClick={() => { if (!loading) GetQuantityData(); } }
            >
                ARA
            </Button>

        </Box>
        </>
    );
}
