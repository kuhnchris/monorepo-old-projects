FROM alpine:latest
RUN apk add python3 git nginx
RUN mkdir /app
WORKDIR /app
RUN git clone "https://github.com/kuhnchris/InterDjanProxy.git" . && true
RUN pip3 install -r requirement.txt
RUN pip3 install gunicorn
COPY entrypoint.sh /app
COPY django-app.conf /etc/nginx/conf.d/
RUN mkdir -p /var/lib/nginx/tmp
RUN mkdir -p /run/nginx
ENTRYPOINT /app/entrypoint.sh
