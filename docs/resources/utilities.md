# Utilities

This is a growing list of packages that may help you in the development of your Cerebral Project

## state-forms

A computed form - originally @cerebral/forms

### Description

Forms are one of the most complex state management challenges out there. Before Cerebral was created I spent a lot of time developing formsy-react, which is a library that tries to solve forms with internal state. With the release of Cerebral we got a chance to explore the space of solving forms complexity with external state instead. To this day I have a hard time recommending a solution and you should not see this lib as "the official way of managing forms with Cerebral". There is nothing wrong thinking of a form as a very complex input where you only pass data into Cerebral on the submit of the form.

[GitHub](https://github.com/garth/state-forms) |
[npm](https://www.npmjs.com/package/state-forms)

## @cerebral/storage

### Description

This module exposes local storage or session storage as a provider, where it by default parses and serializes to JSON.

```marksy
<Info>
Note: this one is not in npm yet, so you need to add the github url in `package.json`
</Info>
```

[GitHub](https://github.com/psypersky/cerebral-local-storage)