// Importação dos modulos necessários.
var express = require('express');
var router = express.Router();

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var google = require('googleapis');
var gcal = require('google-calendar');
var passport = require('passport');
var mustache = require('mustache');
var fs = require('fs');

/* GET home page */
router.get('/', function(req, res) {
    if (!req.session.access_token && !req.cookies.token) return res.redirect('/calendarAuth');
    if (!req.session.access_token) req.session.access_token = req.cookies.token;
    res.send(fs.readFileSync("web/view/calendar.html", "utf8"));
});

/*
  ===========================================================================
            Setup API used by Angular for the application
  ===========================================================================
*/

function retrieveToken(req, res) {
    if (!req.session.access_token && !req.cookies.token) return null;
    if (!req.session.access_token) req.session.access_token = req.cookies.token;
    return req.session.access_token;
}

/* GET Groups List */
router.get('/groups', function(req, res) {
    var accessToken = retrieveToken(req);
    if (accessToken == null) return res.redirect('/calendarAuth');
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});

/* GET Events List */
router.get('/list:id', function(req, res) {
    var accessToken = retrieveToken(req);
    if (accessToken == null) return res.redirect('/calendarAuth');
    var groupId = req.params.id;
    gcal(accessToken).calendarList.list(function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        gcal(accessToken).events.list(data.items[groupId].id, function(err, data) {
            if (err) return res.redirect('/calendarAuth');
            res.json(data);
        });
    });
});

/* POST Create Event */
router.post('/create', function(req, res) {
    var accessToken = retrieveToken(req);
    if (accessToken == null) return res.redirect('/calendarAuth');
    var accessToken = retrieveToken(req);
    var group_id = req.body.group_id;
    var new_event = JSON.stringify(req.body.new_event);
    gcal(accessToken).events.insert(group_id, new_event, function(err, data) {
        if (err) return res.redirect('/calendarAuth');
        res.json(data);
    });
});
module.exports = router;