import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import { Icon } from '@mui/material';
import LogOut from './LogOut';
import WarehouseSearch from './WarehouseSearch';
import WarehouseTable from './WarehouseTable';

import { onRefresh } from './refreshBusMenu';
import Search from './Search';
import ProductSearch from './ProductSearch';
import ProductMenu from './ProductMenu';

const drawerWidth = 300;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {

const [email, setEmail] = React.useState(''); 

const [navIndex, setNavIndex] = React.useState(0);

const refreshNavigate = React.useCallback(async () => {

        setNavIndex(JSON.parse(localStorage.getItem('menuIndex')))
  
      },
      
      [] 
    );

    
React.useEffect( () =>{

const off = onRefresh( () => { refreshNavigate() });
return off;

}, [refreshNavigate] );


React.useEffect( () =>
  { setEmail(localStorage.getItem('userEmail') || '');},
  [] );

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >

      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '150px'
        }}
      >
        <MenuContent />
      </Box>
      <Divider/>
      {
        navIndex === 0 && 
        ( 

         <Box sx={{
        overflow: 'auto',
        height: '100%',
        alignItems: 'center',
        gap : 4,
        my: 2,
        maxHeight : '400px'
      }}>
        <WarehouseSearch/>
        <Divider/>
        <WarehouseTable/>
        </Box>

        )
      }
      {
        navIndex === 1 && 
        ( 
          <Box sx={{
        overflow: 'auto',
        height: '100%',
        alignItems: 'center',
        gap : 4,
        my: 2,
        maxHeight : '400px'
      }}>
        <ProductSearch/>
        <Divider/>
        <ProductMenu/>

        </Box>
)
      }
     
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={email.toUpperCase()}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            Admin
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {email}
          </Typography>
        </Box>

          <LogOut/>
   
      </Stack>
    </Drawer>
  );
}
