# API CORS

> Module: D - Back-End Development / Difficulty: Normal

A Front-end application and a Back-end application are provided.

Access the Back-end through the VM Apache server, and use `npm run dev` for the Front-end application, making sure to use a different port than the Back-end.

When accessing the Front-end, 4 methods do not execute properly due to CORS.

Modify only the `cors.php` file in the Back-end application to ensure all requests execute correctly.

## Run Front-end Application
You can run the development server by executing the `npm run dev` command.

## Request address settings
You must open the front-end's `index.html` and modify the `API_HOST` variable to match your back-end.

(node_modules are provided in a compressed file. Be sure to refer to README.md)

> Marking aspect:
 - When you open the development server and connect, requests are sent to the back-end application. 0.20
 - The GET method request works correctly. 0.20
 - The POST method request works correctly. 0.20
 - The PUT method request works correctly. 0.20
 - The DELETE method request works correctly. 0.20

> To SCM

The HOST of the request from the front-end must be changed to suit the competition server environment.