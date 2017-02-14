import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import { mountWithContext } from '../../testUtils.js';
import UserAvatar from './../../../js/components/Common/UserAvatar.jsx';

chai.use(chaiEnzyme());

/* eslint-disable func-names, prefer-arrow-callback */
describe('UserAvatar.jsx ', function () {
  describe('with only displayName', function () {
    beforeEach(function () {
      this.customProps = {
        displayName: 'Alex Mark',
      };
      this.wrapper = mountWithContext(<UserAvatar {...this.customProps} />);
    });

    it('renders without explosion', function () {
      expect(this.wrapper).to.be.present();
    });
    it('renders only avatar and no tooltip by default', function () {
      expect(this.wrapper.find('Avatar')).to.have.length(1);
      expect(this.wrapper.find('Tooltip')).to.have.length(0);
    });
    it('Avatar has text of the first character if imgSrc invalid provided ', function () {
      expect(this.wrapper.find('Avatar').first().render().text()).to.equal('A');
    });
    it('Avatar has no square-avatar class by default', function () {
      expect(this.wrapper.find('Avatar').hasClass('square-avatar')).to.equal(false);
    });
    it('Avatar has size 36 by default', function () {
      expect(this.wrapper.find('Avatar')).to.have.prop('size', 36);
    });
  });

  describe('when render with all props', function () {
    beforeEach(function () {
      this.customProps = {
        imgSrc: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
        displayName: 'Alex Mark',
        enableTooltip: true,
        isSquare: true,
        memberColour: '6efa39',
        size: 20,
      };
      this.wrapper = mountWithContext(<UserAvatar {...this.customProps} />);
    });

    it('renders without explosion', function () {
      expect(this.wrapper).to.be.present();
    });
    it('renders both avatar and OverlayTrigger', function () {
      // console.log(this.wrapper.debug())
      expect(this.wrapper.find('Avatar')).to.have.length(1);
      expect(this.wrapper.find('OverlayTrigger')).to.have.length(1);
    });
    it('Avatar no text', function () {
      expect(this.wrapper.find('Avatar').first().render().text()).to.equal('');
    });
    it('Avatar has square-avatar class', function () {
      expect(this.wrapper.find('Avatar').hasClass('square-avatar')).to.equal(true);
    });
    it('should pass prop `size` correctly', function () {
      expect(this.wrapper.find('Avatar')).to.have.prop('size', this.customProps.size);
    });
  });
});
