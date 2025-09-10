import { Box, Typography, TextField, Button } from '@mui/material'
import * as React from 'react'
import { emitRefresh } from './refreshBusProduct';
import { onRefreshClickedRow } from './refreshBusClickedRow';

export default function ProductSearch() {
  const [stockCodes, setStockCodes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [notFound, setNotFound] = React.useState("");
  const [code, setCode] = React.useState("");

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
          setStockCodes(arr.map(r => ({ idStockCard: r.idStockCard, stockCode: r.stockCode })));
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const jget = async (url) => {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  async function displayNewProduct(stockCardId) {
    setError("");
    setLoading(true);
    try {

      const [general, manuf, rack, receipt] = await Promise.all([
        jget(`https://10.1.1.12:8005/api/StockCard/${stockCardId}`),
        jget(`https://10.1.1.12:8005/api/ManufacturerStockCode/GetByStockCardId/${stockCardId}`),
        jget(`https://10.1.1.12:8005/api/RackPlacement/GetByStockCardId/${stockCardId}`),
        jget(`https://10.1.1.12:8005/api/BomTable/GetByExistingStockCard/${stockCardId}`),
      ]);

      localStorage.setItem('productGeneralData', JSON.stringify(general?.data ?? null));
      localStorage.setItem('productManufData', JSON.stringify(Array.isArray(manuf?.data) ? manuf.data : []));
      localStorage.setItem('productRackData', JSON.stringify(Array.isArray(rack?.data) ? rack.data : []));
      localStorage.setItem('productReceiptData', JSON.stringify(Array.isArray(receipt?.data) ? receipt.data : []));

      emitRefresh();
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function searchCode() {
    const found = stockCodes.find(r => r.stockCode === code);
    if (found) {
      setNotFound("");
      await displayNewProduct(found.idStockCard);
    } else {
      setNotFound("Ürün bulunamadı");
    }
  }

    React.useEffect( () =>{
    
        const id = JSON.parse(localStorage.getItem('clickedProductId'));
        displayNewProduct(id);
  
    }, [] );


  if (loading) return <Typography sx={{ p: 2 }}>Yükleniyor…</Typography>;
  if (error)   return <Typography sx={{ p: 2, color: "crimson" }}>{error}</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection:'column', alignItems:'center', mt: '5px' }}>
      <Typography align='center' variant='h4' m='10px'>Stok Kodunu Giriniz</Typography>
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
        onClick={searchCode}
        disabled={loading}
        sx={{ mt: '15px', mb: '15px' }}
      >
        ARA
      </Button>
    </Box>
  );
}
