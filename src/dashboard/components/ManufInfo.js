import { Button, ButtonGroup, Card, TableContainer, Typography } from '@mui/material'
import * as React from 'react'
import { onRefresh } from './refreshBusProduct'
import { Box, Table, TableRow, TableCell, TableHead, TableBody, Grid } from '@mui/material'
import { Divider, CardContent } from '@mui/material'
import {Toolbar} from '@mui/material'

const headCells = [
  { id: "manufacturerCode", label: "Üretici Kodu", numeric: false },
  { id: "manufacturerName", label: "Üretici Adı", numeric: false },
];

export default function ManufInfo()
{
    const [manufData, setManufData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const refreshNavigate = React.useCallback(async () => {

        const value = JSON.parse(localStorage.getItem('productOnDisplay'))

        setLoading(true)

        try {
        const res = await fetch(`https://10.1.1.12:8005/api/ManufacturerStockCode/GetByStockCardId/${value}`, {
            headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json(); 

        const arr = Array.isArray(json?.data) ? json.data : [];
        setManufData(arr.map((r) => ({ manufacturerName: r.manufacturerName, manufacturerCode: r.manufacturerCode })));

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
       <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: "100%", mx: "auto" }}>
         <Card elevation={3} sx={{ borderRadius: 3 }}>
           <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
             <Typography variant="h3" sx={{ flexGrow: 1 }}>
               Üreticiler
             </Typography>
           </Toolbar>
           <Divider />
           <CardContent sx={{ p: 0 }}>
             <TableContainer>
               <Table stickyHeader>
                 <TableHead>
                    <TableRow>
                            {headCells.map((headCell) => (
                              <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? "right" : "left"}
                                sx={{ fontWeight: 600 }}
                              >
                                {headCell.label}
                              </TableCell>
                            ))}
                            
                          </TableRow>
                 </TableHead>
                 <TableBody>

                    {manufData.map((row) => (
                        <TableRow>
                        {headCells.map((head) => (
                            <TableCell key={head.id} align={head.numeric ? "right" : "left"}>
                            {String(row[head.id])}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))}
                                            
                 </TableBody>
               </Table>
             </TableContainer>
           </CardContent>
         </Card>
       </Box>
        
    )

}