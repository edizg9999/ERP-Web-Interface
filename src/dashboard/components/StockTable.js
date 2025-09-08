import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  TextField,
  Divider,
} from "@mui/material";

import { onRefresh } from "./refreshBus";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

/*
const rows = [
  {
    idBomStocks: 1,
    quantity: 120,
    productionWastage: 2.5,
    reference: "REF-100",
    lastUpdateDate: "2025-08-20",
    stockCardId: 501,
    stockCode: "STK-001",
    StockDescription1: "Steel Bolt",
    StockDescription2: "M8x20",
    bomTableId: 11,
    bomDescription1: "Assembly A",
  },
  {
    idBomStocks: 2,
    quantity: 75,
    productionWastage: 1.2,
    reference: "REF-200",
    lastUpdateDate: "2025-08-15",
    stockCardId: 502,
    stockCode: "STK-002",
    StockDescription1: "Plastic Cap",
    StockDescription2: "20mm",
    bomTableId: 12,
    bomDescription1: "Assembly B",
  },
  {
    idBomStocks: 3,
    quantity: 340,
    productionWastage: 4.1,
    reference: "REF-300",
    lastUpdateDate: "2025-08-22",
    stockCardId: 503,
    stockCode: "STK-003",
    StockDescription1: "Aluminum Frame",
    StockDescription2: "Frame A",
    bomTableId: 13,
    bomDescription1: "Assembly C",
  },
  {
    idBomStocks: 4,
    quantity: 210,
    productionWastage: 0.8,
    reference: "REF-400",
    lastUpdateDate: "2025-08-25",
    stockCardId: 504,
    stockCode: "STK-004",
    StockDescription1: "Copper Wire",
    StockDescription2: "Type C",
    bomTableId: 14,
    bomDescription1: "Assembly D",
  },
  {
    idBomStocks: 5,
    quantity: 150,
    productionWastage: 3.0,
    reference: "REF-500",
    lastUpdateDate: "2025-08-21",
    stockCardId: 505,
    stockCode: "STK-005",
    StockDescription1: "Glass Panel",
    StockDescription2: "40x60",
    bomTableId: 15,
    bomDescription1: "Assembly E",
  },
];
*/

//Sütun bilgisi

const headCells = [
  //{ id: "idStockCard", label: "Id Stock Card", numeric: true },
  { id: "stockCode", label: "Stok Kodu", numeric: false },
  { id: "stockQuantity", label: "Stok Adedi", numeric: true },
  { id: "description1", label: "Açıklama 1", numeric: false },
  { id: "description2", label: "Açıklama 2", numeric: false },
  { id: "stockGroupName", label: "Stok Grup Adı", numeric: false },
  { id: "semiProduct", label: " Yarı Ürün Mü?", numeric: false },
  { id: "saleable", label: " Satılabilir Mi?", numeric: false },
  { id: "minStockQuantity", label:"Asgari Stok Miktarı", numeric: true},
  { id: "minPrice", label:"Minimum Fiyat", numeric: true},
  { id: "maxPrice", label:"Maksimum Fiyat", numeric: true},
  { id: "avgPrice", label:"Ortalama Fiyat", numeric: true},
  { id: "expirationDays", label:"Raf Ömrü", numeric: true},
  { id: "productionWastage", label:"Ortalama Fire (%)", numeric: true},
  { id: "minOrderQuantity", label:"Minimum Sipariş Sayısı", numeric: true},
  { id: "minPackageQuantity", label:"Minimum Paket Sayısı", numeric: true},

];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: 600 }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function StockCard() {

  const [filtered, setFiltered] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

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
          setRows(arr.map((r) => ({ stockQuantity: 0, idStockCard: r.idStockCard, stockCode: r.stockCode,
             description1: r.description1, description2: r.description2, stockGroupName: r.stockGroupName, 
             semiProduct: (r.semiProduct == 1? "✅" : "❌" ), saleable: (r.saleable==1? "✅":"❌" ), minStockQuantity: r.minStockQuantity,
             minPrice: r.minPrice, maxPrice: r.maxPrice, avgPrice: r.avgPrice,
             expirationDays: r.expireationDays, productionWastage: r.productionWastage,
             minOrderQuantity: r.minOrderQuantity, minPackageQuantity: r.minPackageQuantity})));
        }

          setFiltered(rows);



      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);


  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("idStockCard");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [query, setQuery] = React.useState("");

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function checkZero(row)
  {

    const ignore = JSON.parse(localStorage.getItem('ignoreQuantity')|| '[]');

    if(ignore === 1 && row.stockQuantity === 0) return false;
    else return true;
      

  }

  //REFRESH WHEN SEARCH BUTTON PRESSED

  const refreshQuantities = React.useCallback(async () => {

    if (!rows.length) return;

    const saved = JSON.parse(localStorage.getItem('stockQuantity')|| '[]');

    const byId = new Map(saved.map( s => [s.id, s.stockQuantity]));

    setRows(prev =>
      prev.map(row => ({
           ...row, stockQuantity: byId.get(row.idStockCard) ?? 0 
        }))
      );

    },
    
    [rows] 
  );

  //Double filter, query and check if quantity is 0

  React.useEffect(() => {
    const q = query.toLowerCase();
    const next = rows
      .filter(checkZero)
      .filter(r => Object.values(r).join(' ').toLowerCase().includes(q));
    setFiltered(next);
  }, [rows, query]); 



  const sorted = stableSort(filtered, getComparator(order, orderBy));
  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  React.useEffect( () =>{
  
  const off = onRefresh( () => { refreshQuantities() });
  return off;

  }, [refreshQuantities] );

  if (loading) return <Typography sx={{ p: 2 }}>Yükleniyor…</Typography>;
  if (error)   return <Typography sx={{ p: 2, color: "crimson" }}>{error}</Typography>;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: "100%", mx: "auto" }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h3" sx={{ flexGrow: 1 }}>
            Stok Listesi
          </Typography>
          <TextField
            size="small"
            label="Filtre"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Toolbar>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table stickyHeader>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {paged.map((row) => (
                  <TableRow hover key={row.idStockCard}>
                    {headCells.map((head) => (
                      <TableCell key={head.id} align={head.numeric ? "right" : "left"}>
                        {String(row[head.id])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={headCells.length} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Sonuç yok. Başka bir filtre deneyiniz.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25]}
            count={sorted.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
