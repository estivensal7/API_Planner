// React / Redux Imports
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

// Material UI Imports
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import Button from "@material-ui/core/Button";

// Navbar - Material-UI Styles
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		backgroundColor: "#212121",
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
		color: "#18ffff",
		"&:hover": {
			color: "#fff",
		},
	},
	hide: {
		display: "none",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		backgroundColor: "#212121",
	},
	drawerClose: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: "hidden",
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9) + 1,
		},
		backgroundColor: "#212121",
	},
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: theme.spacing(0, 1),
		backgroundColor: "#212121",
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	title: {
		flexGrow: 1,
	},
	link: {
		textDecoration: "none",
		color: "inherit",
	},
}));

// Navbar Component
const Navbar = ({ auth: { isAuthenticated }, logout }) => {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	// This function will be called when isAuthenticated === false, thus only rendering the Sign-In & Register links
	const renderGuestLinks = () => {
		return (
			<>
				<Link to="/login" className={classes.link}>
					<Button color="inherit">Login</Button>
				</Link>
				<Link to="/register" className={classes.link}>
					<Button color="inherit">Register</Button>
				</Link>
			</>
		);
	};

	// This function will be called as long as the isAuthenticated === true, thus rendering the Drawer links
	const renderAuthLinks = () => {
		return (
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open,
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open,
					}),
				}}>
				<div className={classes.toolbar}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "rtl" ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon style={{ color: "#18ffff" }} />
						)}
					</IconButton>
				</div>
				<Divider />
				<List>
					<ListItem
						button
						key="Projects"
						className={classes.menuButton}>
						<DashboardIcon className={classes.menuButton} />
						<ListItemText primary="Projects" />
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem
						button
						key="SignOut"
						className={classes.menuButton}>
						<ExitToAppIcon className={classes.menuButton} />
						<ListItemText primary="Sign Out" />
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem
						button
						key="Account"
						className={classes.menuButton}>
						<PersonIcon className={classes.menuButton} />
						<ListItemText primary="Account" />
					</ListItem>
				</List>
			</Drawer>
		);
	};

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open,
				})}>
				<Toolbar>
					{!isAuthenticated ? (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerOpen}
							edge="start"
							className={clsx(classes.menuButton, {
								[classes.hide]: open,
							})}>
							<MenuIcon />
						</IconButton>
					) : null}
					<Typography variant="h6" noWrap className={classes.title}>
						API Planner
					</Typography>
					{!isAuthenticated ? renderGuestLinks() : null}
				</Toolbar>
			</AppBar>
			{!isAuthenticated ? renderAuthLinks() : null}
		</div>
	);
};

Navbar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
