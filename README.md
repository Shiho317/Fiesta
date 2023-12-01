# Fiesta

Full-stack web application which is for managing user’s hosting events.

:white_check_mark: Used T3 stack to create a scalable cloud application with typescript.

:white_check_mark: Created an email service with AWS to send invitations to event guests with template designed by the user .

`Next.js`, `Typescript`, `Node.js`, `PostgreSQL`, `tRPC`, `Prisma`, `Tailwind CSS`, `AWS Lambda`,
`AWS-SQS`, `AWS-StepFunctions`, `Next-Auth`

## Overview :eyes:

![login-email-page](https://github.com/Shiho317/Fiesta/assets/88401910/9766c2e5-21ed-454f-8a48-f09481ae9c0d)
You can login with magic links sent to registered email by Next-Auth.

![admin-page](https://github.com/Shiho317/Fiesta/assets/88401910/e8d50c6b-dd63-4ac5-8e6c-93f6e82be079)
After logged in, you can see your events status in account page.

![event-page](https://github.com/Shiho317/Fiesta/assets/88401910/109a9238-2b7b-46ad-836d-4a5f033e1382)
You can create, edit and delete event. Even if you already sent invitation email to your friends for events that you want to edit or cancel, email service will send email about changes to invited friends automatically.
All events will be split by date to make clear the event date is past or future.

![planner-page](https://github.com/Shiho317/Fiesta/assets/88401910/8d533182-5fbb-47c4-b755-806c6884ea7b)
You can register your planner to make easier to contact planner and organize event with same planner in the future.

![loggedout-page](https://github.com/Shiho317/Fiesta/assets/88401910/b15d186c-eb30-48ba-a931-9569d7f29971)
Once you logged out successfully. You will see this page. If you don't logout, you don't need to login. Page will move forward to your account page automatically within 1 month.

## Try to use

- [Fiesta](https://fiesta-ebon.vercel.app/)
