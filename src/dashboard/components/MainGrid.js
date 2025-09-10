import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import StockTable from './StockTable';

import { onRefresh } from './refreshBusMenu';
import { onRefreshProduct } from './refreshBusProductMenu';
import { Typography } from '@mui/material';
import ProductGeneral from './ProductGeneral';
import ManufInfo from './ManufInfo';
import RackInfo from './RackInfo';
import Receipts from './Receipts';

/*
const data = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

*/



export default function MainGrid() {

  const [navIndex, setNavIndex] = React.useState(0);
  const [productIndex, setProductIndex] = React.useState(JSON.parse(localStorage.getItem('productIndex')));

  //Refresh for main menu

  const refreshNavigate = React.useCallback(async () => {

          setNavIndex(JSON.parse(localStorage.getItem('menuIndex')))
    
        },
        
        [] 
      );

      
  React.useEffect( () =>{

  const off = onRefresh( () => { refreshNavigate() });
  return off;

  }, [refreshNavigate] );

  // Refresh for product menu

  const refreshNavigateProduct = React.useCallback(async () => {

          setProductIndex(JSON.parse(localStorage.getItem('productIndex')))    
    
        },
        
        [] 
      );

      
  React.useEffect( () =>{

  const off = onRefreshProduct( () => { refreshNavigateProduct() });
  return off;
  

  }, [refreshNavigateProduct] );







  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      
          <Grid>
            {navIndex === 0 && <StockTable/>}
            {navIndex === 1 && productIndex === 0 && <ProductGeneral/>}
            {navIndex === 1 && productIndex === 1 && <ManufInfo/>}
            {navIndex === 1 && productIndex === 2 && <RackInfo/>}
            {navIndex === 1 && productIndex === 3 && <Receipts/>}

          </Grid>
    </Box>
  );
}
