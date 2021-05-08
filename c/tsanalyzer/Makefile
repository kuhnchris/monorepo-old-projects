include ./Makefile.global

DIRS = src tools
OBJ = main.o tsutils.o bitutils.o
LINKOBJ = ts/adaption_field.o ts/MPEG_transport_stream.o ts/program_association_section.o ts/transport_packet.o ts/PES_packet.o ts/CA_section.o ts/CA_descriptor.o ts/TS_program_map_section.o ts/descriptor.o $(OBJ)

all: compile-src compile-tools
	
compile-src:
	make -C src

compile-tools:
	make -C tools

clean: clean-all
	
clean-all:
	for i in $(DIRS); do make -C $$i clean; done
