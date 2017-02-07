import * as AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree:
// {
// isOpen(pin):false,
// message:"",
// background:""
// }

export default function snackbar(state={}, action) {
    switch (action.type) {
        case AppConstants.INIT_SNACKBAR:
            return action.snackbar
        case AppConstants.SNACKBAR_MESSAGE:
            let colour = 'rgba(0, 0, 0, 0.870588)'
            if (action.kind === 'warning') {
                colour = 'rgba(226, 88, 88, 0.870588)'
            } else if (action.kind === 'info') {
                colour = 'rgba(57, 144, 208, 0.870588)'
            }
            return assign({}, state,  {isOpen: true, message: action.message, background: colour})
        case AppConstants.UPDATE_SNACKBAR:
            return assign({}, state, action.snackbar)
        default:
            return state
    }
}
