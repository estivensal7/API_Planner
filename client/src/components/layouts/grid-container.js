import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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

export default function GridContainer() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Grid
      container
      className={classes.root}
      spacing={2}
      direction="row"
      alignItems="center"
    >
      {{ children }}
    </Grid>
  );
}
