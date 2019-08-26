# @funboxteam/webpack-dev-server-firewall

## Description

The package prevents uncontrollable access to dev server by asking manual approve from the developer when someone
connects to the server from unknown IP.

## Installation

```bash
npm install --save-dev @funboxteam/webpack-dev-server-firewall
```

## Usage

To use the package add into your project's webpack config as devServer.before 
(or devServer.setup for [webpack-dev-server@<2.9.0](https://github.com/webpack/webpack-dev-server/releases/tag/v2.9.0)).

```js
const firewall = require('@funboxteam/webpack-dev-server-firewall');

module.exports = {
  // ...
  devServer: {
    // ...
    before: firewall,
  },
};
```

`firewall` function expects an [Express application](https://expressjs.com/en/4x/api.html#app) instance as an argument.
In case of other before hooks existence it's possible to inject it in this way: 

```js
 const firewall = require('@funboxteam/webpack-dev-server-firewall');
 
 module.exports = {
   // ...
   devServer: {
     // ...
     before(app) {
       firewall(app);
       // ...
     },
   },
 };
```

It's important to run `firewall` before others hooks.

By default the package allows requests from `127.0.0.1` only.
When the request from other IP appears the package asks for developer's approve:

```text
Child serviceworker-plugin:
     1 asset
    Entrypoint undefined = sw.js
    [./src/app/sw.js] 2.82 KiB {0} [built]
ℹ ｢wdm｣: Compiled with warnings.
# ↑ webpack log
192.168.1.46 is trying to get access to the server. Allow? [yes / no]:
``` 

If the developer approves the connection, IP will be added into the list of known hosts,
and all the next connections will be allowed automatically.

```text
192.168.1.46 has been added to known hosts.
``` 

If the developer denies the connection, the client using that IP will get response with 403 HTTP code.

## Important details

1. The package **does not** work as a filter of unwanted connections.

   If the developer denies the connection once, it doesn't mean that it will be ignored in the future.
   In case of reconnection from the suspicious IP the package will ask for developer's approve again. 

2. The package **does not** guarantee complete protection against intruders.

   The package doesn't check in any ways that the client IP belongs 
   to the same computer that it did when the IP was allowed. It means that when the DHCP settings are changed
   (or much easier: when the developer connects to the different network) the rules of addresses distribution
   will be changed too, and the earlier allowed address may be allocated to the new computer,
   which may be used by the intruder. 
   
3. List of known IP addresses is stored in `~/.funbox_webpack_known_hosts`.

   If you want to remove any IP from the known hosts, you can make it manually.
   
   Among other things, this means that the list of allowed IPs is the same for all projects running on the machine.

4. To prevent any misunderstanding the package expects `yes` or `no` as an answer to allowing request.    

   Short answer such as `y` is not allowed. Any other answer except `yes` means `no`.
