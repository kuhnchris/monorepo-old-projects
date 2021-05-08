include ../../Makefile.global

APPNAME = captiondumper
OBJ = main.o

all: clean $(OBJ)
	$(CC) $(CFLAGS) -o $(APPNAME) $(OBJ) -lm

clean:
	rm *.o $(APPNAME) || true