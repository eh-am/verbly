import { actionTypes } from '../actions';
import { initialState, Game, VerbTense } from '../models';

export default (game: Game = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.START_GAME:
      return {
        ...game,
        started: true
      };
    case actionTypes.END_GAME:
      return initialState;
    case actionTypes.OPEN_REVIEW:
      return {
        ...game,
        openReview: true
      };
    case actionTypes.SET_GAME_UNSEEN_VERBS:
      return {
        ...game,
        unseenVerbs: action.payload.verbs
      };
    case actionTypes.REMOVE_UNSEEN_VERB:
      return {
        ...game,
        unseenVerbs: game.unseenVerbs.filter(
          (verb: string): boolean => verb !== action.payload.verb
        )
      };
    case actionTypes.ADD_MOST_RECENTLY_SEEN_VERB:
      return {
        ...game,
        mostRecentlySeenVerbs: [
          ...game.mostRecentlySeenVerbs.filter(
            (verb: string) => verb !== action.payload.verb
          ),
          action.payload.verb
        ]
      };
    case actionTypes.REMOVE_GAME_VERB:
      return {
        ...game,
        unseenVerbs: game.unseenVerbs.filter(
          (verb: string): boolean => verb !== action.payload.verb
        ),
        showAgainVerbTenses: game.showAgainVerbTenses.filter(
          (verbTense: VerbTense): boolean =>
            verbTense.spanishInfinitive !== action.payload.verb
        )
      };
    case actionTypes.ADD_SHOW_AGAIN_VERB_TENSE:
      return {
        ...game,
        showAgainVerbTenses: [
          ...game.showAgainVerbTenses,
          {
            spanishInfinitive: action.payload.verb,
            tense: action.payload.tense
          }
        ]
      };
    case actionTypes.REMOVE_SHOW_AGAIN_VERB:
      return {
        ...game,
        showAgainVerbTenses: game.showAgainVerbTenses.filter(
          (verbTense: VerbTense): boolean =>
            verbTense.spanishInfinitive !== action.payload.verb ||
            verbTense.tense !== action.payload.tense
        )
      };
    case actionTypes.NEW_QUESTION:
      return {
        ...game,
        questionsAnswered: game.questionsAnswered + 1,
        currentQuestion: action.payload
      };
    case actionTypes.ADD_QUESTION_CORRECT:
      return {
        ...game,
        questionsCorrect: game.questionsCorrect + 1
      };
    case actionTypes.UPDATE_USER_ANSWER:
      return {
        ...game,
        userAnswer: action.payload.userAnswer
      };
    case actionTypes.CLEAR_USER_ANSWER:
      return {
        ...game,
        userAnswer: ''
      };
    case actionTypes.SHOW_CONJUGATIONS:
      return {
        ...game,
        displayConjugations: true
      };
    case actionTypes.HIDE_CONJUGATIONS:
      return {
        ...game,
        displayConjugations: false
      };
    default:
      return game;
  }
};
