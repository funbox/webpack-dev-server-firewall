# @funboxteam/webpack-dev-server-firewall

[![npm](https://img.shields.io/npm/v/@funboxteam/webpack-dev-server-firewall.svg)](https://www.npmjs.com/package/@funboxteam/webpack-dev-server-firewall)

The package prevents uncontrollable access to dev server by asking manual approve from the developer when someone
connects to the server from unknown IP.

[По-русски](./README.ru.md)

## Rationale

When frontend developers run webpack-dev-server on localhost they sometimes want to check the result on the different 
devices (e.g. smartphones, tablets). By default it's hard to do, because the server is bound on `127.0.0.1` and isn't 
allowed to receive connections from other computers.  

So, most of the time developers rebind server to `0.0.0.0` (by setting `host` option in webpack config) to make 
it available over the local network. But at the same time it grants anyone from the same network 
a permission to connect to the server, see the project and steal the code. Usually dev servers also serve source maps, 
which makes the source code fully visible too. 

Such dev server setup may harm even pet-projects if there are any sensitive credentials in the source code. 

This firewall prevents unwanted connection to the server. It intercepts all the incoming requests, 
checks their hosts' IPs against the list of allowed ones, and passes them through or denies.  

## Installation

```bash
npm install --save-dev @funboxteam/webpack-dev-server-firewall
```

## Usage

To use the package add it into your project's webpack config in `devServer.setupMiddlewares`:

```js
const firewall = require('@funboxteam/webpack-dev-server-firewall');

or

import { firewall } from '@funboxteam/webpack-dev-server-firewall';

module.exports = {
  // ...
  devServer: {
    // ...
    setupMiddlewares: (middlewares, devServer) => {
      firewall(devServer);
      // ...
      return middlewares;
    },
  },
};
```

For older webpack-dev-server versions use:

- `devServer.onBeforeSetupMiddleware` for [<4.7.0](https://github.com/webpack/webpack-dev-server/releases/tag/v4.7.0);
- `devServer.before` for [<4.0.0](https://github.com/webpack/webpack-dev-server/releases/tag/v4.0.0);
- `devServer.setup` for [<2.9.0](https://github.com/webpack/webpack-dev-server/releases/tag/v2.9.0).

`firewall` function expects an [Express application](https://expressjs.com/en/4x/api.html#app) as an argument.

It's important to run `firewall` before others hooks.

## How it works

By default the package allows requests from `127.0.0.1` only.
When the request from other IP appears the package asks for developer's approve in the terminal 
where webpack-dev-server is running:

```text
Child serviceworker-plugin:
     1 asset
    Entrypoint undefined = sw.js
    [./src/app/sw.js] 2.82 KiB {0} [built]
ℹ ｢wdm｣: Compiled with warnings.
# ↑ webpack log
192.168.1.46 is trying to get access to the server. Allow? [yes / no]:
``` 

If the developer approves the connection, IP is added into the list of known hosts,
and all the next connections will be allowed automatically.

```text
192.168.1.46 has been added to known hosts.
``` 

If the developer denies the connection, the client using that IP will get response with 403 HTTP code.

### Important details

1. The package **does not** work as a filter of unwanted connections.

   If the developer denies the connection once, it doesn't mean that it will be ignored in the future.
   In case of reconnection from the suspicious IP, the package will ask for developer's approval again.
   
   It works this way to be sure that the developer will be notified about all the suspicious incoming connections. 

2. The package **does not** guarantee complete protection against intruders.

   The package doesn't check in any ways that the client IP belongs 
   to the same computer that it did when the IP was allowed. It means that when the DHCP settings are changed
   (or much easier: when the developer connects to the different network) the rules of addresses distribution
   will be changed too, and the earlier allowed address may be allocated to the new computer,
   which may be used by the intruder. 
   
   To improve the security level clear the list of allowed IPs every time you run the server.
   Check out “[Additional](#additional)” section for details.
   
3. List of known IP addresses is stored in `~/.funbox_webpack_known_hosts`.

   If you want to remove any IP from the known hosts, you can make it manually.
   
   Among other things, this means that the list of allowed IPs is the same for all projects running on the machine.

4. To avoid confusion the package expects a clear `yes` as request confirmation.    

   Short answer such as `y` is not allowed. Any other answer except `yes` means `no`.

## Additional

### CLI

The package has small CLI which allows to clear the list of allowed IPs:

```bash
webpack-dev-server-firewall forget-known-hosts
```

It's important to note that when the firewall starts the list of allowed IPs is loaded from the file and stored in RAM.
So, one should use the described above CLI command when the server is stopped. Otherwise the file may be overwritten 
by the firewall instance.

### Methods

Besides the `onBeforeSetupMiddleware` hook the packages exports `forgetKnownHosts` method that can be used for clearing 
the list of allowed IPs from JS script.

E.g. the code below clears the list on every server start:

```js
const firewall = require('@funboxteam/webpack-dev-server-firewall');

firewall.forgetKnownHosts();

module.exports = {
  // ...
  devServer: {
    // ...
    onBeforeSetupMiddleware: firewall,
  },
};
```

## Resources

- [Protect your dev server](https://dev.to/igoradamenko/protect-your-dev-server-gob)

[![Sponsored by FunBox](https://funbox.ru/badges/sponsored_by_funbox_centered.svg)](https://funbox.ru)
