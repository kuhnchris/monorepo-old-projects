up:
	docker run --cap-add SYS_ADMIN --device /dev/fuse -p 3389:3389 --name kuhnchris-docker-rdp-base -t kuhnchris/docker-rdp-base

build:
	docker build -t kuhnchris/docker-rdp-base .

push:
	docker push kuhnchris/docker-rdp-base

kill:
	docker kill kuhnchris-docker-rdp-base
