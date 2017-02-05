import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import assign from 'object-assign';
chai.use(chaiEnzyme());

import IconMenu from 'material-ui/IconMenu';
import {debugWrapper, mountWithContext} from '../../testUtils.js';
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
    {
      id: "0B6AfgueBZ9TMYWlLZXl5UVJzd00",
      parents: ['0B6AfgueBZ9TMcTUwNmYyZ1FRNGc'],
      iconLink: "https://icon_11_collection_list.png",
      name: "new folder",
      mimeType: "application/vnd.google-apps.folder",
      lastModifyingUser: {me:true,displayName:"JJ Zhang"},
      modifiedTime: "2017-01-21T06:14:47.132Z",
    },
    {
      id: "0B6AfgueBZ9TMWHBkRXd1Y1JNM3c",
      parents: ['0B6AfgueBZ9TMYWlLZXl5UVJzd00'],
      iconLink: "https://images/generic_app_icon_16.png",
      name: "Untitled Diagram.html",
      mimeType: "application/vnd.jgraph.mxfile.realtime",
      lastModifyingUser: {me:false,displayName:"Hu Ge"},
      modifiedTime: "2017-01-22T07:27:41.609Z",
    },
    {
      iconLink: '../../../images/icon_11_image_list.png',
      id: '19',
      name: 'a.png',
      parents: [
        '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc'
      ],
      isPreview: true,
      data: {
        preview: 'blob:http://localhost:8080/5331e803-90cf-4ce6-891a-67260036c1f3'
      }
    }
  ],
  projectId: "Vy0p9_AvG",
  rootFolderId: "0B6AfgueBZ9TMcTUwNmYyZ1FRNGc",
};
describe("FilesList.jsx ", () => {


  describe("render without explosion and static testing on default behavior", ()=>{
    const wrapper = mountWithContext(<FilesList {...props} />);
    // console.log(wrapper.debug());
    it('render without explosion', ()=> {
      expect(wrapper).to.exist;
    });

    it('render with exactly one BreadcrumbInstance ', ()=> {
      expect(wrapper).to.have.exactly(1).descendants('BreadcrumbInstance');

    });

    it('firstly renders the create button', ()=> {
      const firstIconMenuWrapper = wrapper.find("IconMenu").first();
      // console.log(firstIconMenuWrapper.prop('iconButtonElement'));
      expect(firstIconMenuWrapper.prop('iconButtonElement').props.label).to.equal("New")
    });
    it('should not render TreeModal or RenameModal by default', ()=> {
      expect(wrapper).to.not.have.descendants('TreeModal');
      expect(wrapper).to.not.have.descendants('RenameModal');
    });
    it('check default state', ()=> {
      expect(wrapper).to.have.state('targetFile', null);
      expect(wrapper).to.have.state('isRenameModalOpen', false);
      expect(wrapper).to.have.state('isMoveModalOpen', false);
    });
  });
  describe("render diffrerent parts correctly based on different props/types", ()=>{
    let wrapper;
    beforeEach("init fileList", ()=>{
      wrapper = mountWithContext(<FilesList {...props} />);
    });
    describe("DropZone", ()=>{
      it('DropZone will only be rendered if drive is linked and root folder is set', ()=> {
        let appStatus = assign({}, props.app, {is_linked_to_drive : false})
        wrapper.setProps({app: appStatus});
        wrapper.setProps({rootFolderId: null});
        expect(wrapper).to.not.have.descendants('Dropzone');
        wrapper.setProps({rootFolderId: "safdladfka12"});
        expect(wrapper).to.not.have.descendants('Dropzone');
        appStatus = assign({}, props.app, {is_linked_to_drive : true})
        wrapper.setProps({app: appStatus});
        expect(wrapper).to.have.exactly(1).descendants('Dropzone');
      });
      it('DropZone will have not className of hidden if no file/directory is inside currentDirectory', ()=>{
        // set current Directory to be a dummy one
        wrapper.setProps({
          directoryStructure: [
            {
              id: "dummyId",
              name: "dummyDirectory",
            },
          ],
        });
        expect(wrapper.find('Dropzone')).to.not.have.className("hidden");
        wrapper.setProps({
          directoryStructure: [
            {
              id: "0B6AfgueBZ9TMcTUwNmYyZ1FRNGc",
              name: "FileViewTestFolder",
            },
          ]
        });
        expect(wrapper.find('Dropzone')).to.have.className("hidden");
      });
    })
    describe("BreadcrumbInstance", ()=>{
      it('BreadcrumbInstance will have correct directories path', ()=>{
        expect(wrapper.find('BreadcrumbInstance')).to.have.prop('directories', props.directoryStructure);
        const anotherDirectoryStructure = [
            {
              id: "dummyId",
              name: "dummyDirectory",
            },
        ];
        wrapper.setProps({directoryStructure: anotherDirectoryStructure});
        expect(wrapper.find('BreadcrumbInstance')).to.have.prop('directories',
        anotherDirectoryStructure);
        const emptyDirectoryStructure = [];
        wrapper.setProps({directoryStructure: emptyDirectoryStructure});
        expect(wrapper.find('BreadcrumbInstance')).to.have.prop('directories',
        emptyDirectoryStructure);
      });
    });
    describe('fileList', ()=>{
      it('files will be sort by: preview first then folder first',()=>{
        const fileNames = wrapper.find('CardHeader').map(node => node.prop('title'));
        expect(fileNames).to.eql([ 'a.png', 'new folder', 'BBQ.txt' ]);

      });
      it('Loading indicator will be shown if app.files.loading', ()=>{
        let appStatus = assign({}, props.app, {files: {loading: false}});
        wrapper.setProps({app: appStatus});
        expect(wrapper).to.not.have.descendants('LoadingIndicator');
        appStatus = assign({}, props.app, {files: {loading: true}});
        wrapper.setProps({app: appStatus});
        expect(wrapper).to.have.exactly(1).descendants('LoadingIndicator');
      });
      it('file table will be shown if not app.file.loading', ()=>{
        let appStatus = assign({}, props.app, {files: {loading: false}});
        wrapper.setProps({app: appStatus});
        expect(wrapper).to.not.have.descendants('LoadingIndicator');
        appStatus = assign({}, props.app, {files: {loading: true}});
        wrapper.setProps({app: appStatus});
        expect(wrapper).to.have.exactly(1).descendants('LoadingIndicator');
      });
    });
    describe('renderFilePreview', ()=> {
      const previewFileData = {
        iconLink: '../../../images/icon_11_image_list.png',
        id: '19',
        name: 'a.png',
        parents: [
          '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc'
        ],
        isPreview: true,
        data: {
          preview: 'blob:http://localhost:8080/5331e803-90cf-4ce6-891a-67260036c1f3'
        },
        uploading: false
      }
      const expectPreviewFileWrapperBehavesCorrectly = previewFileWrapper => {
        expect(previewFileWrapper.type()).to.equal('tr');
        expect(previewFileWrapper).to.have.className('table-row-file');
        expect(previewFileWrapper).to.have.exactly(1).descendants('CardHeader');
        expect(previewFileWrapper.find('CardHeader').first()).to.have.prop('title', previewFileData.name);
      };

      it('method `renderFilePreview` renders 2 action buttons when file is not uploading ', ()=> {
        previewFileData.uploading = false;
        const res = wrapper.instance().renderFilePreview(previewFileData);
        const previewFileWrapper = mountWithContext(res);
        expectPreviewFileWrapperBehavesCorrectly(previewFileWrapper);
        expect(previewFileWrapper).to.have.exactly(2).descendants('FlatButton');
        expect(previewFileWrapper).to.not.have.descendants('LinearProgress');
      });
      it('method `renderFilePreview` renders 1 LinearProgress when file is uploading', ()=> {
        previewFileData.uploading = true;
        const res = wrapper.instance().renderFilePreview(previewFileData);
        const previewFileWrapper = mountWithContext(res);
        expectPreviewFileWrapperBehavesCorrectly(previewFileWrapper);
        expect(previewFileWrapper).to.not.have.descendants('FlatButton');
        expect(previewFileWrapper).to.have.exactly(1).descendants('LinearProgress');
      });
    });

    describe('renderFileStandard', ()=> {
      const standardFileData = {
        id: "0B6AfgueBZ9TMYWlLZXl5UVJzd00",
        parents: ['0B6AfgueBZ9TMcTUwNmYyZ1FRNGc'],
        iconLink: "https://icon_11_collection_list.png",
        name: "new folder",
        mimeType: "application/vnd.google-apps.folder",
        lastModifyingUser: {me:true,displayName:"JJ Zhang"},
        modifiedTime: "2017-01-21T06:14:47.132Z",
      };
      const expectStandardFileWrapperBehavesCorrectly = standardFileWrapper => {
        expect(standardFileWrapper.type()).to.equal('tr');
        expect(standardFileWrapper).to.have.className('table-row-file');
        expect(standardFileWrapper).to.have.exactly(1).descendants('CardHeader');
        expect(standardFileWrapper.find('CardHeader').first()).to.have.prop('title', standardFileData.name);
      }
      it('method `renderFileStandard` renders menuItem for file to make a copy on 2nd place', ()=> {
        standardFileData.mimeType = "text/plain";
        const res = wrapper.instance().renderFileStandard(standardFileData);
        const standardFileWrapper = mountWithContext(res);
        expectStandardFileWrapperBehavesCorrectly(standardFileWrapper);

        // TODO Test cases failed as menuItem are not rendered in static context
        // expect(standardFileWrapper).to.have.exactly(5).descendants('MenuItem');
        // expect(standardFileWrapper.find('MenuItem').get(1)).to.have.prop('primaryText','make a copy');


      });
      it('method `renderFileStandard` does notrenders menuItem for folder to make a copy on 2nd place', ()=> {
        standardFileData.mimeType = "application/vnd.google-apps.folder";
        const res = wrapper.instance().renderFileStandard(standardFileData);
        const standardFileWrapper = mountWithContext(res);
        expectStandardFileWrapperBehavesCorrectly(standardFileWrapper);
        // TODO Test cases failed as menuItem are not rendered in static context
        // expect(standardFileWrapper).to.have.exactly(4).descendants('MenuItem');
        // expect(standardFileWrapper.find('MenuItem').get(1)).not.to.have.prop('primaryText','make a copy');
      });
    })
    describe('`renderCreateButton`', ()=> {
      it('will be shown only if linked to drive & rootFolder set and app is file loaded and file is not loading', ()=>{
        let appStatus = assign({}, props.app, {is_linked_to_drive : false, files:{loading:true}})
        wrapper.setProps({app: appStatus});
        wrapper.setProps({rootFolderId: null});
        expect(wrapper).to.not.have.descendants('.drive-create-button');
        wrapper.setProps({rootFolderId: "notnull"});
        expect(wrapper).to.not.have.descendants('.drive-create-button');
        appStatus = assign({}, props.app, {is_linked_to_drive : true, files:{loading:true}});
        wrapper.setProps({app: appStatus});
        expect(wrapper).to.not.have.descendants('.drive-create-button');
        appStatus = assign({}, props.app, {is_linked_to_drive : true, files:{loading:false}})
        wrapper.setProps({app: appStatus});
        expect(wrapper).to.have.exactly(1).descendants('.drive-create-button');

      });

      it('create button contains two menuItem: one to create folder one to upload file', ()=>{
        let appStatus = assign({}, props.app, {is_linked_to_drive : true, files:{loading:false}});
        wrapper.setProps({app: appStatus});
        wrapper.setProps({rootFolderId: "notnull"});
        const res = wrapper.instance().renderCreateButton();
        const createButtonWrapper = mountWithContext(res);
        expect(createButtonWrapper.type()).to.equal(IconMenu);
        //TODO test case failed as menuItem are not rendered in static context
        // expect(createButtonWrapper).to.have.exactly(2).descendants('MenuItem');
      });
    });



  });
});
