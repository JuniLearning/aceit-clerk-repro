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
