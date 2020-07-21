const path = require('path');
const fs = require('fs');
const os = require('os');
const readline = require('readline');

const filepath = path.resolve(os.homedir(), '.funbox_webpack_known_hosts');

let knownHosts = [];

try {
  // trim & filter, because it's possible that the dev edited the file manually
  // and left space symbols there
  knownHosts = fs.readFileSync(filepath, 'utf8')
    .split('\n')
    .map(x => x.trim())
    .filter(x => x);
} catch (err) {
  if (err.code !== 'ENOENT') throw err;

  allowHost('127.0.0.1');
}

module.exports = firewall;
module.exports.forgetKnownHosts = forgetKnownHosts;

function firewall(app) {
  // https://expressjs.com/en/4x/api.html
  app.use((req, res, next) => {
    if (knownHosts.includes(req.ip)) {
      next();
    } else {
      requestAccess(req.ip, next, () => res.sendStatus(403));
    }
  });
}

function forgetKnownHosts() {
  try {
    fs.unlinkSync(filepath);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  knownHosts = [];
  allowHost('127.0.0.1');

  console.log('Firewall known hosts list has been successfully cleared.');
}

function requestAccess(host, onAllow, onDeny) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`${host} is trying to get access to the server. Allow? [yes / no]: `, answer => {
    if (answer === 'yes') {
      allowHost(host);
      console.log(`${host} has been added to known hosts.`);
      onAllow();
    } else {
      if (answer !== 'no') {
        console.log('Please use `yes` or `no`.');
      }

      console.log('The request has been denied.');
      onDeny();
    }

    rl.close();
  });
}

function allowHost(host) {
  knownHosts.push(host);
  fs.writeFileSync(filepath, [...new Set(knownHosts)].join('\n'));
}
