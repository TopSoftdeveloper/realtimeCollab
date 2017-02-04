import React from 'react';
import chai, { expect } from 'chai';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());

import {mountWithContext} from '../../testUtils.js';
import FilesList from './../../../js/components/File/FilesList.jsx';

const props = {
  actions: {
    initUpperLevelFolder: sinon.spy(),
    createFolderToDrive: sinon.spy(),
    uploadFileToDrive: sinon.spy(),
    removeFileFromDrive: sinon.spy(),
    copyFileToDrive: sinon.spy(),
    renameFileToDrive: sinon.spy(),
    moveFileToDrive: sinon.spy(),
    initChildrenFiles: sinon.spy(),
  },
  app: {
    is_linked_to_drive: true,
    is_top_level_folder_loaded: false,
    files: {loading: false},
    loading: false,
    current_project: "Vy0p9_AvG",
  },
  directoryStructure: [
    {
      id: "0B6AfgueBZ9TMcTUwNmYyZ1FRNGc",
      name: "FileViewTestFolder",
    }
  ],
  dispatch:sinon.spy(),
  files:[
    {
      id: "0B6AfgueBZ9TMdC1pNk51WndNWUE",
      parents: ['0B6AfgueBZ9TMcTUwNmYyZ1FRNGc'],
      iconLink: "https://icon_10_text_list.png",
      name: "BBQ.txt",
      mimeType: "text/plain",
      lastModifyingUser: {me:false,displayName:"JJ Zhang"},
      modifiedTime: "2017-02-04T08:29:45.123Z",
    },
  ],
  projectId: "Vy0p9_AvG",
  rootFolderId: "0B6AfgueBZ9TMcTUwNmYyZ1FRNGc",
};
describe("FilesList.jsx ", () => {


  describe("render without explosion and static testing on default behavior", ()=>{
    const wrapper = shallow(<FilesList {...props} />);
    // console.log(wrapper.debug());
    it('render without explosion', ()=> {
      expect(shallow(<FilesList {...props} />)).to.exist;
    });

    it('render with exactly one BreadcrumbInstance ', ()=> {
      expect(wrapper).to.have.exactly(1).descendants('BreadcrumbInstance');

    });

    it('firstly renders the create button', ()=> {
      const firstIconMenuWrapper = wrapper.find("IconMenu").first();
      // console.log(firstIconMenuWrapper.prop('iconButtonElement'));
      expect(firstIconMenuWrapper.prop('iconButtonElement').props.label).to.equal("New")
    });
    it('should not render TreeModal by default', ()=> {
      expect(wrapper).to.not.have.descendants('TreeModal');
    });
    it('check default state', ()=> {
      console.log(wrapper.state('selectedFile'))
      expect(wrapper).to.have.state('movedFile');
      expect(wrapper).to.have.state('selectedFile');
      expect(wrapper).to.have.state('isRenameModalOpen', false);
      expect(wrapper).to.have.state('canSubmit', false);
      expect(wrapper).to.have.state('isMoveModalOpen', false);
    })
  });
});
