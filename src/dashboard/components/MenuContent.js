import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import { emitRefresh } from './refreshBusMenu';
import { onRefreshClickedRow } from './refreshBusClickedRow';

const mainListItems = [
  { text: 'Stok Listesi', icon: <InventoryIcon /> },
  { text: 'Ürün Detayları', icon: <CategoryIcon /> }

];

export default function MenuContent() {

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  localStorage.setItem('menuIndex', JSON.stringify(selectedIndex));

  function handleChange(index){

    setSelectedIndex(index);
    localStorage.setItem('menuIndex', JSON.stringify(index));

    emitRefresh();

  };

   const refreshNavigate = React.useCallback(async () => {

              setSelectedIndex(1);
  

          
              },
              
              [] 
          );
  
          
      React.useEffect( () =>{
  
      const off = onRefreshClickedRow( () => { refreshNavigate() });
      return off;
  
      }, [refreshNavigate] );
  

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === selectedIndex}
            onClick={() => handleChange(index)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

    </Stack>
  );
}
