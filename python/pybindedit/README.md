# pybindedit
A webbrowser-esque editor for BIND configuration files.

**Please only use with localhost:8000, do not try to expose this to the outside world... (for obvious reasons)**

## First steps
To finish the setup of the project, run the following command(s):
```bash
# this runs migrations and creates db.sqlite3
python pybindedit/manage.py migrate
# collect static assets into static directory
python pybindedit/manage.py collectstatic
```

## User authentication
To make it possible for user(s) to login, they need to be super-user(s).

Execute the following command to create a superuser:
```bash
python pybindedit/manage.py createsuperuser
```
Follow the prompt as requested.


### *Open* Todo list:
* [ ] Add useful commands to ```Makefile```
* [ ] Implement ```edit``` button
* [ ] Implement ```save``` button
* [ ] Test / PyTest / Unit Test(s)
* [ ] Document & comment source code 

### *Finished* Todos:
* [x] Implement ```BIND9``` restart (via ```docker```)
* [x] Add ```docker-compose.yml``` and ```Dockerfile```
* [x] Add ```example/``` folder and files
* [x] Implement ```Add new entry``` 
* [x] Add ```Makefile``` for ease of use
* [x] Add requirements.txt (from ```pip freeze```)
* [x] Implement ```user auth```
* [x] Keep ```.gitignore``` up to date
* [x] implement drag & drop to move lines
* [x] refactor to use template(s) for the (dns-) lines
* [x] refactor ```toast``` by ```bootstrap``` into own component/app
