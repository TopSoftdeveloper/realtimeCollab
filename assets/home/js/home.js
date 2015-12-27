var $ = require('jquery');
var API_BASE_URL = 'http://localhost:4000';
var CREATE_ACCOUNT_ENDPOINT = '/create_account';
var LOGIN_ENDPOINT = '/login';
var APP_MAIN_PAGE = 'http://localhost:4000/app';

$(document).ready(function() {
    $('.signup_form').submit(function(event) {
        var email = $('.signup_form .email_input').val();
        var password = $('.signup_form .password_input').val();
        var displayName = $('.signup_form .display_name_input').val();

        $.post(API_BASE_URL + CREATE_ACCOUNT_ENDPOINT, {
            email: email,
            password: password,
            display_name: displayName
        }).done(function(res) {
            localStorage.setItem('jwt', res.token);
            localStorage.setItem('user_id', res.user_id);
            localStorage.setItem('email', res.email);
            localStorage.setItem('display_name', res.display_name);
            window.location.replace(APP_MAIN_PAGE);
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
            localStorage.setItem('jwt', res.token);
            localStorage.setItem('user_id', res.user_id);
            localStorage.setItem('email', res.email);
            localStorage.setItem('display_name', res.display_name);
            window.location.replace(APP_MAIN_PAGE);
        }).fail(function(err) {
            console.log(err);
        });
        event.preventDefault();
    });
});

