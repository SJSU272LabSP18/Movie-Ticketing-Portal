var db_controller;
var bcrypt = require('bcrypt');
var multiparty = require('multiparty');
let fs = require('fs');
var User = require('../model/user.js');
var passport = require('../config/passport.js');
var kafka = require('../kafka/client');


//Multiplex Operations
exports.findAllMultiplex = function (req, res) {
    console.log("findAllMultiplex_request : node backend");
    let data = { data: req.body, request_code:1 };

    console.log(data);
    kafka.make_request('multiplex_request', data, function (err, results) {
        console.log('Kafka Response:');
        console.log(results);
        if (err) {
            console.log('Controller : Error Occurred : ');
            console.log(err);
            res.json(results);
        }
        else {
            res.json(results);
            return;
        }
    });
}

exports.createNewMultiplex = function (req, res) {
    // Post Project API
    console.log('createNewMultiplex API Called');
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        var resultObject = {
            successMsg: '',
            errorMsg: 'Error adding Multiplex',
            data: {}
        }
        if(err){
            console.log(err);
            resultObject.errorMsg = 'Error adding Multiplex';
            res.json(resultObject);
            return;

        }else{
            let { path: tempPath, originalFilename } = files.file[0];
            let copyToPath = "./src/images/_" + Date.now() + '_' + originalFilename;
            let dbPath = '_' + Date.now() + '_' + originalFilename;
            try {
                fs.readFile(tempPath, (err, data) => {
                    if (err) throw err;
                    fs.writeFile(copyToPath, data, (err) => {
                        if (err) throw err;
                        // delete temp image
                        fs.unlink(tempPath, () => {
                        });
                    });
                });
    
                console.log("createNewMultiplex_request : node backend");
                let data = fields;
                data.dbPath = dbPath;
                data.request_code=2;
                console.log(data);
                kafka.make_request('multiplex_request', data, function (err, results) {
                    responseUtil(err, results, res);
                });
            } catch (e) {
                console.log('Catch');
                console.log(e);
                resultObject.errorMsg = 'Error Uploading Image';
                res.json(resultObject);
                return;
            }
      
        }

    })}
    exports.updateMultiplex = function (req, res) {
        // Post Project API
        console.log('update Multiplex API Called');
        let form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
            var resultObject = {
                successMsg: '',
                errorMsg: 'Error Posting Project',
                data: {}
            }
            if(err){
                resultObject.errorMsg = 'Error updating multiplex';
                res.json(resultObject);
                return;
            }else{
                try {
                    let { path: tempPath, originalFilename } = files.file[0];
                    let copyToPath = "./src/images/_" + Date.now() + '_' + originalFilename;
                    let dbPath = '_' + Date.now() + '_' + originalFilename;    
                    fs.readFile(tempPath, (err, data) => {
                        if (err) throw err;
                        fs.writeFile(copyToPath, data, (err) => {
                            if (err) throw err;
                            // delete temp image
                            fs.unlink(tempPath, () => {
                            });
                        });
                    });
        
                    console.log("createNewMultiplex_request : node backend");
                    let data = fields;
                    data.dbPath = dbPath;
                    data.request_code=3;
                    console.log(data);
                    kafka.make_request('multiplex_request', data, function (err, results) {
                        responseUtil(err, results, res);
                    });
                } catch (e) {
                    console.log('Catch');
                    console.log(e);
                    resultObject.errorMsg = 'Error updating multiplex';
                    res.json(resultObject);
                    return;
                }
            }
            
        })}
    
    function responseUtil(err, results, res) {
        console.log('Kafka Response:');
        console.log(results);
        if (err) {
            console.log('Controller : Error Occurred : ');
            console.log(err);
            res.json(results);
        }
        else {
            res.json(results);
            return;
        }
    }
//New method with passport
exports.login = function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        var resultObject = {
            successMsg: '',
            errorMsg: 'Error Signing user in',
            data: {}
        }
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            console.log(info.errMsg);
            resultObject.errorMsg = info.errMsg;
            res.json(resultObject);
            return;
        }
        req.login(user, function (err) {
            if (err) {
                console.error(err);
                res.json(resultObject);
                return;
            }
            resultObject.successMsg = 'Log In Successful';
            resultObject.errorMsg = '';
            console.log(user._id);
            resultObject.data = {
                id: user._id,
                name: user.name,
                email: user.email
            }
            req.session.id = user._id;
            req.session.name = user.name;
            req.session.email = user.email;
            res.json(resultObject);
            return;

        });
    })(req, res, next);

}

exports.signup = function (req, res) {
    console.log("signup_request : node backend");

    let data = req.body;
    console.log(data);
    kafka.make_request('signup_request', data, function (err, results) {
        console.log('Kafka Response:');
        console.log(results);
        if (err) {
            console.log('Controller : Error Occurred : ');
            console.log(err);
            res.json(results);
        }
        else {
            res.json(results);
            return;
        }
    });
}

exports.getprofile = function (req, res) {
    console.log("getprofile_request : node backend");

    let data = req.body;
    console.log(data);
    kafka.make_request('getprofile_request', data, function (err, results) {
        console.log('Kafka Response:');
        console.log(results);
        if (err) {
            console.log('Controller : Error Occurred : ');
            console.log(err);
            res.json(results);
        }
        else {
            res.json(results);
            return;
        }
    });
}

//method converted
exports.isLoggedIn = function (req, res) {
    console.log('Check Login');

    if (req.isAuthenticated()) {

        console.log(req.user);
        console.log('is logged in');
        let responsePayload = {
            responseCode: 0,
            responseMsg: 'Allready Logged In',
            name: req.session.name,
            email: req.session.email,
            id: req.session.passport.user
        }
        res.json(responsePayload);
        return;
    } else {
        console.log('Not logged in');
        let responsePayload = {
            responseCode: 1,
            responseMsg: 'Log In Required',
        }
        res.json(responsePayload);
        return;
    }
};

//method converted
exports.logout = function (req, res) {
    console.log('Destroying Session');
    console.log('Session Destroyed');
    req.logout();
    req.session.destroy();
    res.send('Logout');
    return;
};


