const express     = require('express'),
      router      = express.Router({mergeParams: true}),
      middleware  = require('../middleware'),
      chat        = require('../chat'),
      AssistantV1  = require('watson-developer-cloud/assistant/v1');

//watson configuration
const service = new AssistantV1({
  username: process.env.MYCHAT_USER, // replace with service username
  password: process.env.MYCHAT_PASS, // replace with service password
  url: 'https://gateway.watsonplatform.net/assistant/api',
  version: '2018-02-16'
});

const workspace_id = process.env.MYCHAT_WORK_ID; // replace with workspace ID

//GET Chat
router.get("/watson",/* middleware.isLoggedIn,*/ function (req, res) {
    res.render("watson");
});

//POST Chat
router.post('/watson/', /* middleware.isLoggedIn,*/ (req, res) => {
  const { text, context = {} } = req.body;  
  

  const params = {
    input: { text },
    workspace_id: workspace_id,
    context,
  };

  service.message(params, (err, response) => {
    if (err) res.status(500).json(err);
    else chat.processResponse(response);

    res.json(response);
  });
});

module.exports = router;


