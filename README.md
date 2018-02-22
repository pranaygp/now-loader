# Webpack Now Loader

Webpack loaders are super cool. You can extract away a require statement at compile time, and do what you want with the file. I thought deploying the required file statically to Now, and using the deployed url at runtime could lead to some cool developer benefits.

For example, in your React file:

```javascript
const picture = require('now-loader!picture.png');
const resume = require('now-loader!resume.pdf');

...

<div>
  <img src={picture} alt="A picture of me"/>
  <a href={resume}>Get my resume</a>
</div>
```


This way, when you run `webpack`, the loader deploys the picture and the resume, retrieves a `now.sh` deployment url, and then your codebase hotlinks to them. There seems to be an unnescessary level of indirection here, but consider these:

* Your static resources are now hosted individually and have shareable links to them. For instance, I use this on my website(pranay.gp) so that my Resume is hosted and accessible from its own deployment (resume.pranay.gp)
* You can update static dependencies without having to update your website. Using the alias webpack option, the loader can automatically alias your deployment right after creating it, and return the aliased URL instead. That way, in the future, if you build your site again with an updated static resource, it will deploy and alias it correctly, and you don't have to actually re-deploy your website 

But that's not all. Here's what I personally think is the coolest thing you can do with it (**Still in development however**)

```javascript
const APIendpoint = require('now-loader!../test-backend/package.json');

fetch(APIendpoint + '/foo').then(console.log)
```

On your client codebase, you can simply "require" your entire backend codebase (by either requiring the root `package.json`, `now.json` or `Dockerfile` in your backend codebase). When you run `webpack`, it'll deploy the latest version of your backend to [now](http://now.sh), and return the URL to that so you can just use it throughout your client codebase without having to configure (or worse, hardocde the url on) your frontend.