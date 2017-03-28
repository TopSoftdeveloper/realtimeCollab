import { cyan400, cyan500, cyan700, white, pinkA200, grey100, grey300, grey400, grey500, blueGrey900, black, darkBlack, fullBlack, yellow50 } from 'material-ui/styles/colors.js';
import { fade } from 'material-ui/utils/colorManipulator.js';
import spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';

export default {
  spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: cyan500,
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    hightlight1Color: yellow50,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};

export const Color = {
  leftPanelItemHightColor: cyan500,
  leftPanelBackgroundColor: white,
  messageViewPinBackgroundColor: yellow50,
  highlightColor: yellow50,
};
