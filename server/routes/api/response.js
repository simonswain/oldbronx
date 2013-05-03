'use strict';

module.exports.json = function(req, res, json, code) {
  code = code || 200;
  res.writeHead(code, {'Content-Type': 'application/json' });
  res.end(JSON.stringify(json));
  return;
};

module.exports.ok = function(req, res) {
  res.writeHead(204);
  res.end();
  return;
};

module.exports.invalid = function (res, json) {
  if(json !== undefined){
    res.writeHead(400, {'Content-Type': 'application/json' });
    res.end(JSON.stringify(json));
    return;
  }
  res.writeHead(400);
  res.end('Invalid Request');
};

module.exports.unauthorized = function (res, json) {
  res.writeHead(401);
  res.end('Unauthorized');
  return;
};

module.exports.forbidden = function (res, json) {
  res.writeHead(403);
  res.end('Forbidden');
  return;
};

module.exports.not_found = function (res) {
  res.writeHead(404);
  res.end('Not Found');
  return;
};

module.exports.error = function(req, res) {
  res.writeHead(500);
  res.end();
  return;
};
