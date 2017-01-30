import React from 'react';
import chai, { expect } from 'chai';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme())

import TreeModal from './../../../js/components/File/TreeModal.jsx';

const shallowWrapperWithProps= (props) => shallow(<TreeModal {...props} />)
const mountWrapperWithProps= (props) => mount(<TreeModal {...props} />)

describe("TreeModal.jsx ", () => {
  describe("render without explosion and static testing", ()=>{
    it("renders with empty props", ()=> {
      expect(shallowWrapperWithProps()).to.exist;
    });
  });
  describe("renders with a empty treeNode", ()=>{
    const handleCloseSpy = sinon.spy();
    const onDialogSubmitSpy = sinon.spy();
    const props = {
      treeNode: {},
      handleCloseSpy: handleCloseSpy,
      onDialogSubmit: onDialogSubmitSpy,
    }
    expect(shallowWrapperWithProps(props)).to.exist;
  });
  describe("renders with full props", ()=>{
    const props = {
      treeNode: {
        name: 'folder',
        id: 123123241,
        toggled: true,
        children:[],
      },
      handleClose: sinon.spy(),
      onDialogSubmit: sinon.spy(),
    }
    const wrapper = shallowWrapperWithProps(props);
    it('render with exactly one dialog/TreeBeard', ()=> {
      expect(wrapper).to.have.exactly(1).descendants('Dialog');
      expect(wrapper).to.have.exactly(1).descendants('TreeBeard');
    });
    it('contains single FormsyText as the hidden input', ()=> {
      expect(wrapper).to.have.exactly(1).descendants('FormsyText');
      expect(wrapper.find('FormsyText')).to.have.className('invisible')
    });
    it('default state for cursor is null', ()=> {
      expect(wrapper).to.have.state('cursor', null)
    });
    it('default state for canSubmit is false', ()=> {
      expect(wrapper).to.have.state('canSubmit', false)
    });
  });
  describe("renders with a list of treeNodes", ()=>{
    const handleCloseSpy = sinon.spy();
    const onDialogSubmitSpy = sinon.spy();
    const props = {
      treeNode: {
        name: 'root',
        id: 1,
        toggled: true,
        children:[
          {
            name: 'folder1',
            id: 2,
            toggled: true,
          },
          {
            name: 'folder2',
            id: 3,
            toggled: true,
          },
        ],
      },
      handleCloseSpy: handleCloseSpy,
      onDialogSubmit: onDialogSubmitSpy,
    };
    const wrapper = shallowWrapperWithProps(props);
    it('pass correct value to TreeBeard', ()=> {
      expect(wrapper.find('TreeBeard').first()).to.have.prop('data').deep.equal(props.treeNode)
    });
  });
  describe("mount with a list of treeNodes", ()=>{
    const handleCloseSpy = sinon.spy();
    const onDialogSubmitSpy = sinon.spy();
    const props = {
      treeNode: {
        name: 'root',
        id: 1,
        toggled: true,
        children:[
          {
            name: 'folder1',
            id: 2,
            toggled: true,
          },
          {
            name: 'folder2',
            id: 3,
            toggled: true,
          },
        ],
      },
      handleCloseSpy: handleCloseSpy,
      onDialogSubmit: onDialogSubmitSpy,
    };
    const wrapper = shallowWrapperWithProps(props);
    it('contains two action button', ()=> {

      // console.log(wrapper.find('TreeBeard').first().mount().debug());
      console.log(wrapper.html());
      expect(wrapper.render().find('FlatButton')).to.have.length(2);
      // expect(wrapper.find('TreeBeard').first()).to.have.prop('data').deep.equal(props.treeNode);

    });
  });
})
