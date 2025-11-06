"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button, Box, styled, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import CarDetailPageMobile from "../components/CarColorChangeMobile";
import Btn from '../components/ui/Button'
import DataNotFound from '../components/error/DataNotFound'
import Image from 'next/image';

// Styled components
// const CarImageContainer = styled(Box)({
//   position: "absolute",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   pointerEvents: "none",
//   zIndex: 10,
// });

// const CarImage = styled("img")({
//   position: "absolute",
//   top: "50%",
//   transform: "translate(-30%, -50%)",
//   width: "100%",
//   maxWidth: "64rem",
//   objectFit: "contain",
//   filter: "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03))",
//   transition: "all 0.5s ease",
// });

// Custom hook for media query with safe SSR handling
function useSafeMediaQuery(query, defaultState = false) {
  const [state, setState] = useState(defaultState);
  // const theme = useTheme();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(query);
      
      const updateState = () => {
        setState(mediaQuery.matches);
      };
      
      // Set initial state
      updateState();
      
      // Add listener
      mediaQuery.addEventListener('change', updateState);
      
      // Clean up
      return () => {
        mediaQuery.removeEventListener('change', updateState);
      };
    }
  }, [query]);
  
  return state;
}

const CarColorChange = () => {
  const { carName } = useParams();
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // Use our safe media query hook
  const isMobile = useSafeMediaQuery('(max-width: 900px)');
  
  useEffect(() => {
    setIsClient(true);
  }, []);

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

        setColors(formattedColors);
        setSelectedColor(formattedColors[0]);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch data');
        setColors([]);
      } finally {
        setLoading(false);
      }
    };

    if (carName) {
      fetchData();
    }
  }, [carName]);

  const formattedName = carName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
      <Box className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></Box>
    </Box>
  );

  if (error) return (
    <DataNotFound msg={error} />
  );

  if (!selectedColor) return (
    <Typography sx={{ color: 'text.secondary', textAlign: 'center', p: 2 }}>
      No color data available
    </Typography>
  );

  return (
    <>
      {isMobile ? (
        <CarDetailPageMobile 
          colors={colors}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          formattedName={formattedName}
        />
      ) : (
        <>
          {/* Main Desktop Container */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "500px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              justifyContent:"center",
              alignItems:"center",
              maxWidth:"1400px",
              mx:"auto",
              // boxShadow: 3,
            }}
          >
            {/* Left Section (60%) - White Background */}
            <Box
              sx={{
                width: "60%",
                height: "100%",
                backgroundColor: "white",
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: "10%",
                paddingRight: "5%",
                "@media (max-width: 1024px)": {
                  paddingLeft: "8%",
                  paddingRight: "4%",
                },
                "@media (max-width: 768px)": {
                  paddingLeft: "5%",
                  paddingRight: "3%",
                },
              }}
            >
              {/* Car Image (positioned absolutely) */}
              <Box
                sx={{
                  position: "absolute",
                  top: "40%",
                  left: "106%",
                  transform: "translate(-30%, -50%)",
                  width: "90%",
                  maxWidth: "900px",
                  zIndex: 2,
                  "@media (max-width: 1440px)": {
                    width: "85%",
                  },
                  "@media (max-width: 1024px)": {
                    width: "80%",
                    left: "94%",
                  },
                  "@media (max-width: 768px)": {
                    width: "75%",
                    left: "96%",
                  },
                }}
              >
                <Image
                width={100} height={100} quality={100} unoptimized={true}
                  src={`http://localhost:8000/${selectedColor.carImage}`}
                  alt={selectedColor.name}
                  style={{
                    width: "80%",
                    height: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 20px 13px rgba(0,0,0,0.03))",
                  }}
                />
              </Box>

              {/* Text Content */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 3,
                  "@media (max-width: 1024px)": {
                    marginTop: "40px",
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    lineHeight: 1.2,
                    "@media (max-width: 1440px)": {
                      fontSize: "2.5rem",
                    },
                    "@media (max-width: 1024px)": {
                      fontSize: "2rem",
                    },
                    "@media (max-width: 768px)": {
                      fontSize: "1.8rem",
                    },
                  }}
                >
                  All New {formattedName}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1.125rem",
                    color: "#6B7280",
                    marginBottom: "2rem",
                    "@media (max-width: 1440px)": {
                      fontSize: "1rem",
                    },
                    "@media (max-width: 1024px)": {
                      fontSize: "0.9rem",
                    },
                  }}
                >
                  {selectedColor.name} Color
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                    "@media (max-width: 768px)": {
                      flexDirection: "column",
                    },
                  }}
                >
                  <Btn btnName={"BOOK NOW"} />
                  <Btn btnName={"CONFIGURE"} />
                </Box>
              </Box>
            </Box>

            {/* Right Section (40%) - Color Background */}
            <Box
              sx={{
                width: "40%",
                backgroundImage: `url('http://localhost:8000/${selectedColor.swatchImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: "15%",
                "@media (max-width: 1024px)": {
                  paddingBottom: "12%",
                },
                "@media (max-width: 768px)": {
                  paddingBottom: "10%",
                },
                height: "500px"           
              }}
            >
              {/* Color Name */}
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                {selectedColor.name}
              </Typography>

              {/* Color Swatches */}
              <Box
                sx={{
                  display: "flex",
                  gap: "0.5rem",
                  backdropFilter: "blur(4px)",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  padding: "0.5rem",
                  borderRadius: "2rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  position: "relative",
                  maxWidth: {
                    xs: "95%",
                    sm: "95%",
                    md: "90%",
                    lg: "95%",
                    xl: "95%",
                  },
                  top: {
                    xs: "20%",
                    md: "20%",
                    lg: "60%",
                    xl: "65%",
                  },
                }}
              >
                {colors.map((color) => (
                  <Button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      minWidth: "24px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor:
                        selectedColor.id === color.id ? "white" : "rgba(255,255,255,0.5)",
                      boxShadow:
                        selectedColor.id === color.id
                          ? "0 0 0 2px #4B5563"
                          : "none",
                      p: 0,
                      overflow: "hidden",
                      "&:hover": {
                        borderColor: "white",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Image
                    width={100} height={100} quality={100} unoptimized={true}
                      src={`http://localhost:8000/${color.swatchImage}`}
                      alt={color.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default CarColorChange;