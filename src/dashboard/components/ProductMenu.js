import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import AssignmentIcon from '@mui/icons-material/Assignment';
import FactoryIcon from '@mui/icons-material/Factory';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DriveFileMoveOutlineIcon from '@mui/icons-material/DriveFileMoveOutline';

import { emitRefresh } from './refreshBusProductMenu';

const mainListItems = [
  { text: 'Genel Bilgiler', icon: <AssignmentIcon /> },
  { text: 'Üretici Bilgileri', icon: <FactoryIcon /> },
  { text: 'Raflar', icon: <AllInboxIcon /> },
  { text: 'İçeren Reçeteler', icon: <ReceiptIcon /> },
//  { text: 'Transferler', icon: <DriveFileMoveOutlineIcon /> },
];

export default function ProductMenu() {

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  localStorage.setItem('productIndex', JSON.stringify(selectedIndex));

  function handleChange(index){

    setSelectedIndex(index);
    localStorage.setItem('productIndex', JSON.stringify(index));
    console.log(index);
    emitRefresh();

  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between', marginLeft: '15px'}}>
      
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
