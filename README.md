# Environment Exposed

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

## Summary

Example of an environment variable being exposed to the client side code in a web application.

## Explanation

This example app is a frontend for Google Gemini's AI Chatbot.
The user can chat with the AI and ask questions.

This is done through the client side from the users browser, which sends requests directly to google gemini to get responses.

Because of this the user can see the API key in the network requests and use it for their own purposes. For example using the api key to make requests to google gemini directly from their own code.

To fix this the API key needs to be moved to the server so that the user does not have access.
