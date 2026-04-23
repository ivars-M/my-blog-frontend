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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../axios";

const Gallery = () => {
  const [tabValue, setTabValue] = useState(0);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6; // Vari mainīt uz 5, ja vēlies kā iepriekš

  // Stāvokļi augšupielādei un Lightbox
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/gallery");
      setItems(response.data);
    } catch (error) {
      console.error("Kļūda iegūstot galeriju:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadDialogOpen(true);
    }
  };

  const handleUploadSubmit = async () => {
    const formData = new FormData();
    // 1. Vispirms teksta dati (lai Multer backendā tos redzētu)
    formData.append("title", title);
    formData.append("description", description);
    // 2. Tad fails
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const response = await axios.post("/api/gallery/upload", formData);
      setItems((prev) => [response.data, ...prev]);
      setUploadDialogOpen(false);
      setTitle("");
      setDescription("");
      setSelectedFile(null);
    } catch (error) {
      alert("Augšupielādes kļūda!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Vai tiešām dzēst?")) {
      try {
        await axios.delete(`/api/gallery/${id}`);
        setItems((prev) => prev.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Dzēšanas kļūda:", error);
      }
    }
  };
  const getOptimizedVideo = (url) => {
    // Ja url nav padots (ir undefined vai null), atgriežam tukšu virkni
    if (!url) return "";

    if (url.includes("cloudinary")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto/");
    }
    return url;
  };

  // Filtrēšanas loģika paginatoram
  const getFilteredItems = () => {
    let filtered = items;
    if (tabValue === 0)
      filtered = items.filter((item) => item.type === "image");
    else if (tabValue === 1)
      filtered = items.filter((item) => item.type === "video");

    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  };

  const getTotalPages = () => {
    let filtered = items;
    if (tabValue === 0)
      filtered = items.filter((item) => item.type === "image");
    else if (tabValue === 1)
      filtered = items.filter((item) => item.type === "video");
    return Math.ceil(filtered.length / itemsPerPage);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Galerija
      </Typography>

      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Pievienot failu
          </Button>
        </label>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(e, v) => {
          setTabValue(v);
          setPage(1);
        }}
        sx={{ mb: 2 }}
      >
        <Tab label="Attēli" />
        <Tab label="Video" />
        <Tab label="Visi" />
      </Tabs>

      {loading && items.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {getFilteredItems().map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card
                  sx={{ position: "relative", cursor: "pointer" }}
                  onClick={() => setPreviewItem(item)}
                >
                  {/* Virsraksts Augšā */}
                  <Box sx={{ p: 1, backgroundColor: "#f0f0f0" }}>
                    <Typography variant="subtitle2" noWrap fontWeight="bold">
                      {item.title || "Bez virsraksta"}
                    </Typography>
                  </Box>

                  <CardMedia
                    // Ja tas ir video, izmantojam optimizāciju
                    component={item.type === "image" ? "img" : "video"}
                    height="200"
                    // Šeit izmantojam funkciju:
                    src={getOptimizedVideo(item.url)}
                    // Video specifiski uzstādījumi, lai mazinātu slodzi:
                    muted
                    poster={
                      item.type === "video"
                        ? item.url.replace(/\.[^/.]+$/, ".jpg")
                        : undefined
                    }
                    sx={{ objectFit: "cover" }}
                  />

                  {/* Apraksts Apakšā */}
                  <Box sx={{ p: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ height: 20, overflow: "hidden" }}
                    >
                      {item.description}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={(e) => handleDelete(e, item._id)}
                    sx={{
                      position: "absolute",
                      top: 45,
                      right: 8,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": { backgroundColor: "white", color: "red" },
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* PAGINATORS */}
          {getTotalPages() > 1 && (
            <Pagination
              count={getTotalPages()}
              page={page}
              onChange={(e, v) => setPage(v)}
              sx={{ mt: 3, display: "flex", justifyContent: "center" }}
            />
          )}
        </>
      )}

      {/* Augšupielādes informācijas logs */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Faila dati</DialogTitle>
        <DialogContent>
          <TextField
            label="Virsraksts"
            fullWidth
            margin="dense"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Apraksts"
            fullWidth
            margin="dense"
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Atcelt</Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            disabled={loading}
          >
            Sūtīt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lightbox: Pilna izmēra skats */}
      {/* Lightbox: Pilna izmēra skats */}
      {/* DIALOGS: Pilna izmēra apskate (Lightbox) */}
      <Dialog
        open={Boolean(previewItem)}
        onClose={() => setPreviewItem(null)}
        maxWidth="md" // Vidēja platuma logs (nevis lg)
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2, // Noapaļoti stūri
            overflow: "hidden", // Lai neiet pāri stūriem
            bgcolor: "black", // Fons aizpildīs malas, ja bilde būs šaura
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Aizvērt Poga (uz fona) */}
          <IconButton
            onClick={() => setPreviewItem(null)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              zIndex: 10,
              bgcolor: "rgba(0,0,0,0.4)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* MEDIJU KONTEINERS (ŠEIT IR PIELĀGOŠANA) */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
              width: "100%",
              height: "auto", // Ļauj augstumam pielāgoties
            }}
          >
            {previewItem?.type === "image" ? (
              <img
                src={previewItem.url}
                alt={previewItem.title || ""}
                style={{
                  maxWidth: "100%",
                  maxHeight: "75vh", // Foto neaizņems vairāk par 75% no ekrāna augstuma
                  width: "auto", // Saglabā proporcijas
                  height: "auto", // Saglabā proporcijas
                  objectFit: "contain", // Ja foto ir par mazu, tas netiks izstiepts, bet centrēts
                  display: "block",
                }}
              />
            ) : (
              <video
                key={previewItem?._id}
                controls
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  maxHeight: "75vh", // Video neaizņems vairāk par 75% no ekrāna augstuma
                  display: "block",
                  outline: "none",
                }}
              >
                <source
                  src={getOptimizedVideo(previewItem?.url)}
                  type="video/mp4"
                />
              </video>
            )}
          </Box>

          {/* APRAKSTA ZONA (Apakšā uz balta fona) */}
          <Box sx={{ p: 3, bgcolor: "white", color: "black", width: "100%" }}>
            <Typography variant="h6" fontWeight="bold">
              {previewItem?.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              {previewItem?.description}
            </Typography>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Gallery;
