# Task Management Application

## Objective
Create a working REST API for a task management application using TypeScript, Nest.js, MongoDB, and BullMQ, with Swagger integration for API documentation.

## Requirements
Implement the following features in the application:
1. User registration and login
2. Creation of projects by users
3. Adding tasks to projects by project owners
4. Assigning tasks to other users within the same project
5. Updating task status (e.g., ToDo, InProgress, Done) by assigned users
6. Commenting on tasks by project members
7. Searching for tasks by title, description, or assigned user within a project
8. Filtering tasks by status, priority, or due date within a project
9. Dashboard for project owners to view project progress and task statistics
10. Notifications for task assignments, updates, and approaching due dates
11. Integration with a third-party calendar API for syncing task due dates
12. Generating reports on project and task completion rates
13. Background job processing for generating detailed project reports

## Technical Requirements
1. Use TypeScript for the backend development
2. Utilize Nest.js as the framework for building the REST API
3. Integrate MongoDB as the database for data persistence
4. Implement BullMQ for handling background jobs and task queues (e.g., sending notifications, syncing with calendar, generating reports)
5. Use JWT (JSON Web Tokens) for authentication
6. Integrate Swagger for API documentation and testing

## User Stories

1. User Registration and Login
   - As a user, I want to be able to register for an account using my email and password.
   - As a user, I want to be able to log in to my account using my email and password.
   - As a user, I want to be able to log out of my account.

2. Project Management
   - As a user, I want to be able to create new projects.
   - As a user, I want to be able to view a list of all my projects.
   - As a user, I want to be able to update the details of my projects.
   - As a user, I want to be able to delete my projects.

3. Task Management
   - As a project owner, I want to be able to add tasks to my projects.
   - As a project owner, I want to be able to assign tasks to other users within the same project.
   - As a user, I want to be able to view the tasks assigned to me.
   - As a user, I want to be able to update the status of tasks assigned to me (e.g., ToDo, InProgress, Done).
   - As a user, I want to be able to comment on tasks within a project.

4. Task Search and Filtering
   - As a user, I want to be able to search for tasks within a project by title, description, or assigned user.
   - As a user, I want to be able to filter tasks within a project by status, priority, or due date.

5. Project Dashboard
   - As a project owner, I want to have a dashboard that displays project progress and task statistics.

6. Notifications
   - As a user, I want to receive notifications for task assignments, updates, and approaching due dates.

7. Calendar Integration
   - As a user, I want my task due dates to be synced with a third-party calendar API.

8. Reporting
   - As a project owner, I want to be able to generate reports on project and task completion rates.

9. Authentication and Security
   - As a user, I want my account and data to be secure and protected from unauthorized access.
   - As an admin, I want to ensure that authentication is required for accessing the API endpoints.

10. API Documentation
    - As a developer, I want to have access to comprehensive API documentation through Swagger.
    - As a developer, I want the API documentation to include detailed descriptions, request/response examples, and authentication requirements for each endpoint.

11. Error Handling and Validation
    - As a user, I want to receive clear and informative error messages when something goes wrong.
    - As a developer, I want to ensure proper error handling and validation of user inputs.

12. Testing
    - As a developer, I want to write unit tests to ensure the functionality of critical components.
    - As a developer, I want to have instructions for running the tests.

13. Performance and Scalability
    - As an admin, I want to implement rate limiting and request throttling to prevent abuse of the API.
    - As an admin, I want to ensure that the application is performant and can handle a high volume of requests.

14. Background Job Processing
    - As a project owner, I want to be able to initiate a background job to generate a detailed project report.
    - As a system, I want to use BullMQ to handle the queueing and processing of the report generation job.
    - As a project owner, I want to receive a notification once the report generation job is completed.

## Additional BullMQ Functionality

1. When a project owner requests a detailed project report, the API will trigger a new job to be added to a BullMQ queue.

2. The job data will include the necessary information to generate the report, such as the project ID and any specific parameters.

3. BullMQ will manage the job queue and assign the job to a worker process when resources are available.

4. The worker process will retrieve the job data from the queue and perform the necessary calculations and data aggregations to generate the detailed project report.

5. Once the report is generated, the worker process will mark the job as completed in BullMQ.

6. BullMQ will then trigger a completion event, which can be used to send a notification to the project owner indicating that the report is ready.

7. The project owner can then retrieve the generated report from a designated location or through an API endpoint.

To implement this functionality, the student will need to:

1. Set up BullMQ in the Nest.js application and configure the necessary queues and worker processes.

2. Create a new API endpoint that accepts a request to generate a project report and enqueues a new job in BullMQ.

3. Implement the worker process that consumes the job from the queue, generates the report, and marks the job as completed.

4. Set up event listeners in BullMQ to trigger notifications or any other required actions upon job completion.

5. Update the Swagger documentation to include the new API endpoint for generating project reports.
