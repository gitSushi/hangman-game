import React from 'react';
import './App.css';

const WORDS = [
  "SOURIS",
  "TOMATE",
  "GUITARE",
  "MICROBE",
  "ESCALIER",
  "FRACTION",
  "CHAUSSURE",
  "RICOCHETS",
  "SOCIOLOGIE",
  "HYPNOTISER",
  "AGORAPHOBIE",
  "PHILOSOPHIE"
];
const GALLOWS_SVG = [
  "M30 280 l120 0",
  "M60 280 l0 -260",
  "M40 40 l210 0",
  "M60 85 L120 40",
  "M210 40 l0 30",
  "M185 95 a 25,25 0 1 0 50,0 a 25,25 0 1 0 -50,0",
  "M210 120 l0 85",
  "M170 160 l80 0",
  "M210 205 L175 245",
  "M210 205 L245 245"
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.hangman = React.createRef();
    this.state = {
      keys: [],
      word: this.randWord(),
      abc: this.alphabet(),
      status: "playing",
      count: 0
    };
  }

  randWord() {
    const idx = Math.floor(Math.random() * WORDS.length);
    return WORDS[idx];
  }
  show() {
    let { keys, word } = this.state;
    return word.replace(/\w/g, char => (keys.includes(char) ? char : "_"));
  }
  alphabet() {
    let abc = new Array(26);
    // fill the array with a static value in preparation of map since it doesn't work on undefined values : just to avoid a loop
    abc.fill(0);
    return abc.map((char, index) => (char = String.fromCharCode(65 + index)));
  }
  feedback(char) {
    const { keys } = this.state;
    if (keys.includes(char)) {
      return "#e2e6ea";
    }
  }
  gameStatus() {
    let { word, keys } = this.state;
    if (
      word.split("").filter(char => keys.includes(char)).length === word.length
    ) {
      this.setState({ status: "YEAH, YOU WON !!" });
    }
    if (keys.filter(elt => !word.includes(elt)).length > 9) {
      this.setState({ status: "SNIF, YOU LOST" });
    }
  }
  drawHangman(count) {
    const GALLOWS_PATH = new Path2D(GALLOWS_SVG[count]);
    const canvas = this.hangman.current;
    const ctx = canvas.getContext("2d");
    ctx.stroke(GALLOWS_PATH);
  }

  // bound func
  typedKey = (event) => {
    let { keys, word, count } = this.state;
    let userChoice = event.target.textContent;
    if (!word.includes(userChoice)) {
      this.drawHangman(count);
      this.setState({
        count: count + 1
      });
    }
    this.setState({ keys: [...keys, userChoice] }, this.gameStatus);
  };
  newGame = () => {
    this.setState({
      keys: [],
      word: this.randWord(),
      status: "playing",
      count: 0
    });
  };

  render() {
    let { abc, status, count } = this.state;
    return (
      <div className="container-fluid text-center">
        {/* thought : start with a modal : not for the fainthearted */}
        <h1>JEU DU PENDU</h1>
        {status === "playing" ? (
          <div>
            <div className="row justify-content-center">
              <h2 style={{ letterSpacing: 10 }}>{this.show()}</h2>
            </div>
            <div className="row">
              <div className="col-lg-3 d-flex justify-content-center align-items-center">
                {/*column in prep of player 2*/}
                {count === 9 ? (<p>chance restante : {10 - count}</p>) : (<p>chances restantes : {10 - count}</p>) }
              </div>
              <div className="col-lg-5 d-flex justify-content-center align-items-center">
                <p>
                  {abc.map((char, idx) => (
                    <button
                      key={idx}
                      className="btn btn-light m-1"
                      style={{ background: this.feedback(char) }}
                      onClick={this.typedKey.bind(this)}
                    >
                      {char}
                    </button>
                  ))}
                </p>
              </div>
              <div className="col-lg-4">
                <canvas ref={this.hangman} height="302" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3>{status}</h3>
            <button className="d-block mx-auto" onClick={this.newGame}>
              New game
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
