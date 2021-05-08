#!/bin/sh
HOSTPARAM=$1
if [ "$HOSTPARAM" == "" ]; then
	echo "usage: $0 ALLOWED_HOST"
	exit
fi

echo "removing DEBUG..."
sed -i 's/DEBUG = True//' app/app/settings.py

echo "delete old secret key..."
sed -i '/SECRET_KEY/d' app/app/settings.py

echo "set new SECRET_KEY.... (shhh, it's secret!)"
NEWKEY=`tr -cd '[:alnum:]' < /dev/urandom | fold -w90 | head -n1`
echo "SECRET_KEY = \"$NEWKEY\"" >> app/app/settings.py

echo "set allowed host to: $HOSTPARAM"
sed -i '/ALLOWED_HOSTS/d' app/app/settings.py
echo "ALLOWED_HOSTS = [ \"$HOSTPARAM\" ]" >> app/app/settings.py

echo "done!"
