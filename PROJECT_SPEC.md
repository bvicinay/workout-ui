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