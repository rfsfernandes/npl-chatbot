import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import Body from "./components/body";
import { Grid } from "@material-ui/core";

function App() {
  return (
    <div className="App">
      <Grid
        className="grid-container"
        container
        direction="column"
        style={{flexWrap: "nowrap"}}
      >
        <Grid item xs={2} className="remove-max-width">
          <Header />
        </Grid>
        <Grid item xs={8} className="remove-max-width">
          <Body />
        </Grid>
        <Grid item xs={2} className="remove-max-width">
          <Footer />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
