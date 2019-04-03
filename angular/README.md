## Serve to localhost API
- 
- 


## Serve to prodution API
- 
- 


## Deploy to Firebase Hosting (preferred because it's only static content)
- Install firebase-tools `$ npm install -g firebase-tools`
- Sign in to Google `$ firebase login`
- Initiate the project `$ firebase init` 
  - include only Firebase Hosting
  - create a new project
  - use **dist** as public directory
  - rewrite all urls to /index.html
  - don't override index.html
- Deploy the website `$ firebase deploy`
- Check [sulbaguia.firebaseapp.com](https://sulbaguia.firebaseapp.com)
- **IMPORTANT:** Always use the package.json scripts to serve and deploy.


## Deploy to App Engine (LEGACY)
- Install google-cloud-sdk
- Sign in to Google `$ gcloud auth login`
- Set project `$ gcloud config set project sulbaguia`
- Deploy `$ gcloud app deploy`
