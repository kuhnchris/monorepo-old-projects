/*
  Utility application to find the proper hex codes for
  the _IOW _IRW, _IW, _IR, ... macro wrappers for the
  ioctl command addresses
*/
#include <linux/videodev2.h>

int main(){
        printf("QUERYCAP: %x\n",VIDIOC_QUERYCAP);
        printf("ENUM_FMT: %x\n",VIDIOC_ENUM_FMT);
        printf("VIDIOC_ENUMVIDEO: %x\n",VIDIOC_ENUMVIDEO );
        printf("VIDIOC_G_FMT: %x\n",VIDIOC_G_FMT );
        printf("VIDIOC_S_FMT: %x\n",VIDIOC_S_FMT );
}

