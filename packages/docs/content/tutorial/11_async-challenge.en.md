---
title: Async Challenge
---

## 11: Async Challenge

We would like you to run two getRepo(...) requests. One to *cerebral/cerebral* and one to *cerebral/addressbar*. So it is a good idea to make *getRepo* a factory instead. On their successes they should insert their data into the state tree. Also create an action that sums the stars and adds a third state in the state tree with the sum of both repos star count. This part requires you to read up on how to set and get state in actions. This sum action should run and be displayed in a toast after both *getRepo* are done running. Remove any other success and error toasts.
