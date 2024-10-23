# Verdict OJ (Online Judge) System

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
    - [Backend ](#backend-book-social-network)
    - [Dispatcher]()
- [Learning Objectives](#learning-objectives)
- [License](#license)
- [Getting Started](#getting-started)
- [Contributors](#contributors)
- [Acknowledgments](#acknowledgments)

## Overview

Verdict-oj is an online judge system contains a problem set of algorithms to solve, while users can compile a piece of code and execute the generated binary with pre-constructed data to test if the code is correct built.

## Features

- **User Code Submission**: Users submit code through frontend.
- **Asynchronous Judging**: Submissions are processed by dispatcher.
- **Isolated Code Execution**: Runs user-submitted code in a secure environment using isolated-vm.
- **Submission Management**: Handles code submissions, test case management, and verdict generation.
- **Redis Integration**: Uses Redis for message queuing (pub/sub) and caching results.
- **Error Handling**: Monitors memory and time limits during code execution to ensure performance constraints.
- **Task Queueing**: Dispatches code execution tasks to worker nodes.
- **Job Management**: Processes submissions from the queue and forwards them to the dispatcher for execution.
- **Redis Pub/Sub**: Acts as both a publisher and subscriber for processing job results.

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

By working with this project, students will gain hands-on experience in:

- Designing a class diagram based on business requirements.
- Implementing microservice architecture using a mono-repo approach.
- Securing an application with JWT tokens using Passport, along with asymmetric key encryption.
- Utilizing the Repository Pattern for managing the database layer with reusable generic code.
- Setting up Redis for caching and message queues (via Azure Cache for Redis).
- Configuring isolated-vm to run untrusted JavaScript code in a secure sandbox environment.
- Writing unit tests with Jest.
- Dockerizing the infrastructure for seamless deployment.
- Deploying the system using Azure Web App services.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Getting Started

To get started with the Book Social Network project, follow the setup instructions in the respective directories:

- [Backend Setup Instructions](/backend/README.md)
- [Dispatch Setup Instructions](/dispatch/README.md)

## Acknowledgments

Special thanks to [Chao Liu](https://github.com/liupangzi) for inspiring the project idea.
