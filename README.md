# Verdict OJ (Online Judge) System

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
    - [Backend (book-social-network)](#backend-book-social-network)
    - [Frontend (book-social-network-ui)](#frontend-book-social-network-ui)
- [Learning Objectives](#learning-objectives)
- [License](#license)
- [Getting Started](#getting-started)
- [Contributors](#contributors)
- [Acknowledgments](#acknowledgments)

## Overview

Verdict-oj is an online judge system contains a problem set of algorithms to solve, while users can compile a piece of code and execute the generated binary with pre-constructed data to test if the code is correct built.

## Features

- User Code Submission: Users submit code through frontend.
- Asynchronous Judging: Submissions are processed by dispatcher.
- Isolated Code Execution: Runs user-submitted code in a secure environment using isolated-vm.
- Submission Management: Handles code submissions, test case management, and verdict generation.
- Redis Integration: Uses Redis for message queuing (pub/sub) and caching results.
- Error Handling: Monitors memory and time limits during code execution to ensure performance constraints.
- Task Queueing: Dispatches code execution tasks to worker nodes.
- Job Management: Processes submissions from the queue and forwards them to the dispatcher for execution.
- Redis Pub/Sub: Acts as both a publisher and subscriber for processing job results.

#### Class diagram
![Class diagram](screenshots/class-diagram.png)

#### Spring security diagram
![Security diagram](screenshots/security.png)

#### Backend pipeline
![Security diagram](screenshots/be-pipeline.png)

#### Backend pipeline
![Security diagram](screenshots/fe-pipeline.png)

## Technologies Used

### Backend

- Node.js: Server-side JavaScript runtime
- NestJS: Backend framework for both services
- Redis: For pub/sub messaging and caching
- TypeORM: ORM for managing database connections

### Dispatcher 

- Isolated-Vm: Isolated-vm: Secure isolated environment for untrusted code execution (used in backend)
- Redis: For pub/sub messaging

## Learning Objectives

By following this project, students will learn:

- Designing a class diagram from business requirements
- Implementing a microservice repo approach
- Securing an application using JWT tokens with Passport and Asymmetric key secret
- Utilizing Repository Pattern for 'database layer' combining Generic Pattern for reuse code
- Implementing the service layer and handling application exceptions
- Object validation using JSR-303 and Spring Validation
- Handling custom exceptions
- Implementing pagination and REST API best practices
- Using Spring Profiles for environment-specific configurations
- Documenting APIs using OpenAPI and Swagger UI
- Implementing business requirements and handling business exceptions
- Dockerizing the infrastructure
- Deployment

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Getting Started

To get started with the Book Social Network project, follow the setup instructions in the respective directories:

- [Backend Setup Instructions](/book-network/README.md)
- [Frontend Setup Instructions](book-network-ui/README.md)

## Contributors

- [Ali Bouali](https://github.com/ali-bouali)

## Acknowledgments

Special thanks to the developers and maintainers of the technologies used in this project. Their hard work and dedication make projects like this possible.
