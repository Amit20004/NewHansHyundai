"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, styled } from "@mui/material";
import { Download, PictureAsPdf } from "@mui/icons-material";
import axios from "axios";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
// import { log } from "console";

// Styled Components
const BrochureContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  margin: theme.spacing(3, 0),
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2, 4),
  fontSize: "1.1rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const EBrochurePage = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const carSlug = decodeURIComponent(segments[segments.length - 1]).toLowerCase();

  const [brochure, setBrochure] = useState(null);
  console.log(carSlug);
  
  useEffect(() => {
    const fetchBrochure = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/car-ebrochure-all/${carSlug}`
        );

        if (response.data.success) {
          console.log(response.data.data);
          
          setBrochure(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching brochure:", error);
        toast.error("Failed to fetch brochure");
      }
    };

    if (carSlug) fetchBrochure();
  }, [carSlug]);

  const handleDownload = () => {
    if (!brochure?.file_url) {
      toast.error("File not found");
      return;
    }

    const fileLink = brochure.file_url.startsWith("http")
      ? brochure.file_url
      : `http://localhost:8000/${brochure.file_url.replace(/^\//, "")}`;

    console.log("Downloading from:", fileLink);

    const link = document.createElement("a");
    link.href = fileLink;
    link.setAttribute("download", brochure.file_name || `${brochure.car_name}_brochure.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started");
  };

  if (!brochure)
    return <Typography align="center" sx={{ mt: 6 }}>Loading brochure...</Typography>;

  return (
    <BrochureContainer>
      <PictureAsPdf color="primary" sx={{ fontSize: 80, mb: 2 }} />

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        {brochure.car_name} e-Brochure
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Get complete details about all variants, features, and specifications.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        File: {brochure.file_name} (PDF, {brochure.file_size})
      </Typography>

      <DownloadButton
        variant="contained"
        color="primary"
        startIcon={<Download />}
        onClick={handleDownload}
      >
        Download Brochure
      </DownloadButton>

      <Typography variant="caption" display="block" sx={{ mt: 3, color: "text.secondary" }}>
        Having trouble downloading?{" "}
        <a
          href={
            brochure.file_url.startsWith("http")
              ? brochure.file_url
              : `http://localhost:8000/${brochure.file_url.replace(/^\//, "")}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          View in browser
        </a>
      </Typography>
    </BrochureContainer>
  );
};

export default EBrochurePage;
