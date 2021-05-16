import { Grid } from "@material-ui/core";
import React from "react";

function Footer() {
  return (
    <div className="footer">
      <Grid
        style={{ height: "100%" }}
        container
        justify="center"
        alignContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <h2>
            Venha visitar-nos para uma experiência inesquecível.
          </h2>
         
        </Grid>
      </Grid>
    </div>
  );
}

export default Footer;
