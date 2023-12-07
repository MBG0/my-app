"use client";
import React from "react";
import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  Grid,
  Button,
  Tab,
  Tabs,
  Box,
  Typography,
  Table,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Paper,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { db } from "../firebase";

const Books = () => {
  const { user } = UserAuth();
  const [books, setBooks] = useState([]);

  const handleRent = async (bookId, bookName) => {
    console.log("rented book id", bookId);

    try {
      const userRef = doc(db, "users", user.fbUid);
      await updateDoc(userRef, {
        rentedBooks: arrayUnion({
          bookId: bookId,
          bookName: bookName,
          rentDate: Timestamp.now(),
        }),
      });

      const bookRef = doc(db, "books", bookId);
      await updateDoc(bookRef, {
        isRent: true,
      });

      alert("Book is rented");
      window.location.reload();
    } catch (error) {
      alert("something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const booksRef = collection(db, "books");
      const books = await getDocs(
        query(booksRef, where("isRent", "==", false))
      ).then((snapshot) => {
        const booksData = snapshot.docs.map((doc) => {
          console.log("test12", doc);
          return {
            id: doc.id,
            name: doc.data().name,
          };
        });
        setBooks(booksData);
      });
    };

    return () => fetchBooks();
  }, []);

  console.log("books", books);

  return (
    <Grid>
      <Grid item xs={12}>
        <Grid container>
          {books?.map((book) => (
            <Card sx={{ maxWidth: 345 }} key={book.id}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {book.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => handleRent(book.id, book.name)}
                  size="small"
                >
                  Rent
                </Button>
              </CardActions>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Books;
