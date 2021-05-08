# Interal Django Proxy

### What is this thing?
A quick and dirty way to provide a password protected area with reverse proxy capability to provide access to services hidden behind a 'gateway'.
Literally a "Proxy As A Service" (PrAAS)

### Why?
To avoid having to expose certain things (webmails, sslvpns, remote desktops, ...) directly to the world, you can funnel the access through a proxyfied network to guarantee a single point of entrance for any third party accessing said services without the need to install software.

### Is it secure?
Well, it's as secure as you make it. This project only provides the bare minimum, it features:

- Website access control via "allowed domains"
- Basic Rewrite capabilities (text/html, not Javascript yet)

More to come, if I feel the need to implement it.

### (feature) is missing! I cannot use this
Feel free to fork this project and implement the feature on your own, and, if you feel generous, send in a PR to make it avaiable to a broader audience.
Or, use a service like **gitcoin.co** to encourage people to develop features.

### I got more questions...!
Feel free to open a issue and I will try to answer it.

### Getting started

```
pip install -r requirement.txt
python3 app/manage.py createsuperuser
python3 app/manage.py runserver
```

!["http://creativecommons.org/licenses/by-sa/4.0/">](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).