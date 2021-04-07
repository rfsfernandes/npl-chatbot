import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import Body from "./components/body";
import { Grid } from "@material-ui/core";

function App() {
  return (
    <div className="App">
      <div className="bot-cartoon-container">
        <img className="bot-cartoon" src="icon.png"/>
      </div>
      <div className="human-cartoon-container">
        <img className="human-cartoon" src="human.png" width="10%"/>
      </div>
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
          <Body/>
        </Grid>
        <Grid item xs={2} className="remove-max-width">
          <Footer />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
