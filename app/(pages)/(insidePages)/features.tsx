import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Box, Typography, styled } from "@mui/material";


// Styled components
const FeatureContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto'
}));

const FeatureTableContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  margin: theme.spacing(3, 0),
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const FeatureTable = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 800,
});

const TableHeader = styled('th')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1.5, 2),
  textAlign: 'left',
  fontWeight: 600,
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    borderTopRightRadius: theme.shape.borderRadius,
  },
}));

const TableRow = styled('tr')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TableCell = styled('td')(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  verticalAlign: 'top',
}));

const SubFeature = styled('span')(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginTop: theme.spacing(0.5),
}));

const FeatureIndicator = styled('span')(({ theme }) => ({
  display: 'inline-block',
  width: 20,
  height: 20,
  lineHeight: '20px',
  textAlign: 'center',
  borderRadius: 4,
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const AccordionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const renderFeatureIndicator = (value) => {
  if (value === "S") {
    return <FeatureIndicator>S</FeatureIndicator>;
  }
  if (value === "-") {
    return <span>-</span>;
  }
  return <span>{value}</span>;
};

const renderTable = (headers, rows) => (
  <FeatureTableContainer>
    <FeatureTable>
      <thead>
        <tr>
          {headers.map((header, hIndex) => (
            <TableHeader key={hIndex}>{header}</TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rIndex) => (
          <TableRow key={rIndex}>
            <TableCell>
              {row.feature}
              {row.subFeature && <SubFeature>{row.subFeature}</SubFeature>}
            </TableCell>
            <TableCell>{renderFeatureIndicator(row.era)}</TableCell>
            <TableCell>{renderFeatureIndicator(row.magna)}</TableCell>
            <TableCell>{renderFeatureIndicator(row.corporate)}</TableCell>
            <TableCell>{renderFeatureIndicator(row.sportz)}</TableCell>
            <TableCell>{renderFeatureIndicator(row.sportzO)}</TableCell>
            <TableCell>{renderFeatureIndicator(row.asta)}</TableCell>
          </TableRow>
        ))}
      </tbody>
    </FeatureTable>
  </FeatureTableContainer>
);

const FeaturesPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
   <>
    <FeatureContainer sx={{width:"full", maxWidth:"1397px", mx:"auto" , backgroundColor:"#f7f5f2",
     
    }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        fontWeight: 600,
        textAlign: "center",
        mb: 4,
        color: "text.primary"
      }}>
        Features
      </Typography>

      {/* Exterior Features Table */}
      <Typography variant="h5" component="h3" gutterBottom sx={{ 
        fontWeight: 500,
        color: "primary.main",
        mb: 2
      }}>
        EXTERIOR
      </Typography>
      {renderTable(exteriorFeaturesTable.headers, exteriorFeaturesTable.rows)}

      {/* Accordion for other feature sections */}
      <Box sx={{ mt: 4 }}>
        {featuresAccordionItems.map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <AccordionHeader onClick={() => toggleItem(index)}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {item.title}
              </Typography>
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </AccordionHeader>
            {openIndex === index && (
              <Box sx={{ p: 2 }}>
                {renderTable(item.tableData.headers, item.tableData.rows)}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </FeatureContainer>

    </>
  );
};

export default FeaturesPage;

// Data for the static "Exterior" table
const exteriorFeaturesTable = {
  headers: ["Feature", "Era", "Magna", "Corporate", "Sportz", "Sportz(O)", "Asta"],
  rows: [
    { feature: "Painted Black Radiator Grille", era: "-", magna: "S", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
    { feature: "Projector Headlamps", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
    { feature: "LED Daytime Running Lamps (DRLs)", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
    { feature: "LED Taillamp", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
    { feature: "R14 (D=354.8mm) Wheel Cover", era: "S", magna: "-", corporate: "-", sportz: "-", sportzO: "-", asta: "-" },
    { feature: "R15 (D=380.2mm) Dual Tone Styled Steel Wheel", era: "-", magna: "S", corporate: "S", sportz: "-", sportzO: "-", asta: "-" },
    { feature: "R15 (D=380.2mm) Diamond Cut Alloy Wheels", era: "-", magna: "-", corporate: "-", sportz: "DT only", sportzO: "S", asta: "S" },
    { feature: "Bumpers", subFeature: "Body Colored", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
    { feature: "", subFeature: "Outside Door Mirrors", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
    { feature: "", subFeature: "Outside Door Handles", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
    { feature: "Chrome Outside Door Handles", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
    { feature: "Roof Rails", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
    { feature: "Antenna", subFeature: "Roof Antenna", era: "S", magna: "S", corporate: "S", sportz: "-", sportzO: "-", asta: "-" },
    { feature: "", subFeature: "Sharkfin Antenna", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
    { feature: "B Pillar & Window Line Black Out Tape", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
    { feature: "Turn Indicators On Outside Mirrors", era: "-", magna: "AMT Only", corporate: "AMT Only", sportz: "S", sportzO: "S", asta: "S" },
  ],
};

// Data for the accordion sections (same as your original data)
const featuresAccordionItems = [
  {
    title: "INTERIOR",
    tableData: {
      headers: ["Feature", "Era", "Magna", "Corporate", "Sportz", "Sportz(O)", "Asta"],
      rows: [
        { feature: "Premium Glossy Block Inserts", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Footwell Lighting", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Leather Wrapped Steering Wheel", era: "-", magna: "-", corporate: "-", sportz: "DT only", sportzO: "-", asta: "S" },
        { feature: "Chrome Finish", subFeature: "Gear Knob", era: "-", magna: "AMT Only", corporate: "AMT Only", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Parking Lever Tip", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "-", asta: "S" },
        { feature: "Front & Rear Door Map Pocket", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Front Room Lamp", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Front Passenger Seat Back Pocket", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Metal Finish Inside Door Handles", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
      ],
    },
  },
  {
    title: "INSTRUMENT PANEL & CENTER FASCIA DISPLAY",
    tableData: {
      headers: ["Feature", "Era", "Magna", "Corporate", "Sportz", "Sportz(O)", "Asta"],
      rows: [
        { feature: "Tachometer", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Warning & Indicators", subFeature: "Gear Shift (MT Only)", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Door & Tailgate Ajar", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Low Fuel", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "8.89 cm (3.5\") Speedometer With Multi Information Display", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Multi Information Functions", subFeature: "Dual Tripmeter", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Distance To Empty", era: "S", magna: "PL ONLY", corporate: "PL ONLY", sportz: "PL ONLY", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Average Fuel Consumption", era: "S", magna: "PL ONLY", corporate: "PL ONLY", sportz: "PL ONLY", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Instantaneous Fuel Consumption", era: "S", magna: "PL ONLY", corporate: "PL ONLY", sportz: "PL ONLY", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Average Vehicle Speed", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Elapsed Time", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Service Reminder", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
      ],
    },
  },
  {
    title: "AUDIO",
    tableData: {
      headers: ["Feature", "Era", "Magna", "Corporate", "Sportz", "Sportz(O)", "Asta"],
      rows: [
        { feature: "2-DIN Integrated Audio With AM/FM", era: "-", magna: "S", corporate: "-", sportz: "-", sportzO: "-", asta: "-" },
        { feature: "17.14 cm (6.75\") Touchscreen Display Audio##", era: "-", magna: "-", corporate: "S", sportz: "-", sportzO: "-", asta: "-" },
        { feature: "20.25 cm (8\") Touchscreen Display Audio With Smart Phone Navigation*", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Apple CarPlay", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Android Auto", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Voice Recognition*", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Bluetooth Connectivity", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Steering Wheel Mounted Controls", subFeature: "Audio", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Bluetooth", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Front & Rear Speakers", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "USB Port Connectivity", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
      ],
    },
  },
  {
    title: "CONFORT & CONVINIENCE", // Renamed from the images to cover more features
    tableData: {
      headers: ["Feature", "Era", "Magna", "Corporate", "Sportz", "Sportz(O)", "Asta"],
      rows: [
        { feature: "Wireless Phone Charger#", era: "-", magna: "-", corporate: "-", sportz: "DT Only", sportzO: "-", asta: "S" },
        { feature: "Smartkey With Push Button Start/Stop", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Keyless Entry", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Cruise Control", era: "-", magna: "-", corporate: "-", sportz: "PL Only", sportzO: "S", asta: "S" },
        { feature: "Motor Driven (Electric) Power Steering", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Tilt Steering", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Air Conditioning", era: "Manual", magna: "Manual", corporate: "Manual", sportz: "Manual^/ Auto", sportzO: "Auto", asta: "Auto" },
        { feature: "Rear AC Vent", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Eco Coating", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Power Windows", subFeature: "Front", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Rear", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Auto Down (Driver Only)", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Outside Mirror", subFeature: "Electrically Adjustable", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Electric Folding", era: "-", magna: "AMT Only", corporate: "AMT Only", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Power Outlet", subFeature: "Front", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Rear", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Front USB Charger (C Type)", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
        { feature: "Driver Seat Height Adjustment", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Passenger Vanity Mirror", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Rear Parcel Tray", era: "-", magna: "-", corporate: "-", sportz: "S^^", sportzO: "S", asta: "S" },
        { feature: "Tyre mobility kit (TMK)", era: "-", magna: "Hy-CNG Duo only", corporate: "-", sportz: "Hy-CNG Duo only", sportzO: "-", asta: "-" },
        { feature: "Battery Saver", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Adjustable Rear Headrests", era: "-", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Rear Wiper Washer", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Luggage Lamp", era: "-", magna: "-", corporate: "-", sportz: "PL Only", sportzO: "S", asta: "S" },
        { feature: "Automatic Headlamps", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
      ],
    },
  },
  {
    title: "SAFETY",
    tableData: {
      headers: ["Feature", "Era", "Magna", "Corporate", "Sportz", "Sportz(O)", "Asta"],
      rows: [
        { feature: "Airbag", subFeature: "Driver", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Passenger", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Side", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Curtain", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
        { feature: "Electronic Stability Control (ESC)", era: "-", magna: "AMT Only", corporate: "AMT Only", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Vehicle Stability Management(VSM)", era: "-", magna: "AMT Only", corporate: "AMT Only", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Hill Start Assist Control (HAC)", era: "-", magna: "AMT Only", corporate: "AMT Only", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "ABS (Anti-Lock Braking System) With EBD", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Seat Belt Pretensioners & Load Limiters", subFeature: "Driver", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "", subFeature: "Passenger", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Tyre Pressure Monitoring System - Highline", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
        { feature: "Child Seat Anchor (ISOFIX)", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Speed Sensing Auto Door Lock", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Impact Sensing Auto Door Unlock", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Immobilizer", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Central Locking", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Burglar Alarm", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Emergency Stop Signal", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Day & Night Inside Rear View Mirror", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
        { feature: "Rear Parking Sensors", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Rear Camera With Static Guidelines", era: "-", magna: "-", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Rear Defogger", era: "-", magna: "-", corporate: "-", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "3 Point Seat Belts(All Seats)", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Seat Belt Reminder (All Seats)", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Speed Alert System", era: "S", magna: "S", corporate: "S", sportz: "S", sportzO: "S", asta: "S" },
        { feature: "Headlamp Escort System", era: "-", magna: "-", corporate: "-", sportz: "-", sportzO: "S", asta: "S" },
      ],
    },
  },
];