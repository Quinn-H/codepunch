var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code Punch - 实时合作码字，发送消息，视频' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Code Punch - 实时合作码字，发送消息，视频' });
});

router.route('/contact')
  .get(function(req, res, next) {
    res.render('contact', { title: 'Code Punch - 实时合作码字，发送消息，视频' });
  })
  .post(function(req, res, next) {
    req.checkBody('name', 'Empty name').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('message', 'Empty message').notEmpty();
    var errors = req.validationErrors();
    if(errors) {
        res.render('contact', {
          title: 'Code Punch - 实时合作码字，发送消息，视频',
          name: req.body.name,
          email: req.body.email,
          message: req.body.message,
          errorMessages: errors
        });
      } else {
        var mailOptions = {
          from: 'CodePunch <no-reply@codepunch.com>',
          to: 'codepunchdemo@gmail.com',
          subject: 'You got a new message from vistor',
          text: req.body.message
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return console.log(error);
          }
          res.render('thank', { title: 'Code Punch - 实时合作码字，发送消息，视频' });
        })
      }
  });

  
module.exports = router;
