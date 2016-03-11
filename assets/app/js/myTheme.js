import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

let MyRawTheme = {
    spacing: Spacing,
    zIndex: zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: Colors.cyan500,
        primary2Color: Colors.cyan700,
        primary3Color: Colors.white,
        accent1Color: Colors.pinkA200,
        accent2Color: Colors.grey100,
        accent3Color: Colors.grey500,
        textColor: Colors.grey100,
        alternateTextColor: Colors.grey100,
        canvasColor: Colors.blueGrey900,
        borderColor: Colors.grey300,
        disabledColor: ColorManipulator.fade(Colors.white, 0.3),
        pickerHeaderColor: Colors.cyan500
    }
};

export default MyRawTheme
