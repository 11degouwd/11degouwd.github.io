---
content: Let's connect! I'm always interested in hearing about new projects and opportunities.
btnName: Send Message # The display name of the button on the contact form
info:
  email: "hello@example.com"
  phone: "+64 21 123 4567"
  linkedin: "https://www.linkedin.com/in/yourprofile"
  location: "Auckland, New Zealand"
  website: "https://example.com"
formspree:
  enable: true
  formId: kmefokfm # The formspree ID, you can get this from the url of your formspree project 
  captchaSiteKey: "dcsdccscsc4-fad2-4134-ba4c-dcdscdcsc" # If you are using hcaptcha enter the public key
  emailCaption: "Enter your email address"
  messageCaption: "Enter your message here"
  subjectCaption: "Enter subject"
  messageRows: 5 # The number of rows to display for the main message body

# Required Hugo parameters
build:
  render: never
  list: never
---