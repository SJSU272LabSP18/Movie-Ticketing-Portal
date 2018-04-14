module.exports = function (app) {

  var api_controller = require('../controllers/controller.js');

  //Login
  app.post('/login', api_controller.login);

  //SignUp
  app.post('/signup', api_controller.signup);

  //Check Login
  app.get('/isLoggedIn', api_controller.isLoggedIn);

  //Get profile
  app.post('/getProfile', api_controller.getprofile);

  //Find All Multiplex
  app.get('/findAllMultiplex', api_controller.findAllMultiplex);

  //Create Multiplx  
  app.post('/createNewMultiplex', api_controller.createNewMultiplex);

  //update Multiplx  
  app.post('/updateMultiplex', api_controller.updateMultiplex);

}


