import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
/*
Example state tree:
files: [
  {
    id: '0B6AfgueBZ9TMZndEV3JHbUFtSkE',
    name: 'New Folder',
    mimeType: 'application/vnd.google-apps.folder',
    parents: [
      '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
    ],
    webViewLink: 'https://drive.google.com/drive/folders/0B6AfgueBZ9TMZndEV3JHbUFtSkE',
    iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_11_collection_list_1.png',
    modifiedTime: '2017-02-17T06:24:34.423Z',
    lastModifyingUser: {
      kind: 'drive#user',
      displayName: 'JJ Zhang',
      photoLink: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/s64/photo.jpg',
      me: true,
      permissionId: '05656636532801173373',
      emailAddress: 'zhangji951027@gmail.com',
    },
  },
]
*/
const files = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_FILES:
      return action.files;
    case AppConstants.UPDATE_FILE:
      return state.map((file) => (
        file.id === action.id ? assign({}, file, action.payload) : file
      ));
    case AppConstants.ADD_FILES:
      // appends files to back of list
      const filesToAdd = [];
      // check for duplicates
      for (let i = 0; i < action.files.length; ++i) {
        const matchingFiles = state.filter(file => file.id === action.files[i].id);
        if (matchingFiles.length === 0) {
          filesToAdd.push(action.files[i]);
        }
      }
      return [...state, ...filesToAdd];
    case AppConstants.INSERT_FILE:
      // inserts file at front of list
      return [action.file, ...state];
    case AppConstants.DELETE_FILE:
      return state.filter(file => file.id !== action.id);
    default:
      return state;
  }
};
export default files;
