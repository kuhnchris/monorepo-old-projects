import {default as v4l2ioctl} from '../index';

let device = new v4l2ioctl("/dev/video0");
device.openDevice((err, fd) => {
    console.log(device.getCapabilities());
    console.log(device.enumVideoCaptureFormats());
});