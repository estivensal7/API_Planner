import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const Login = ({ login, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;

	const useStyles = makeStyles((theme) => ({
		root: {
			"& > *": {
				margin: theme.spacing(1),
				width: "25ch",
			},
			grid: {
				flexGrow: 1,
				marginTop: "70px",
				marginLeft: "70px",
				maxWidth: `calc(100% - 70px)`,
			},
		},
	}));
	const classes = useStyles();

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	if (isAuthenticated) {
		return <Redirect to="/dashboard" />;
	}

	return (
		<Grid
			container
			className={classes.grid}
			spacing={2}
			direction="row"
			alignItems="center">
			<form className={classes.root} noValidate autoComplete="off">
				<TextField id="standard-basic" label="Standard" />
				<TextField id="filled-basic" label="Filled" variant="filled" />
				<TextField
					id="outlined-basic"
					label="Outlined"
					variant="outlined"
				/>
			</form>
		</Grid>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
