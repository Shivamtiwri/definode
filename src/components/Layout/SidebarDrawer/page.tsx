"use client";
import React, { ReactNode } from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import classNames from "classnames";
import { IoClose } from "react-icons/io5";

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
  isClose?: boolean;
  anchor?: "left" | "right" | "top" | "bottom";
  width?: number | string;
  children?: ReactNode; // ✅ Replaced 'any' with 'ReactNode'
  className?: string;
  boxClassName?: string;
  size?: number;
}
const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onClose,
  anchor = "right",
  children,
  className = "",
}) => {
  return (
    <Drawer
      ModalProps={{
        BackdropProps: {
          style: { backgroundColor: "transparent" },
        },
      }}
      className={classNames("!pt-10 d-md-none d-inline-block", className)}
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "transparent", // or any color
          color: "#fff", // Optional: set text color
        },
      }}
    >
      <Box
        sx={{
          width: " 280px !important",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: 2,
          border: "none",
          // bgcolor: "pink",

          backgroundImage:
            "linear-gradient(to bottom right, rgba(50, 33, 130, 0.9), rgba(103, 45, 146, .9)) !important",
        }}
      >
        {/* {isClose && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {title}
            <IconButton onClick={onClose}>
              <IoClose className="text-white" size={size} />
            </IconButton>
          </Box>
        )} */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            paddingTop: "20px",
            // paddingLeft: 0,
            // bgcolor: "red",
          }}
        >
          {children}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
