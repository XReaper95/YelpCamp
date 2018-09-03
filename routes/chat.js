const express     = require('express'),
      router      = express.Router({mergeParams: true}),
      middleware  = require('../middleware'),
      AssistantV1  = require('watson-developer-cloud/assistant/v1');

//watson configuration
const service = new AssistantV1({
  username: '6222c521-0afc-49e5-8cf9-55f48d8c4804', // replace with service username
  password: 'skFItfsyjPk2', // replace with service password
  url: 'https://gateway.watsonplatform.net/assistant/api',
  version: '2018-02-16'
});

const workspace_id = '2c9f1bf3-c78e-4e06-865b-abf4e9359123'; // replace with workspace ID

//GET Chat
router.get("/watson", middleware.isLoggedIn, function (req, res) {
    res.render("watson");
});

//POST Chat
router.post('/watson/', middleware.isLoggedIn, (req, res) => {
  const { text, context = {} } = req.body;  

  const params = {
    input: { text },
    workspace_id: workspace_id,
    context,
  };

  service.message(params, (err, response) => {
    if (err) res.status(500).json(err);

    res.json(response);
  });
});

module.exports = router;


