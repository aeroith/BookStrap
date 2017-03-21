# BookStrap

[![Build Status](https://travis-ci.org/aeroith/BookStrap.svg?branch=master)](https://travis-ci.org/aeroith/BookStrap)

BookStrap is created to provide an easy and useful way of organizing and
collecting ebooks. It is very easy to use and low on resources. It also has a
contact form powered by sendgrid configured, but it is optional.

The current stack used behind the framework is Node.js, Express.js, MongoDB and
React. 
The React part was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
Please refer to the link for the further guide on the development of the frontend.

### Demo
You can find the demo in here: https://bookstrap.ga/ 

## Why should you use it?

I am a book lover and a Kindle owner. I had troubles keeping my books organized, and I wanted them
to store on the cloud. I firstly tried Calibre-Server however it required some hack to make it work
on the server environment using tools such as xvfb and imagemagick. Also it was quite heavy on the server (constant 40-50% CPU usage all the time). I also tried other frameworks but they all relied on calibredb 
to add and retrieve content from the database which still made me deal with hacky tools. So I developed my
own.

It is still in an alpha stage and I provided some TODOs at the end of this Readme. If you are interested in
the main advantages of the framework, they are:

- Easy to install and portable
- Lightweight and without too many lines of code
- A search is provided with the support of tags

Also this is actually my first project in Web Development so expect a lot of bad code :)  

## Quick start

To install the framework just follow the steps below:

- Clone the repo: `git clone https://github.com/aeroith/BookStrap.git`
- Rename the configuration file in the server directory by removing the example
extension: `mv server/config.json.example server/config.json`
- Fill the `config.json` file according to your settings.
- Install the dependencies for both backend and frontend using `npm install` inside the root project folder and server folder
- Build: `npm run build`
- Serve: `node server`
- Go to `localhost:3001`to see your app

The app will by default serve on 3001 port for the production build and 3000 for
the development build. You can change it according to your needs. I personally use it with Nginx reverse
proxy as you can see in the demo. But it is up to you to decide how to serve it.

## Bugs, Issues and feature requests

For any issue or any request please use the form on the [demo website](https://bookstrap.ga/contact) to
send me a mail or [open a new issue](https://github.com/aeroith/BookStrap/issues/new). Also please note
that if you have problems with adding books to the server, please refer to my 
[epub parser here](https://github.com/aeroith/epub-metadata-parser).

## TODO
I plan to add a login page to access the material, since you don't really want anyone to access your
books right? Also in the future, I plan to add to .mobi conversion so that it is possible to send
the books directly to the Kindle.
