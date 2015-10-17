var Notifications = require('pui-react-notifications').Notifications;
var Flag = require('pui-react-media').Flag;
var Label = require('pui-react-labels').Label;
var NotificationItem = require('pui-react-notifications').NotificationItem;
var DefaultH3 = require('pui-react-typography').DefaultH3;
var DefaultH5 = require('pui-react-typography').DefaultH5;

import React, { Component } from 'react'

class Notification extends Component {

  render() {
    let notificationItems = this.props.notifs.map(notif => 
        <NotificationItem key={notif.id} href="http://www.nus.edu.sg/">
            <div className='notif-item'>
              <DefaultH5 className="media-heading mbn type-dark-2">{notif.text}</DefaultH5>
              <p className="type-sm type-neutral-5 mvn">{notif.fuzzyTime}</p>
            </div>
        </NotificationItem> 
    );

    return (
        <Notifications>
            {notificationItems}     
        </Notifications>
    );
  }
}

export default Notification;