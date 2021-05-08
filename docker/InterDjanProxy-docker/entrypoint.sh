#!/bin/sh 

if [ `grep "$SERVER_HOST" app/app/settings.py 2>&1 >/dev/null; echo $?` -ne 0 ]; then
	echo "change to production allowing the server $SERVER_HOST"
	sh switch2prod.sh "$SERVER_HOST"
fi

echo "running (possible) migrations..."
python3 app/manage.py migrate
echo "collecting statics..."
cd app && rm -Rf static && python3 manage.py collectstatic && cd ..

#DO NOT USE, ONLY IN DEV MODE!
#echo "running python-django runserver on port $SERVER_PORT"
#python3 app/manage.py runserver 0.0.0.0:$SERVER_PORT 2>&1
cd app && gunicorn --daemon --workers 3 --bind unix:/app/app.sock app.wsgi
nginx -g 'daemon off;'
echo "entrypoint.sh left"

