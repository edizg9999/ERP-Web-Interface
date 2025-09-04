// WarehouseTable.js
import * as React from "react";
import { checkboxClasses } from "@mui/material/Checkbox";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Typography } from "@mui/material";

export default function WarehouseTable() {

  localStorage.setItem('warehouseDataLoaded', false)

  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("https://10.1.1.12:8005/api/Warehouse", {
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
          setRows(arr.map((r) => ({ name: r.name, select: Boolean(r.select ?? 0) })));
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; localStorage.setItem('warehouseDataLoaded', true) };
  }, []);


  const toggleSelect = (index) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, select: !r.select } : r)));
    localStorage.setItem('warehouseSelect', JSON.stringify(rows.map(r => r.select)))


  if (loading) return <Typography sx={{ p: 2 }}>Yükleniyor…</Typography>;
  if (error)   return <Typography sx={{ p: 2, color: "crimson" }}>{error}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ padding: '0', fontWeight: 'bold', fontSize: '20px'}}>Depo Adı</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '20px'}}>Seçim</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow sx={{ 
       '& .MuiTableCell-root': {
           height: '5px',
           padding: '0'
        }
   }}
   key={`${row.name}-${idx}`}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="center">
                <Checkbox 

                checked={row.select} onChange={() => toggleSelect(idx)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
