up:
	docker run --cap-add SYS_ADMIN --device /dev/fuse -p 3389:3389 --name kuhnchris-docker-rdp-chromium -t kuhnchris/docker-rdp-chromium

build:
	docker build -t kuhnchris/docker-rdp-chromium . && docker container rm kuhnchris-docker-rdp-chromium || true

push:
	docker push kuhnchris/docker-rdp-chromium

kill:
	docker kill kuhnchris-docker-rdp-chromium && docker container rm kuhnchris-docker-rdp-chromium
