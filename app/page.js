'use client'
import { useState, useEffect } from "react";
import { firestore, storage, auth } from '@/firebase';
import { Box, Typography, Modal, Stack, TextField, Button, IconButton, AppBar, Toolbar } from '@mui/material';
import { Add, Remove, Search } from '@mui/icons-material';
import { getDoc, setDoc, deleteDoc, doc, collection, query, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Auth from './Auth'; // Adjusted import statement

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const updateInventory = async () => {
    if (typeof window !== 'undefined' && firestore) {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setItemImage(e.target.files[0]);
    }
  };

  const addItem = async (item, imageFile) => {
    if (typeof window !== 'undefined' && firestore && storage) {
      let imageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `images/${item}_${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity, imageUrl: existingImageUrl } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1, imageUrl: existingImageUrl || imageUrl });
      } else {
        await setDoc(docRef, { quantity: 1, imageUrl });
      }
      await updateInventory();
    }
  };

  const removeItem = async (item) => {
    if (typeof window !== 'undefined' && firestore && storage) {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity, imageUrl } = docSnap.data();
        if (quantity === 1) {
          if (imageUrl) {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          }
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1, imageUrl });
        }
      }
      await updateInventory();
    }
  };

  useEffect(() => {
    if (user) {
      updateInventory();
    }
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return <Auth onAuthStateChanged={setUser} />;
  }

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" bgcolor="#f5f5f5">
      <AppBar position="static" sx={{ marginBottom: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pantry Tracker
          </Typography>
          <Button color="inherit" onClick={() => signOut(auth)}>Logout</Button>
        </Toolbar>
      </AppBar>
      
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          width={400} 
          bgcolor="white" 
          borderRadius={2}
          boxShadow={24} 
          p={4} 
          display="flex" 
          flexDirection="column" 
          gap={3} 
          sx={{ transform: "translate(-50%,-50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined" 
              fullWidth 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={() => {
                addItem(itemName, itemImage);
                setItemName('');
                setItemImage(null);
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Box>
      </Modal>
      
      <Box width="80%" border="1px solid #333" borderRadius={2} overflow="hidden" bgcolor="#ffffff">
        <Box width="100%" bgcolor="#1976d2" p={2} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Add Item
            </Button>
            <Typography variant="h4" color="white">Stored Items</Typography>
          </Box>
          <TextField 
            variant="outlined" 
            placeholder="Search items" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search color="action" />
              ),
            }}
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
        </Box>
        <Stack width="100%" p={2} spacing={2} overflow="auto">
          {filteredInventory.map(({name, quantity, imageUrl}) => (
            <Box
              key={name}
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={2}
              borderRadius={2}
              boxShadow={1}
            >
              <Box display="flex" alignItems="center" gap={2}>
                {imageUrl && <img src={imageUrl} alt={name} width="50" height="50" style={{borderRadius: '50%'}} />}
                <Typography variant="h5" color="#333">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6" color="#333">{quantity}</Typography>
                <IconButton color="primary" onClick={() => addItem(name)}>
                  <Add />
                </IconButton>
                <IconButton color="secondary" onClick={() => removeItem(name)}>
                  <Remove />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}







