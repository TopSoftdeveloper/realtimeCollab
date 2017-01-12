import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import _404 from './../../js/components/_404.jsx';

describe("AssigneeRow.jsx ", function() {
  it("renders without explosion", function() {
    expect(shallow(<_404 />).contains(<div><h1>404</h1></div>)).to.equal(true);
  });

  it("contains one <h1> tag", function() {
    expect(shallow(<_404 />).find('h1')).to.have.length(1);
  });

  it("text is 404", function() {
    expect(shallow(<_404 />).text()).to.equal('404');
  });
});
