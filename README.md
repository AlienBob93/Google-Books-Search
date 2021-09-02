# Getting Started

Fullstack challenge submission.

This application allows an user to search through Google Books through a custom API route.\
See the design Document for further details.


## Initial Setup

Setup the PostgressSQL database using the script **createTable.sql**\
Modify the script with the appropriate username and password before executing the script using:

    psql -U postgres -a -f createTable.sql -p 5432

The Google Books API Key is loaded through the file **gBooks_api_key.json** which should contain the following key-value pair: 

    "BooksAPIkey": "API KEY HERE"

## Server

edit **db_connection_info.js** with your PostgressSQL database connection details

To run the server\
In the google-books-server directory, run:

    npm i
    npm src/server.js

Runs the server in the development mode.\
Endpoint will be [http://localhost:8000](http://localhost:8000) 

## Web App
To run the web app\
In the book-search-app directory, run:

    npm i
    npm start

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.