import path from 'path';
import fs from 'fs';
import os from 'os';
import readline from 'readline';
import Server from 'webpack-dev-server';

const filepath = path.resolve(os.homedir(), '.funbox_webpack_known_hosts');

let knownHosts: string[] = [];

try {
  // trim & filter, because it's possible that the dev edited the file manually
  // and left space symbols there
  knownHosts = fs.readFileSync(filepath, 'utf8')
    .split('\n')
    .map(x => x.trim())
    .filter(x => x);
} catch (err) {
  if ((err instanceof Error) && 'code' in err && err.code !== 'ENOENT') throw err;

  allowHost('127.0.0.1');
}

export function firewall(devServer: Server) {
  // check if webpack-dev-server@4 or earlier used
  // and take appropriate app entity
  const app = 'app' in devServer ? devServer.app : devServer;

  // https://expressjs.com/en/4x/api.html
  app?.use((req, res, next) => {
    if (req.ip) {
      if (knownHosts.includes(req.ip)) {
        next();
      } else {
        requestAccess(req.ip, next, () => res.sendStatus(403));
      }
    }
  });
}

export function forgetKnownHosts() {
  try {
    fs.unlinkSync(filepath);
  } catch (err) {
    if ((err instanceof Error) && 'code' in err && err.code !== 'ENOENT') throw err;
  }

  knownHosts = [];
  allowHost('127.0.0.1');

  // eslint-disable-next-line no-console
  console.log('Firewall known hosts list has been successfully cleared.');
}

interface RequestAccessCallback {
  (): void;
}

function requestAccess(host: string, onAllow: RequestAccessCallback, onDeny: RequestAccessCallback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`${host} is trying to get access to the server. Allow? [yes / no]: `, answer => {
    if (answer === 'yes') {
      allowHost(host);
      // eslint-disable-next-line no-console
      console.log(`${host} has been added to known hosts.`);
      onAllow();
    } else {
      if (answer !== 'no') {
        // eslint-disable-next-line no-console
        console.log('Please use `yes` or `no`.');
      }

      // eslint-disable-next-line no-console
      console.log('The request has been denied.');
      onDeny();
    }

    rl.close();
  });
}

function allowHost(host: string) {
  knownHosts.concat(host);
  fs.writeFileSync(filepath, [...new Set(knownHosts)].join('\n'));
}
