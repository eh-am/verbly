const getOptionsSlice = (state: any) => state.options;

const getDisplayEnglishInfinitive = (state: any): boolean =>
  getOptionsSlice(state).displayEnglishInfinitive;

const getAudioFeedback = (state: any): boolean =>
  getOptionsSlice(state).audioFeedback;

export const getOptionsMenuProps = (state: any) => ({
  displayEnglishInfinitive: getDisplayEnglishInfinitive(state),
  audioFeedback: getAudioFeedback(state)
});
