var $ = require('jquery');
var Cookies = require('cookies-js');

var API_BASE_URL = 'http://localhost:4000';
var CREATE_ACCOUNT_ENDPOINT = '/create_account';
var LOGIN_ENDPOINT = '/login';
var JWT_COOKIE_NAME = 'jwt';

$(document).ready(function() {
    $('.signup_form').submit(function(event) {
        var email = $('.signup_form .email_input').val();
        var password = $('.signup_form .password_input').val();

        $.post(API_BASE_URL + CREATE_ACCOUNT_ENDPOINT, {
            email: email,
            password: password
        }).done(function(res) {
            Cookies.set(JWT_COOKIE_NAME, res.token);
        }).fail(function(err) {
            console.log(err);
        });
        event.preventDefault();
    });

    $('.login_form').submit(function(event) {
        var email = $('.login_form .email_input').val();
        var password = $('.login_form .password_input').val();

        $.post(API_BASE_URL + LOGIN_ENDPOINT, {
            email: email,
            password: password
        }).done(function(res) {
            Cookies.set(JWT_COOKIE_NAME, res.token);
        }).fail(function(err) {
            console.log(err);
        });
        event.preventDefault();
    });
});

