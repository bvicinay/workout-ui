PART 1

Build a UI dashboard for a workout and fitness tracker Web Application.

High Level Architecture and Design:

Design language is specified in DESIGN.md, read thoroughly and apply those principles to inform the design.

Architecture and Frameworks / Structure of the project is specified in API_SPEC.md, read thoroughly and structure the project appropriately.

Backend APIs and Data Specification details are specified in API_SPEC.md, read carefully and build the clients/sdks/development_server accordingly. The portal should connect to the frontend api according to that spec, both for local development and for production use.

Views and pages in the dashboard are located in API_SPEC.md.


If you need to use additional tools, frameworks not specified (for example: to display the database tables / records in one of the views) ask me for input listing the option you think is best.

Ensure the requests and responses are per the API Spec. Try to keep things lightweight when possible. The dashboard should be kept simple, when possible.


Dashboard Structure:

Starts with a simple login page. Username, password, login button. No forgot password / register, that will be setup manually by an admin (me) at the Auth provider itself. The Auth provider should be a simple AWS Cognito setup, code that authentication / login flow and make things configurable for once I setup Cognito appropriately. Try to go with a simple setup. Essentially the plan is for the username/password login flow to be passed in to the Auth provider, which will return a JWT. The JWT can then be stored and passed on subsequent API calls to the backend (figure out best, secure, simple way of doing this following established patterns).

Once logged in, the dashboard displays. Each view represents a different section of the dashboard. Basically only one view is displayed at a time, with View 1 being the default, landing one.


Ask questions when you are unsure as to how to display, structure or code things. Be thorough and check your work. Setup a way of running and testing the frontend locally, using the backend APIs described.

----

Part 2

Getting the following exception when I run "npm run dev"

amazon-cognito-ident…s.js?v=6828dc34:214 Uncaught ReferenceError: global is not defined
    at node_modules/buffer/index.js (amazon-cognito-ident…s?v=6828dc34:214:35)
    at __require2 (chunk-ULBN3QDT.js?v=6828dc34:21:50)
    at amazon-cognito-ident…?v=6828dc34:2575:29


----

Part 3

The color of the muscle groups is too saturated, make it more subtle so it blends in with the rest of the design.

On the Overview "This Week by Muscle Group" chart, the y-axis should show every label/muscle group name

On the Overview "Weekly Training Volume" the values are a rolling sum, make it a discrete sum, showing for week x of the year (label should be week starting). All weekly statistics should follow this principle.

In the Exercises "Strength Progression", also add effecive 1RM.

Add a new section called Reference, where you explain how each metric is calculated and what it means (1RM, ripley, etc, effective vs peak, volume)