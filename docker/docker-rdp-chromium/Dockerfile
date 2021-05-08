FROM kuhnchris/docker-rdp-base
RUN apk --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ add chromium
RUN chmod +x /home/user/.xinitrc
RUN echo "chromium-browser --no-sandbox" >> /home/user/.xinitrc
#RUN echo "while [ '1' == '1' ]; do sleep 5; done" >> /home/user/.xinitrc

