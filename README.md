# pwaforgedevcon2018-2

## Introduction
This is a proof of concept app that I was working on for Autodesk University/ForgeDevCon to demonstrate offline workflows with Forge and how you can use PWA's and service workers to accomplish these. I especially wanted to concentrate on the viewer itself.

### Progressive Web App
This is a type of web app that is characterized by lighting up functionality that is available on the platform that it is running on. It can do things like cache selectively, communicate between tabs and pages, push notifications etc. We will be looking mostly at caching and some of the communication features.

## Service Workers

### Cache One Cache All
This app demonstrates a couple of different caching methods. The first is if the user checks the cache model check box, it will send a message to the service worker that we are going to start caching. It will continue caching everything until the document is unloaded. I envision this one, maybe, if you have extensions that are making their own REST calls that need to be cached.

### Prescriptive
The second method uses a special function that was originally developed by Michael Beale (@wallabyway) and enhanced by Petr Broz (@petrbroz). I took their code, put it in an azure function that returns an array of urls that were pulled from the manifest data.

### Service Worker Messaging
This was the stickiest part of the app. It uses the message api which allows communication between the service worker and all the tabs that are under its control.

## Azure Functions
These are lightweight serverless api endpoints. There is one to retrieve an access token and one to get the list of URL's. You can find this code in the sw-forgefuncs-azure repo.