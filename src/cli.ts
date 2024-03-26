#!/usr/bin/env node

import { forgetKnownHosts } from '.';
import { version } from '../package.json';

if (process.argv[2] === 'forget-known-hosts') {
  forgetKnownHosts();
} else {
  showHelp();
}

function showHelp() {
  // eslint-disable-next-line no-console
  console.log(`
  Usage: webpack-dev-server-firewall [command]

  Firewall for webpack-dev-server, version ${version}.

  Commands:
    forget-known-hosts      clears the list of known hosts

  Read more about the package:
  https://github.com/funbox/webpack-dev-server-firewall
`);
}
