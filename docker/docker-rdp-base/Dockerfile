FROM alpine:edge

RUN apk --no-cache add xorg-server xrdp s6 xf86-input-mouse xf86-input-keyboard xf86-input-evdev udev setxkbmap xinit
RUN apk --no-cache add xorgxrdp --repository http://dl-3.alpinelinux.org/alpine/edge/testing/

RUN xrdp-keygen xrdp auto

RUN adduser -D user && \
    echo "setxkbmap de" >> /home/user/.xinitrc && \
    chown user:user /home/user/.xinitrc && \
    echo user:user | chpasswd

COPY etc/ /etc/

RUN apk add bash


EXPOSE 3389

CMD ["s6-svscan", "/etc/s6"]
