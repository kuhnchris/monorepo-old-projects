# node-v4l2-ioctl
The Video4Linux 2 IOCTL-based shim to interact with cameras on hosts from node.js

### Motivation
Why did I do this while there are perfectly fine packages out there?

Well, mostly:

- I tried to install those packages on a RPi3b
- That means: ARM7L or AARCH64, I opted for the later
- Additionally: alpine linux on RPi3b
- That means: no glibc, only musl-lib

Now, there are couple of projects I tried:

- pybindgen for generating bindings for linux/video4linux2.h --> failed
- for that to work I had to install pygccxml
- that in turn needed gccxml or crossXml
- that in turn needed to be compiled by hand since no package available
- after compiling and working with all of those, it turned out, I cannot properly generate the files I need from the kernel headers. Bummer.

### How about other projects?

Sure, let me tell you my experiences. All of them fail either due to:

- binary dependence on glibc
- using old bindings that don't work anymore
- take ages to compile (example: openCV, I wrote this entire project while openCV was still compiling)

### Conclusion

Since I wanted to know the inner workings of V4L2 anyways, this was the perfect opportunity to do so. Hence this project began.

### Limitations

Currently I only include a very limited sub-set of commands for V4L2. If I feel the need to add more, I'll add more. If you open an issue and tell me you need X, I might add it, but I most likely will not be able to test it, as I base this around a RPi3B connect to a Logitech Webcam, so any non-webcam-capture related things would need an investment from someone to get me the hardware to test things out. And we all know that most likely won't happen on the internet.

### Current implementation

#### Tested
- VIDIOC_QUERYCAP
- VIDIOC_ENUM_FMT
  
#### Untested

### Implementation notes:
[UAPI reference](https://github.com/torvalds/linux/blob/master/include/uapi/linux/videodev2.h)
[ioctl reference](https://linuxtv.org/downloads/v4l-dvb-apis/uapi/v4l/user-func.html)