# Cards

## Start
```bash
$ npm run docker
```
Will run docker-compose with 2 containers - app and db.  
App is accessible at http://127.0.0.1:3000  
Request examples might be found in [manual.http](./manual.http) file.

## Tests
```bash
$ npm run test:docker
```
Will run all tests, including e2e.  
Didn't write all the tests for the sake of time.
Though, I can explain what other tests I'd write otherwise.