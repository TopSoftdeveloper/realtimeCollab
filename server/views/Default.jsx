// Default layout template
var React = require('react');

var Default = React.createClass({
    render: function() {
        return(
            <html>
            <head>
                <meta charSet="utf-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
                <title>Collab</title>
                <link rel="stylesheet" href="/assets/app/css/animate.min.css"></link>
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet"></link>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
                <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                <script src="https://apis.google.com/js/platform.js" async defer></script>
                <link rel="stylesheet" type="text/css" href="/assets/app/css/main.css"></link>
            </head>

            <body style={{fontFamily: ['Quattrocento', 'sans-serif']}}>
                <div id="task-panel"></div>
                <script src="/assets/app-bundle.js"></script>
            </body>
            </html>
        );
    }
});
//<script src="https://apis.google.com/js/platform.js" async defer></script>

module.exports = Default;
