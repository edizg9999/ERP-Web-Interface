import { Button, ButtonGroup, Card, TableContainer, Typography } from '@mui/material'
import * as React from 'react'
import { onRefresh } from './refreshBusProduct'
import { Box, Table, TableRow, TableCell, TableHead, TableBody, Grid } from '@mui/material'
import { Divider, CardContent } from '@mui/material'
import {Toolbar} from '@mui/material'

const headCells = [
  { id: "stockCode", label: "Stok Kodu", numeric: false },
  { id: "stockDescription1", label: "Açıklama 1", numeric: false },
  { id: "stockDescription1", label: "Açıklama 2", numeric: false },
  { id: "bomDescription1", label: "BOM Açıklaması", numeric: false },
];

export default function Receipts()
{
    const [receiptData, setReceiptData] = React.useState(JSON.parse(localStorage.getItem('productReceiptData')));
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const refreshNavigate = React.useCallback(async () => {

        const arr = JSON.parse(localStorage.getItem('productReceiptData'));
        setReceiptData(arr.map((r) => ({ stockCode: r.stockCode, stockDescription1: r.stockDescription1, 
          stockDescription2: r.stockDescription2, bomDescription1: r.bomDescription1 })));

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
              İçeren Reçeteler
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

                    {receiptData.map((row) => (
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