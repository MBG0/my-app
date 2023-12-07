"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Tab,
  Tabs,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import {
  getFirestore,
  Firestore,
  arrayUnion,
  collection,
  CollectionReference,
  DocumentReference,
  Timestamp,
  updateDoc,
  database,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Profile = () => {
  const { user } = UserAuth();
  const [value, setValue] = React.useState(0);
  const [rentedBook, setRentedBook] = useState([]);

  console.log("prof user", user);

  const handleReturnBook = async (bookId) => {
    console.log("returned book id", bookId);

    try {
      const userRef = doc(db, "users", user.fbUid);
      await updateDoc(userRef, {
        rentedBooks: user.rentedBooks.filter((book) => book.bookId !== bookId),
      });

      const bookRef = doc(db, "books", bookId);
      await updateDoc(bookRef, {
        isRent: false,
      });

      alert("Book is returned");
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  };

  console.log("test", user);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="'p-4">
      {user ? (
        <Box className="p-4" sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab textColor="secondary" label="Item One" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Grid>
              <Grid item xs={12}>
                <Grid container>
                  {user?.rentedBooks.map((book) => (
                    <Card sx={{ maxWidth: 345 }} key={book.bookId}>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {book.bookName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Lizards are a widespread group of squamate reptiles,
                          with over 6,000 species, ranging across all continents
                          except Antarctica
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() =>
                            handleReturnBook(book.bookId, book.bookName)
                          }
                          size="small"
                        >
                          Return
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Item Two
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Item Three
          </CustomTabPanel>
        </Box>
      ) : (
        <p className="p-4">You must be logged in to view this page</p>
      )}
    </div>
  );
};

export default Profile;
