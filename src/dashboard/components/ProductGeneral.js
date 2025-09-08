import { Button, ButtonGroup, Card, TableContainer, Typography } from '@mui/material'
import * as React from 'react'
import { onRefresh } from './refreshBusProduct'
import { Box, Table, TableRow, TableCell, TableHead, TableBody, Grid } from '@mui/material'

const imgsize = 250;

export default function ProductGeneral()
{
    const [imgIndex, setImgIndex] = React.useState(1);

    const [imgSource1, setImgSource1] = React.useState("");
    const [imgSource2, setImgSource2] = React.useState("");
    const [imgSource3, setImgSource3] = React.useState("");

    const [stockData, setStockData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const refreshNavigate = React.useCallback(async () => {

        const value = JSON.parse(localStorage.getItem('productOnDisplay'))

        setLoading(true)

        try {
        const res = await fetch(`https://10.1.1.12:8005/api/StockCard/${value}`, {
            headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json(); 

        setStockData(json.data);
        setImgSource1(json.data.imagePath1);
        setImgSource2(json.data.imagePath2);
        setImgSource3(json.data.imagePath3);

        } 
        catch (e) 
        {
            setError(e.message || "Failed to load");
        } 
        finally 
        {
            setLoading(false);
        }

        },
        
        [] 
    );
        
    React.useEffect( () => {

    const off = onRefresh( () => { refreshNavigate() });
    return off;

    }, [refreshNavigate] );

    if (loading) return <Typography sx={{ p: 2 }}>Yükleniyor…</Typography>;
    if (error)   return <Typography sx={{ p: 2, color: "crimson" }}>{error}</Typography>;

    return(
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={4}>
            <Card elevation={3} sx={{ borderRadius: 3, margin: '15px'}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '25px'}}>Stok Bilgileri</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody sx={{ 
                        '& .MuiTableRow-root': {
                        height: '30px',
                        fontSize: '16px',
                        }
                        }}>
                    <TableRow>Stok Kodu: {stockData != null ? stockData.stockCode : " "}</TableRow>
                    <TableRow>Stok Grubu: {stockData != null ? stockData.stockGroupName : " "}</TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Grid>

        <Grid size={4}>
            <Card elevation={3} sx={{ borderRadius: 3, margin: '15px'}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '25px'}}>Fiyat Bilgileri</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody sx={{ 
                        '& .MuiTableRow-root': {
                        height: '30px',
                        fontSize: '16px',
                        }
                        }}>
                    <TableRow>Minimum Fiyat: {stockData != null ? stockData.minPrice : " "}</TableRow>
                    <TableRow>Maksimum Fiyat: {stockData != null ? stockData.maxPrice : " "}</TableRow>
                    <TableRow>Ortalama Fiyat: {stockData != null ? stockData.avgPrice : " "}</TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Grid>  

        <Grid size={4}>
            <Card elevation={3} sx={{ borderRadius: 3, margin: '15px'}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '25px'}}>Açıklamalar</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody sx={{ 
                        '& .MuiTableRow-root': {
                        height: '30px',
                        fontSize: '16px',
                        }
                        }}>
                    <TableRow>Açıklama 1: {stockData != null ? stockData.description1 : " "}</TableRow>
                    <TableRow>Açıklama 2: {stockData != null ? stockData.description2 : " "}</TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Grid>    
        
       <Grid size={5}>
            <Card elevation={3} sx={{ borderRadius: 3, margin: '15px'}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '25px'}}>Diğer Bilgiler</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody sx={{ 
                        '& .MuiTableRow-root': {
                        height: '30px',
                        fontSize: '16px',
                        }
                        }}>
                    <TableRow>Asgari Stok Miktarı: {stockData != null ? stockData.minPrice : " "}</TableRow>
                    <TableRow>Raf Ömrü (Gün): {stockData != null ? stockData.maxPrice : " "}</TableRow>
                    <TableRow>Ortalama Fire (%): {stockData != null ? stockData.avgPrice : " "}</TableRow>
                    <TableRow>Minimum Sipariş Miktarı: {stockData != null ? stockData.minOrderQuantity : " "}</TableRow>
                    <TableRow>Minimum Paket Sayısı: {stockData != null ? stockData.minPackageQuantity : " "}</TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Grid>    

        <Grid size={6.5}>
            <Card elevation={3} sx={{ borderRadius: 3, margin: '15px'}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '25px'}}>Resimler</TableCell>
                            <TableCell>    
                                <ButtonGroup>
                                <Button onClick={() => setImgIndex(1)}>1</Button>
                                <Button onClick={() => setImgIndex(2)}>2</Button>
                                <Button onClick={() => setImgIndex(3)}>3</Button>
                                </ButtonGroup>
                            </TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody sx={{ 
                        '& .MuiTableRow-root': {
                        height: '30px',
                        fontSize: '16px',
                        }
                        }}>

                            {imgIndex === 1 && <Box
                            component="img"
                            sx={{
                                height: imgsize,
                                width: imgsize,
                                maxHeight: { xs: 250, md: imgsize },
                                maxWidth: { xs: 250, md: imgsize },
                            }}
                            src= {"https://10.1.1.12:8005/api/StockCard/downloadfile?FilePath=" + imgSource1}
                            />}
                            {imgIndex === 2 && <Box
                            component="img"
                            sx={{
                                height: imgsize,
                                width: imgsize,
                                maxHeight: { xs: 250, md: imgsize },
                                maxWidth: { xs: 250, md: imgsize },
                            }}
                            src= {"https://10.1.1.12:8005/api/StockCard/downloadfile?FilePath=" + imgSource2}
                            />}
                            {imgIndex === 3 && <Box
                            component="img"
                            sx={{
                                height: imgsize,
                                width: imgsize,
                                maxHeight: { xs: 250, md: imgsize },
                                maxWidth: { xs: 250, md: imgsize },
                            }}
                            src= {"https://10.1.1.12:8005/api/StockCard/downloadfile?FilePath=" + imgSource3}
                            />}

                        
                                            
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Grid>    
    </Grid>
        
    )

}