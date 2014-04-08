'use strict';

var sendgrid  = require('sendgrid')(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);

exports.createFeedback = function (req, res) {
  var feedback = req.body;

  sendgrid.send({
    to: ['stefan@stefanritter.com', 'jeroen.h.s.roosen@gmail.com'],
    from: feedback.email,
    subject: 'BUZZR FEEDBACK from ' + feedback.name,
    text: feedback.message
  }, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });

  res.json({success: true});
};
