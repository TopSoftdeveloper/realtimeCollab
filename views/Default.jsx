// Default layout template
var React = require('react');

var Default = React.createClass({

    render: function() {

        return(
            <html>
            <head>
                <meta charSet="utf-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
                <title>Tiny</title>
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet"></link>
                <link href='https://fonts.googleapis.com/css?family=Quattrocento|Open+Sans' rel='stylesheet' type='text/css'></link>
                <link rel="stylesheet" type="text/css" href="assets/css/main.css"></link>
                </head>

            <body style={{fontFamily: ['Quattrocento', 'sans-serif']}}>
                <script src="assets/js/bundle.js"></script>
                <div id="task-panel"></div>
            </body>
            </html>
        );
    }
});

module.exports = Default;