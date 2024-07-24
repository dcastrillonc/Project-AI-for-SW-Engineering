import React from "react";
import Link from "next/link"; 
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import { Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import TimelineIcon from "@mui/icons-material/Timeline";

import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
} from "@mui/material";

import { Home } from "@mui/icons-material";
import Slide from "@mui/material/Slide"; // Import the Slide component from Material-UI
import useScrollTrigger from "@mui/material/useScrollTrigger"; // Import the useScrollTrigger hook
import CssBaseline from "@mui/material/CssBaseline";
import Image from "next/image";

function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

function ResponsiveAppBar(props) {
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const theme = useTheme();
    console.log(theme);
    const isMatch = useMediaQuery(theme.breakpoints.down("md"));
    console.log(isMatch);

    return (
        <React.Fragment>
            <CssBaseline />
            <HideOnScroll {...props}>
                <AppBar
                    className="navbar1"
                    style={{
                        width: "93.5%",
                        right: "3.2%",
                        border: "2px solid white",
                        borderRadius: "30px",
                        background:
                            "linear-gradient( 90deg, rgba(78, 78, 246, 0.647) 0%, rgba(247, 90, 216, 0.696) 100% )",
                    }}
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    mr: 2,
                                    display: { xs: "none", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                                className="cursorp"
                            >

                                {/*<Image
                                    src="/imagenes/fill_blanco.png"
                                    style={{ width: "100%", height: "auto" }}
                                    alt="logo"
                                    width={100}
                                    height={100}
                                    loading="lazy"
                                />*/}
                            </Typography>

                            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>

                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href=""
                                sx={{
                                    mr: 2,
                                    display: { xs: "flex", md: "none" },
                                    flexGrow: 1,
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                {" "}

                                {/*<Image
                                    src="/imagenes/fill_blanco.png"
                                    style={{ width: "100%", height: "auto" }}
                                    alt="logo"
                                    width={100}
                                    height={100}
                                    loading="lazy"
                                />*/}
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                                {isMatch ? (
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleOpenNavMenu}
                                        color="inherit"
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                ) : (
                                    <>
                                        <Tabs centered sx={{ margin: "auto" }}>


                                            <Tab
                                                label={
                                                    <Link
                                                        href="/events"
                                                        style={{
                                                            textDecoration: "none",
                                                            color: "white",
                                                            opacity: "1",
                                                        }}
                                                    >
                                                        <p>
                                                            {" "}
                                                            <InfoIcon />  Events
                                                        </p>
                                                    </Link>
                                                }
                                                className="Tab2 animate__animated animate__zoomIn"
                                            >
                                                {" "}
                                            </Tab>



                                            <Tab
                                                value="three"
                                                label={
                                                    <p>
                                                        <Link
                                                            href="/bets"
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <TimelineIcon /> Bets
                                                        </Link>
                                                    </p>
                                                }
                                                className="Tab3 animate__animated animate__zoomIn"
                                            />


                                            <Tab
                                                value="one"
                                                label={
                                                    <p>
                                                        <Home /> Profile
                                                    </p>
                                                }
                                                onClick={() => {
                                                    window.location.href = "/profile";
                                                }}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "white",
                                                }}
                                                className="Tab1 animate__animated animate__zoomIn"
                                            />
                                        </Tabs>
                                    </>
                                )}
                            </Box>

                            <Box sx={{ flexGrow: 0 }}>

                                <Menu
                                    id="menu-appbar-avatar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top", // Adjust to match the new position
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: "block", md: "none" },
                                    }}
                                >
                                    {/* <Drawer
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                  > */}
                                    <List className="DrawerList">
                                        

                                        <ListItemButton>
                                            <ListItemIcon>
                                                <InfoIcon />
                                            </ListItemIcon>
                                            <Link
                                                href="/events"
                                                
                                            >
                                                <ListItemText
                                                    onClick={handleCloseNavMenu}
                                                    primary={"Events"}
                                                />{" "}
                                            </Link>
                                        </ListItemButton>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <TimelineIcon />
                                            </ListItemIcon>
                                            <Link
                                                href="/bets"
                                            >
                                                <ListItemText
                                                    onClick={handleCloseNavMenu}
                                                    primary={"Bets"}
                                                />
                                            </Link>
                                        </ListItemButton>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <Home />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={"Profile"}
                                                onClick={() => {
                                                    window.location.href = "/profile";
                                                }}
                                            />
                                        </ListItemButton>
                                    </List>
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
        </React.Fragment>
    );
}
export default ResponsiveAppBar;
