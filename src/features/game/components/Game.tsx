import * as React from 'react';

import TextField from 'material-ui/TextField';

import EndGameButton from '../containers/EndGameButton';
import { StateProps, DispatchProps } from '../containers/Game';
import ConjugationsTable from '../containers/ConjugationsTable';
import AccentedLetterKey from './AccentedLetterKey';
import GameCard from './GameCard';

import './Game.css';

const accentedLettersMap = {
  a: 'á',
  e: 'é',
  i: 'í',
  n: 'ñ',
  o: 'ó',
  u: 'ú'
};
enum KeyboardKeys {
  Shift = 'Shift',
  Enter = 'Enter'
}

// for some reason need to delay calling of input functions e.g. focus
// to get them to work. This delay time seems to work okay.
const inputFuncsDelay = 100;

type State = {
  lastKeyPressed: string;
};

class Game extends React.PureComponent<StateProps & DispatchProps, State> {
  answerInput: TextField;
  answerInputHTML: HTMLInputElement;
  mounted: boolean;

  state = {
    lastKeyPressed: ''
  };

  componentDidMount() {
    this.props.initialiseGame();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.mounted = true;
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.mounted = false;
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const { key } = e;
    const { lastKeyPressed } = this.state;
    this.setState({
      lastKeyPressed: key
    });
    if (key === KeyboardKeys.Enter) {
      this.submitAndFocus();
    } else if (!!lastKeyPressed) {
      const lastTwoKeysPressed = [key, lastKeyPressed];
      if (lastTwoKeysPressed.includes(KeyboardKeys.Shift)) {
        const otherKeyPressed = lastTwoKeysPressed
          .filter(k => k !== KeyboardKeys.Shift)[0]
          .toLowerCase();
        if (Object.keys(accentedLettersMap).includes(otherKeyPressed)) {
          e.preventDefault();
          this.addAccentedLetterToUserAnswer(
            accentedLettersMap[otherKeyPressed]
          );
        }
      }
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    this.setState({ lastKeyPressed: '' });
  };

  makeAnswerInputRef = (input: TextField): void => {
    this.answerInput = input;
    if (this.answerInput) {
      this.answerInputHTML = this.answerInput.getInputNode();
      this.answerInputHTML.setAttribute('autocapitalize', 'off');
      this.answerInputHTML.setAttribute('autocorrect', 'off');
      this.answerInputHTML.setAttribute('autocomplete', 'off');
    }
  };

  handleUserAnswerChange = (
    e: any, // React.FormEvent<HTMLInputElement> but this doesnt have selectionStart :/
    newValue: string
  ): void => {
    this.props.updateUserAnswer(newValue);
  };

  handleSubmitClick = (event: React.MouseEvent<HTMLElement>): void => {
    this.submitAndFocus();
  };

  submitAndFocus = () => {
    this.props.submit();
    this.focusAnswerInput();
  };

  focusAnswerInput = () => {
    setTimeout(() => {
      if (this.mounted) this.answerInput.focus();
    }, inputFuncsDelay);
  };

  addAccentedLetterToUserAnswer = (letter: string) => {
    const { selectionStart, selectionEnd } = this.answerInputHTML;
    const { userAnswer, updateUserAnswer } = this.props;
    updateUserAnswer(
      userAnswer.slice(0, selectionStart) +
        letter +
        userAnswer.slice(selectionEnd)
    );
    this.focusAnswerInput();
    setTimeout(() => {
      if (this.mounted) {
        this.answerInputHTML.setSelectionRange(
          selectionStart + 1,
          selectionStart + 1
        );
      }
    }, inputFuncsDelay);
  };

  makeLetterButtonClickHandler = (letter: string) => (
    event: React.MouseEvent<HTMLElement>
  ) => this.addAccentedLetterToUserAnswer(letter);

  render() {
    const {
      tense,
      person,
      verb,
      englishInfinitive,
      userAnswer,
      displayConjugations
    } = this.props;
    return (
      <div>
        <div className="Game__endButton">
          <EndGameButton />
        </div>
        <div className="Game__outer">
          <GameCard
            tense={tense}
            person={person}
            verb={verb}
            handleUserAnswerChange={this.handleUserAnswerChange}
            makeAnswerInputRef={this.makeAnswerInputRef}
            englishInfinitive={englishInfinitive}
            userAnswer={userAnswer}
            displayConjugations={displayConjugations}
            handleSubmitClick={this.handleSubmitClick}
          />
          {displayConjugations ? (
            <ConjugationsTable />
          ) : (
            <div className="Game__accentedLetters">
              {Object.values(accentedLettersMap).map((letter: string) => (
                <AccentedLetterKey
                  key={letter}
                  letter={letter}
                  onClick={this.makeLetterButtonClickHandler(letter)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Game;
