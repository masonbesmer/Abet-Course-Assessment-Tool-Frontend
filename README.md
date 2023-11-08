# Description

Each term, students and faculty enter data for each course they are enrolled
in/teach in the CSE department. This data is used to assess the department
courses for ABET accreditation. Near the end of the term, students are given a link
where they assess their CSE courses based on pre-specified course outcomes.
After the course is completed, instructors have data (including attachments) that
are provided. Reports are provided to the department Undergrad Curriculum
Committee and the Undergraduate Coordinator so that the courses can be
assessed according to the course and relevant program outcomes. There is a
current system, which is hard to use and hard to maintain. The program outcome
mappings are obsolete due to ABET changes, so a new version is needed.

This is the front-end for the Fall 2020 - Spring 2023 UNT ABET Tool Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started/First Time Setup
1. Open Visual Studio Code
2. Click the "New Terminal" option under the "Terminal" dropdown on the top of the window
3. At the bottom of your window of Visual Studio Code, click inside of the box that appears
4. Run the following command:
    `cd \path\to\cloned\github\repo\`
        Note: you can press tab to autofill path locations
        The path would be the path to this readme document
5. The terminal should now say: `PS \path\to\repo\here\` on the left
6. Run the following command inside the terminal to install the proper items necessary to run the front end:
    `npm install`
    OR
    `yarn install`
7. Place necessary environment variables (`.env` files) within the top level directory of the repository. They should be marked as hidden files with a period at the start, like `.env.development` and `.env.local`
8. Before running, make sure you are using node version `16.x`, or the frontend won't run. You can use [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage and switch between node.js versions.

## How to run the front end
1. If you have just completed the getting started section, go to 3. If not, continue to 2.
2. Simply run steps 1-5 on the Getting Started section which is just above this section. Continue to 3 when done
3. Inside the terminal, simply run one of the following commands:
    `npm run dev`
    OR
    `yarn dev`
4. Visual Studio Code might automatically open a new browser that has the login page on it
    If not, simply open a new tab in a browser and type `http://localhost:3000` (or whatever port you specified in your environment variables) in the search bar
5. Although the front end is up and running, the back end needs to be running as well in order to log in
    The UNT VPN also needs to be runnning for the back end to work properly
6. You can now start editing pages, and they should automatically update as you save progress

## Useful Documentation (not needed for simply running the front end of the project)
[Next.js](https://nextjs.org/docs/getting-started)
[Chakra-UI](https://chakra-ui.com/docs/getting-started)
