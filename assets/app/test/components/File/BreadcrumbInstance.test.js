import React from 'react';
import chai, { expect } from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme())

import BreadcrumbInstance from './../../../js/components/File/BreadcrumbInstance.jsx';

const shallowWrapperWithProps= (props) => shallow(<BreadcrumbInstance {...props}/>)

describe("BreadcrumbInstance.jsx ", function() {
  describe("Able to render", function(){
    it("renders without explosion", function() {
      const props = {
        directories: [
          {
            name:'root',
            id: '1',
          },
          {
            name:'folder1',
            id: '2',
          }
        ],
        changeDirectory: ()=>null
      }
      expect(shallowWrapperWithProps(props)).to.exist;
    });
  });
  describe("renders with empty directories", function(){
    const spy = sinon.spy();
    const props = {
      directories: [],
      changeDirectory: spy
    }
    const wrapper = shallowWrapperWithProps(props);
    it("contains exactly 1 Breadcrumb component and 0 BreadcrumbItem", function() {
      expect(wrapper).to.have.exactly(1).descendants('Breadcrumb');
      expect(wrapper).not.to.have.descendants('BreadcrumbItem')
    });
  });

  describe("renders with five directories", function(){
    const spy = sinon.spy();
    const props = {
      directories: [
        {name:'root',id:'1'},
        {name:'folder1',id:'2'},
        {name:'folder2',id:'3'},
        {name:'folder3',id:'4'},
        {name:'folder4',id:'5'},
      ],
      changeDirectory: spy
    }
    const wrapper = shallowWrapperWithProps(props);

    it("contains exactly 1 Breadcrumb component and 5 BreadcrumbItem", function() {
      expect(wrapper).to.have.exactly(1).descendants('Breadcrumb');
      expect(wrapper).to.have.exactly(5).descendants('BreadcrumbItem')
    });
    it("BreadcrumbItems are rendered in order by directories", function() {
      expect(wrapper.find('BreadcrumbItem').first().children().text()).to.equal('root')
      expect(wrapper.find('BreadcrumbItem').at(2).children().text()).to.equal('folder2')
      expect(wrapper.find('BreadcrumbItem').last().children().text()).to.equal('folder4')
    });
    it("Only last BreadcrumbItems is active and has no callback", function() {
      expect(wrapper.find('BreadcrumbItem').first()).to.have.prop('onClick');
      expect(wrapper.find('BreadcrumbItem').first()).to.have.prop('active', false);
      expect(wrapper.find('BreadcrumbItem').at(1)).to.have.prop('onClick');
      expect(wrapper.find('BreadcrumbItem').at(1)).to.have.prop('active', false);
      expect(wrapper.find('BreadcrumbItem').at(2)).to.have.prop('onClick');
      expect(wrapper.find('BreadcrumbItem').at(2)).to.have.prop('active', false);
      expect(wrapper.find('BreadcrumbItem').at(3)).to.have.prop('onClick');
      expect(wrapper.find('BreadcrumbItem').at(3)).to.have.prop('active', false);
      expect(wrapper.find('BreadcrumbItem').last()).to.not.have.prop('onClick');
      expect(wrapper.find('BreadcrumbItem').last()).to.have.prop('active', true);
    });
    it("changeDirectory is triggered with correct directory id after click on root item", function() {
      spy.reset()
      const rootWrapper = wrapper.find('BreadcrumbItem').first();
      rootWrapper.simulate('click');
      expect(spy.calledOnce).to.equal(true);
      expect(spy.calledWith('1')).to.equal(true);
    });
    it("changeDirectory is not triggered with correct directory id after click on last item", function() {
      spy.reset()
      const lastWrapper = wrapper.find('BreadcrumbItem').last();
      lastWrapper.simulate('click');
      expect(spy.calledOnce).to.equal(false);
    });
  });
})
