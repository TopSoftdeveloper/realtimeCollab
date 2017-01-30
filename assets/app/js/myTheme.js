import {cyan500, cyan700, white, pink200, grey100, grey300, grey500, blueGrey900} from 'material-ui/styles/colors.js';
import {fade} from 'material-ui/utils/colorManipulator.js';
import Spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';

let MyRawTheme = {
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: cyan500,
    primary2Color: cyan700,
    primary3Color: white,
    accent1Color: pink200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: grey100,
    alternateTextColor: grey100,
    canvasColor: blueGrey900,
    borderColor: grey300,
    disabledColor: fade(white, 0.3),
    pickerHeaderColor: cyan500
  }
};

export default MyRawTheme
