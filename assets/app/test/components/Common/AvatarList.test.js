import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import AvatarList from './../../../js/components/Common/AvatarList.jsx';

chai.use(chaiEnzyme());

/* eslint-disable func-names, prefer-arrow-callback */
describe('AvatarList.jsx ', function () {
  const MEMBERS = [
    {
      id: 'EJiX8co5Z',
      email: 'zhangji951027@gmail.com',
      display_name: 'JJ Zhang',
      display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
      online: true,
      colour: '#00bcd4',
      me: true,
    },
    {
      id: 'Ey9Zt9Lo-',
      display_name: 'Ge Hu',
      display_image: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
      email: 'jizhang95@gmail.com',
      online: true,
      colour: '#4caf50',
    },
    {
      id: 'Ey9Zt9Lo-12112',
      display_name: 'Ge Hu Three',
      display_image: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
      email: 'jizhang12395@gmail.com',
      online: false,
      colour: '#4fff50',
    },
  ];
  it('render with no memeber', function () {
    expect(shallow(<AvatarList members={[]} />)).to.be.present();
  });

  describe('with one member and rest prop empty', function () {
    beforeEach(function () {
      this.customProps = {
        members: MEMBERS.slice(0, 1),
      };
      this.wrapper = shallow(<AvatarList {...this.customProps} />);
    });

    it('renders without explosion', function () {
      expect(this.wrapper).to.be.present();
    });


    it('div has avatar-list-wrapper class', function () {
      expect(this.wrapper.find('div').hasClass('avatar-list-wrapper')).to.equal(true);
    });
    it('ul has avatar-list class', function () {
      expect(this.wrapper.find('ul').hasClass('avatar-list')).to.equal(true);
    });
    it('renders exactly one <li> | <UserAvatar>', function () {
      expect(this.wrapper.find('li')).to.have.length(1);
      expect(this.wrapper.find('UserAvatar')).to.have.length(1);
    });

    it('first avatar follows all props', function () {
      const firstMember = this.customProps.members[0];
      expect(this.wrapper.find('UserAvatar').first().props().imgSrc).to
        .equal(firstMember.display_image);
      expect(this.wrapper.find('UserAvatar').first().props().displayName).to
        .equal(firstMember.display_name);
      expect(this.wrapper.find('UserAvatar').first().props().enableTooltip).to.equal(true);
      expect(this.wrapper.find('UserAvatar').first().props().isSquare).to.equal(false);
      expect(this.wrapper.find('UserAvatar').first().props().memberColour).to.equal(false);
    });
  });

  describe('with one member and all props', function () {
    beforeEach(function () {
      this.customProps = {
        members: MEMBERS.slice(0, 1),
        colour: true,
        isSquare: true,
        className: 'specialClass',
      };
      this.wrapper = shallow(<AvatarList {...this.customProps} />);
    });

    it('renders without explosion', function () {
      expect(this.wrapper).to.be.present();
    });

    it('renders exactly one <li> | <UserAvatar>', function () {
      expect(this.wrapper.find('li')).to.have.length(1);
      expect(this.wrapper.find('UserAvatar')).to.have.length(1);
    });

    it('div has custom class', function () {
      expect(this.wrapper.find('div').hasClass('specialClass')).to.equal(true);
    });

    it('first avatar follows all props', function () {
      const firstMember = this.customProps.members[0];
      expect(this.wrapper.find('UserAvatar').first().props().imgSrc).to
        .equal(firstMember.display_image);
      expect(this.wrapper.find('UserAvatar').first().props().displayName).to
        .equal(firstMember.display_name);
      expect(this.wrapper.find('UserAvatar').first().props().enableTooltip).to
        .equal(true);
      expect(this.wrapper.find('UserAvatar').first().props().isSquare).to
        .equal(this.customProps.isSquare);
      expect(this.wrapper.find('UserAvatar').first().props().memberColour).to
        .equal(this.customProps.colour ? firstMember.colour : false);
    });
  });

  describe('with multiple members and all props', function () {
    beforeEach(function () {
      this.customProps = {
        members: MEMBERS,
        colour: true,
        isSquare: true,
        className: 'specialClass',
      };
      this.wrapper = shallow(<AvatarList {...this.customProps} />);
    });

    it('renders without explosion', function () {
      expect(this.wrapper).to.be.present();
    });

    it('div has avatar-list-wrapper class', function () {
      expect(this.wrapper.find('div').hasClass('avatar-list-wrapper')).to.equal(true);
    });
    it('ul has avatar-list class', function () {
      expect(this.wrapper.find('ul').hasClass('avatar-list')).to.equal(true);
    });
    it('renders exactly multiple <li> |  <UserAvatar>', function () {
      expect(this.wrapper.find('li')).to.have.length(this.customProps.members.length);
      expect(this.wrapper.find('UserAvatar')).to.have.length(this.customProps.members.length);
    });


    it('first avatar follows all props', function () {
      const firstMember = this.customProps.members[0];
      expect(this.wrapper.find('UserAvatar').first().props().imgSrc).to
        .equal(firstMember.display_image);
      expect(this.wrapper.find('UserAvatar').first().props().displayName).to
        .equal(firstMember.display_name);
      expect(this.wrapper.find('UserAvatar').first().props().enableTooltip).to.equal(true);
      expect(this.wrapper.find('UserAvatar').first().props().isSquare).to
        .equal(this.customProps.isSquare);
      expect(this.wrapper.find('UserAvatar').first().props().memberColour).to
        .equal(this.customProps.colour ? firstMember.colour : false);
    });

    it('last avatar follows all props', function () {
      const lastMember = this.customProps.members[this.customProps.members.length - 1];
      expect(this.wrapper.find('UserAvatar').last().props().imgSrc).to
        .equal(lastMember.display_image);
      expect(this.wrapper.find('UserAvatar').last().props().displayName).to
        .equal(lastMember.display_name);
      expect(this.wrapper.find('UserAvatar').last().props().enableTooltip).to.equal(true);
      expect(this.wrapper.find('UserAvatar').last().props().isSquare).to
        .equal(this.customProps.isSquare);
      expect(this.wrapper.find('UserAvatar').last().props().memberColour).to
        .equal(this.customProps.colour ? lastMember.colour : false);
    });
  });
});
