# Changelog

## 2.0.1 (10.06.2021)

Fixed several security vulnerabilities:

- [Use of a Broken or Risky Cryptographic Algorithm](https://github.com/advisories/GHSA-r9p9-mrjm-926w) in [elliptic](https://github.com/indutny/elliptic). Updated from 6.5.3 to 6.5.4.

- [Regular Expression Denial of Service](https://github.com/advisories/GHSA-43f8-2h32-f4cj) in [hosted-git-info](https://github.com/npm/hosted-git-info). Updated from 2.8.8 to 2.8.9.

- [Command Injection](https://github.com/advisories/GHSA-35jh-r3h4-6jhm) in [lodash](https://github.com/lodash/lodash). Updated from 4.17.19 to 4.17.21.


## 2.0.0 (21.07.2020)

* Add `forgetKnownHosts` feature.
* Add CLI.
* Prepare the package for publishing on GitHub.
* Add LICENSE.

## 1.0.1 (23.09.2019)

* Fix the bug that freezes ESLint during linting. 
* Fix the bug which leads to duplicating IPs in the known hosts file.

## 1.0.0 (29.08.2019)

* Initial version.
