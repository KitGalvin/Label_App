## Howto Deploy Labels Database

**Install Dependencies**

- Meteor
- Node.JS (version 0.10.36 works best)
- mongodb

**Create Workspace**

```
mkdir -p dev/build
mkdir -p dev/temp
```

**Create Meteor Project**

````
cd build
meteor create labels
````

**Remove Default Project Files**

```
cd build/labels
rm labels*
```

**Copy Files to Project**

- labels.js
- client
 - labels.css
 - labels.html
 - main.js
 - template.html

**Manage Meteor Packages**

```
cd build/labels
meteor add accounts-password accounts-ui
```

**Build Meteor Project**

Build and Package Project:

```
meteor build ../../temp
```

Unpack Project:

```
cd ../../temp
tar zxf labels.tar.gz
```

check the readme in the bundle directory

Install Node.JS Packages:

```
cd bundle/programs/server
npm install
```

If using Node.JS 0.12, you need to reinstall bcrypt:

```
cd bundle/programs/server
rm -rf npm/npm-bcrypt/
npm install bcrypt
```

**Run Deployment**

```
cd bundle
env PORT=80 MONGO_URL=mongodb://localhost:27017/labels
ROOT_URL=http://localhost node main.js
```

Open page in browser, add users using the login window

**Remove function to add users**

1. Stop the application
2. Go back to the project directory and edit the main.js file. Uncomment line 8, “forbidClientAccountCreation”
3. Repeat process to build the Meteor project

**Import labels database into Mongo (if required)**

```
mongoimport –db labels –collection labels –file labels.json
```
