"use client";
import { useState, useEffect } from "react";
import { Button, Box, Container, Stack, styled, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "next/navigation";
import '../css/Button.css'

const MobileCarImage = styled("img")({
  width: "100%",
  maxWidth: "900px",
  objectFit: "contain",
  margin: "2rem auto 0",
  display: "block",
  filter: "drop-shadow(0 20px 13px rgb(0 0 0 / 0.1))",
  transition: "all 0.5s ease",
});

export default function CarConfiguratorMobile() {
  const { carName } = useParams();
  const [carColors, setCarColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // function isColorDark(hex) {
  //   if (!hex || hex.length < 6) return false;
  //   const c = hex.charAt(0) === "#" ? hex.substring(1) : hex;
  //   const r = parseInt(c.substring(0, 2), 16);
  //   const g = parseInt(c.substring(2, 4), 16);
  //   const b = parseInt(c.substring(4, 6), 16);
  //   const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  //   return hsp < 127.5;
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the new endpoint that matches colors with swatches
        const response = await axios.get(
          `http://localhost:8000/api/car-color-swatches/${carName}`
        );

        const matchedData = response.data;

        if (matchedData.length === 0) {
          throw new Error(`No matching color data found for car: "${carName.replace(/-/g, ' ')}"`);
        }

        // Format the data for the UI
        const formattedColors = matchedData.map(color => ({
          id: color.id,
          name: color.color_name,
          carName: color.car_name,
          carImage: color.car_image,
          swatchId: color.swatch_id,
          swatchName: color.swatch_name,
          colorCode: color.color_code,
          swatchImage: color.swatch_image,
          displayName: `${carName.replace(/-/g, ' ')} - ${color.color_name}`
        }));

        setCarColors(formattedColors);
        setSelectedColor(formattedColors[0]);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch data');
        setCarColors([]);
      } finally {
        setLoading(false);
      }
    };

    if (carName) {
      fetchData();
    }
  }, [carName]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Box className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></Box>
      </Box>
    );

  if (error)
    return (
      <Typography sx={{ color: "error.main", textAlign: "center", p: 2 }}>
        Error: {error}
      </Typography>
    );

  if (!selectedColor)
    return (
      <Typography sx={{ color: "text.secondary", textAlign: "center", p: 2 }}>
        No color data available
      </Typography>
    );

  return (
    <Box sx={{ position: "relative", width: "100%", minHeight: "30vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Background */}
      <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: `url('http://localhost:8000/${selectedColor.swatchImage}')`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 1 }} />

      {/* Main Content */}
      <Box sx={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <MobileCarImage src={`http://localhost:8000/${selectedColor.carImage}`} alt={selectedColor.carName} />

        {/* Swatches */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, my: 1, px: 2, mx: "auto", py: 1 }}>
          {carColors.map((color) => (
            <Button
              key={color.id}
              onClick={() => setSelectedColor(color)}
              sx={{
                minWidth: 18,
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "2px solid",
                borderColor: selectedColor.id === color.id ? "grey.800" : "grey.300",
                boxShadow: selectedColor.id === color.id ? "0 0 0 2px #4B5563" : "none",
                transition: "all 0.3s ease",
                p: 0,
                overflow: "hidden",
                "&:hover": { borderColor: "grey.600" },
              }}
            >
              <Box component="img" src={`http://localhost:8000/${color.swatchImage}`} alt={color.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Button>
          ))}
        </Box>

        {/* Text & Buttons */}
        <Container maxWidth="sm">
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: "bold", color: selectedColor.textColor, mb: 0.5 }}>
            All New {carName.replace(/-/g, " ")}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1rem", color: selectedColor.textColor, mb: 1.5 }}>
            Feel Special
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <a className="btn outlined" style={{ color: selectedColor.textColor, borderColor: selectedColor.textColor }}>BOOK NOW</a>
            <a className="btn outlined" style={{ color: selectedColor.textColor, borderColor: selectedColor.textColor }}>CONFIGURE</a>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
