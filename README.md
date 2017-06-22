# steam-web-authenticator
Nodejs server for generating steam codes

# Usage
- Do the ``` npm install ```

- Edit file config.js
```javascript
module.exports = {
        username: "user",
        password: "pass",
        secret: "shared_secret",
        port: 21377
}

```
  - **username** and **password** will be used for authenticating using HTTP basic auth.
  - **Secret** is your shared_secret steam guard code. If you don't know what shared_secret is or where to get it, try [here](http://goo.gl/search/steam+shared_secret)
  - **Port** is the number you want your web server going on

- Do the ```npm run``` or ```node index.js```

# Troubleshooting
## Code is wrong
That probably means your secret is wrong. I am not able to check whether your secret is valid


*Please note that this is very very very early version and I cannot guarantee you full security.*
