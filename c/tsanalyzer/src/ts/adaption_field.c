#include "../common.h"
uint8_t adaptation_field(char* data,uint8_t pos){
	/* NOT IMPLEMENTED YET. */
	printf("(AF) returning %d.\n",data[pos]);
	return pos + data[pos] + 1;
}