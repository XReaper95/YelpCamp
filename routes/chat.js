var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    bodyParser  = require('body-parser'),
    middleware  = require('../middleware'),
    AssistantV1 = require('watson-developer-cloud/assistant/v1');
    app         = express();

//watson configuration
var service = new AssistantV1({
  username: process.env.MYCHAT_USER, // replace with service username
  password: process.env.MYCHAT_PASS, // replace with service password
  version: '2018-02-16'
});

var workspace_id = process.env.MYCHAT_WORK_ID; // replace with workspace ID

app.use(bodyParser.json());

//GET Chat
router.get("/watson", middleware.isLoggedIn, function (req, res) {
    res.render("watson");
});

//POST Chat
router.post('/watson', (req, res) => {
  const { text, context = {} } = req.body;

  const params = {
    input: { text },
    workspace_id: workspace_id,
    context
  };

  service.message(params, (err, response) => {
    if (err) res.status(500).json(err);

    res.json(response);
  });
});

module.exports = router;

