import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  Pagination,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "../axios";

const Gallery = () => {
  const [tabValue, setTabValue] = useState(0);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/gallery"); // Jūsu backend galapunkts
      setItems(response.data);
    } catch (error) {
      console.error("Kļūda iegūstot galeriju:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post("/api/gallery/upload", formData);
        setItems((prev) => [...prev, response.data]);
      } catch (error) {
        console.error("Augšupielādes kļūda:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/gallery/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Dzēšanas kļūda:", error);
    }
  };

  const getFilteredItems = () => {
    let filtered;
    if (tabValue === 0)
      filtered = items.filter((item) => item.type === "image");
    else if (tabValue === 1)
      filtered = items.filter((item) => item.type === "video");
    else filtered = items;

    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  };

  const getTotalPages = () => {
    let filtered;
    if (tabValue === 0)
      filtered = items.filter((item) => item.type === "image");
    else if (tabValue === 1)
      filtered = items.filter((item) => item.type === "video");
    else filtered = items;
    return Math.ceil(filtered.length / itemsPerPage);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Galerija
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Box
            component="label"
            htmlFor="file-input"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: "8px 16px",
              backgroundColor: "#1976d2",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            <CloudUploadIcon />
            Augšupielādēt
          </Box>
        </label>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Attēli" />
        <Tab label="Video" />
        <Tab label="Visi" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {getFilteredItems().map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={{ position: "relative" }}>
                  <CardMedia
                    component={item.type === "image" ? "img" : "video"}
                    height="200"
                    src={item.url}
                    controls={item.type === "video"}
                    sx={{ objectFit: "cover" }}
                  />
                  <IconButton
                    onClick={() => handleDelete(item._id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>

          {getTotalPages() > 1 && (
            <Pagination
              count={getTotalPages()}
              page={page}
              onChange={handlePageChange}
              sx={{ mt: 3, display: "flex", justifyContent: "center" }}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Gallery;
