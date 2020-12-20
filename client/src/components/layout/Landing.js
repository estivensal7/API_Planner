import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
		marginTop: "70px",
		marginLeft: "70px",
		maxWidth: `calc(100% - 70px)`,
	},
	card: {
		minWidth: "100px",
	},
	bullet: {
		display: "inline-block",
		margin: "0 2px",
		transform: "scale(0.8)",
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

const ProjectList = () => {
	const classes = useStyles();
	const bull = <span className={classes.bullet}>•</span>;

	return (
		<Grid
			container
			className={classes.root}
			spacing={2}
			direction="row"
			alignItems="center">
			<h1>Landing Page</h1>
		</Grid>
	);
};

export default ProjectList;
