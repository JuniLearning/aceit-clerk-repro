# Clerk Auth Repro

## Setup steps:

- Clone this repo
- Run `npm install`
- Run `npm run dev`
- Visit the url indicated in the console

## Troubleshooting:

- Go to the sign up page
- Open the Network tab of DevTools
- Attempt to sign up
- You should see the following error:

```json
{
  "message": "is invalid",
  "long_message": "email_link does not match one of the allowed values for parameter strategy",
  "code": "form_param_value_invalid",
  "meta": {
    "param_name": "strategy"
  }
}
```

Note that the website ui will currently (incorrectly) tell you that there's a link in your inbox when you attempt to sign up.

<img width="966" alt="Screenshot 2023-06-20 at 2 42 31 PM" src="https://github.com/JuniLearning/aceit-clerk-repro/assets/2024396/b776a9b1-4415-4628-9608-2e3851f51f99">
