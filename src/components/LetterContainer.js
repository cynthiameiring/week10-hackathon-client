import React, { Component } from "react";
import { connect } from "react-redux";
import Letter from "./Letter";
import Target from "./Target";
import "./Letter.css";
import { moveLetter } from "../actions/letter";
import { getLetters } from "../actions/word";
import { words } from "../data";
import GameLogic from "./GameLogic";
import shortid from "shortid";

class LetterContainer extends Component {
  state = { pickedWord: null, randomKey: null };

  componentDidMount() {
    this.pickWord();
    // this.setState({});
  }

  pickWord = () => {
    const numberOfWords = words.length;
    const randomNumber = Math.floor(Math.random() * numberOfWords);
    const pickedWord = words[randomNumber];
    this.props.getLetters(pickedWord.word);
    this.setState({ pickedWord: pickedWord });
  };

  renderLetter(letter, targetId) {
    console.log("render a letter");
    if (!letter) {
      return <div></div>;
    }
    return (
      <Letter
        targetId={targetId}
        name={letter}
        currentLetterDragged={this.currentLetterDragged}
      />
    );
  }

  handleClick = () => {
    this.pickWord();
    //generate a random Key for the animation to happen when rerendering
    this.setState({ randomKey: shortid.generate() });
  };

  render() {
    if (this.props.targetBlocks.length === 0) {
      return "loading..";
    }
    const firstHalf = [...this.props.targetBlocks].splice(
      0,
      this.props.letters.length
    );
    const secondHalf = [...this.props.targetBlocks].splice(
      this.props.letters.length
    );

    console.log("new letters", this.props.letters);
    return (
      <div className="app">
        <div className="travel-image-container" key={this.state.randomKey}>
          {" "}
          <img
            alt=""
            className="animated travel-image"
            src={this.state.pickedWord.url}
          ></img>
        </div>

        <div
          className="letter-container"
          // style={{ overflow: "hidden", clear: "both" }}
        >
          {firstHalf.map(target => (
            <Target
              key={target.id}
              id={target.id}
              moveLetter={this.props.moveLetter}
              className="target"
            >
              {this.renderLetter(target.letter, target.id)}
            </Target>
          ))}
        </div>
        <div className="target-container">
          {secondHalf.map(target => (
            <Target
              key={target.id}
              id={target.id}
              moveLetter={this.props.moveLetter}
              className="placeholder"
            >
              {this.renderLetter(target.letter, target.id)}
            </Target>
          ))}
        </div>
        <GameLogic
          // startNewGame={this.pickWord}
          pickedWord={this.state.pickedWord.word}
          amountOfLetters={this.props.letters.length}
        />
        <button onClick={this.handleClick}>Next</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    letters: state.letters,
    targetBlocks: state.targetBlocks
  };
};

export default connect(mapStateToProps, {
  moveLetter,
  getLetters
})(LetterContainer);
