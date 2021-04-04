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
            O Asdrubal é um ChatBot que dá dicas nutricionais ao seu colega de
            conversa.
          </h2>
          <h3>
            Se ele não perceber a pergunta, pode sempre ensiná-lo se assim o
            desejar!
          </h3>
        </Grid>
      </Grid>
    </div>
  );
}

export default Footer;
