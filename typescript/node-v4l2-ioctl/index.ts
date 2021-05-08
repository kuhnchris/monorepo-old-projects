import { ioctl as ioctl } from 'ioctl';
import * as ref from 'ref';
import * as refarray from 'ref-array';
import * as refstruct from 'ref-struct';
import * as refunion from 'ref-union';
import * as fs from 'fs';
import { type } from 'os';

class v4l2_types {
    static v4l2_fmtdesc: refstruct = refstruct(
        {
            index: ref.types.uint32,
            type: ref.types.uint32,
            flags: ref.types.uint32,
            description: refarray(ref.types.uint8, 32),
            pixelformat: ref.types.uint32,
            reserved: refarray(ref.types.uint32, 4)

        })
    static v4l2_capability: refstruct = refstruct(
        {
            driver: refarray(ref.types.uint8, 16),
            card: refarray(ref.types.uint8, 32),
            bus_info: refarray(ref.types.uint8, 32),
            version: ref.types.uint32,
            capabilities: ref.types.uint32,
            device_caps: ref.types.uint32,
            reserved: refarray(ref.types.uint32, 3)
        }
    )
    static v4l2_std_id: refstruct = refstruct(
        {
            v4l2_std_id: ref.types.uint64
        }
    )

    static v4l2_input: refstruct = refstruct(
        {
            index: ref.types.uint32,
            name: refarray(ref.types.uint8,32),
            type : ref.types.uint32,
            audioset: ref.types.uint32,
            tuner: ref.types.uint32,
            std: v4l2_types.v4l2_std_id,
            status: ref.types.uint32,
            capabilities: ref.types.uint32,
            reserved: refarray(ref.types.uint32,3)

        }
    )

    static v4l2_pix_format: refstruct = refstruct({
        width: ref.types.uint32,
        height: ref.types.uint32,
        pixelformat: ref.types.uint32,
        field: ref.types.uint32,
        bytesperline: ref.types.uint32,
        sizeimage: ref.types.uint32,
        colorspace: ref.types.uint32,
        priv: ref.types.uint32,
        flags: ref.types.uint32,
        enc: refunion({
            ycbcr_enc: ref.types.uint32,
            hsv_enc: ref.types.uint32,
        }),
        quantization: ref.types.uint32,
        xfer_func: ref.types.uint32,
    })

    static v4l2_plane_fix_format: refstruct = refstruct({
        sizeimage: ref.types.uint32,
        bytesperline: ref.types.uint32,
        reserved: refarray(ref.types.uint16,6),
    })

    static v4l2_pix_format_mplane: refstruct = refstruct({
        width: ref.types.uint32,
        height: ref.types.uint32,
        pixelformat: ref.types.uint32,
        colorspace: ref.types.uint32,
        plane_fmt: refarray(v4l2_types.v4l2_plane_fix_format),
        num_planes: ref.types.uint8,
        flags: ref.types.uint8,
        enc: refunion({
            ycbcr_enc: ref.types.uint8,
            hsv_enc: ref.types.uint8,
        }),
        quantization: ref.types.uint8,
        xfer_func: ref.types.uint8,
        reserved: refarray(ref.types.uint8,7),
    })

    static v4l2_rect: refstruct = refstruct({
        left: ref.types.uint32,
        top: ref.types.uint,
        width: ref.types.uint32,
        height: ref.types.uint32
    })
    static v4l2_clip: refstruct = refstruct({
        c: v4l2_types.v4l2_rect,
        next: v4l2_types.v4l2_clip
    })

    static v4l2_window: refstruct = refstruct({
        w: v4l2_types.v4l2_rect,
        field: ref.types.uint8,
        chromakey: ref.types.uint32,
        clips: v4l2_types.v4l2_clip,
        clipcount: ref.types.uint32,
        bitmap: ref.types.void,
        global_alpha: ref.types.uint8
    })

    static v4l2_vbi_format: refstruct = refstruct({
        sampling_rate: ref.types.uint32,
        offset: ref.types.uint32,
        samples_per_line: ref.types.uint32,
        sample_format: ref.types.uint32,
        start: ref.types.uint32,
        count: ref.types.uint32,
        flags: ref.types.uint32,
        reserved: ref.types.uint32,
    })

    static v4l2_sliced_vbi_format: refstruct = refstruct({
        service_set: ref.types.uint32,
        service_lines: refarray(refarray(ref.types.uint16,24),2),
        io_size: ref.types.uint32,
        reserved: refarray(ref.types.uint32,2)
    })
    static v4l2_sdr_format: refstruct = refstruct({
        pixelformat: ref.types.uint32,
        buffersize: ref.types.uint32,
        reserved: refarray(ref.types.uint8,24)
    })
    static v4l2_meta_format: refstruct = refstruct({
        dataformat: ref.types.uint32,
        buffersize: ref.types.uint32
    })

    static v4l2_format: refstruct = refstruct({
        type: ref.types.uint32,
        fmt: refunion({
            pix: v4l2_types.v4l2_pix_format,
            pix_mp: v4l2_types.v4l2_pix_format_mplane,
            win: v4l2_types.v4l2_window,
            vbi: v4l2_types.v4l2_vbi_format,
            sliced: v4l2_types.v4l2_sliced_vbi_format,
            sdr: v4l2_types.v4l2_sdr_format,
            meta: v4l2_types.v4l2_meta_format,
            raw_data: refarray(ref.types.uint8,200)
        })

    })
}

class v4l2_const {
    static VIDIOC_QUERYCAP: number = 0x80685600;
    static VIDIOC_ENUM_FMT: number = 0xc0405602;
    static VIDIOC_ENUMINPUT: number = 0xff;
    static VIDIOC_G_FMT: number = 0xff;
    static VIDIOC_S_FMT: number = 0xff;
    static VIDIOC_G_INPUT: number = 0xff;
    static VIDIOC_S_INPUT: number = 0xff;

     

    static V4L2_BUF_TYPE_VIDEO_CAPTURE = 1;
    static V4L2_BUF_TYPE_VIDEO_OUTPUT = 2;
    static V4L2_BUF_TYPE_VIDEO_OVERLAY = 3;
    static V4L2_BUF_TYPE_VBI_CAPTURE = 4;
    static V4L2_BUF_TYPE_VBI_OUTPUT = 5;
    static V4L2_BUF_TYPE_SLICED_VBI_CAPTURE = 6;
    static V4L2_BUF_TYPE_SLICED_VBI_OUTPUT = 7;
    static V4L2_BUF_TYPE_VIDEO_OUTPUT_OVERLAY = 8;
    static V4L2_BUF_TYPE_VIDEO_CAPTURE_MPLANE = 9;
    static V4L2_BUF_TYPE_VIDEO_OUTPUT_MPLANE = 10;
    static V4L2_BUF_TYPE_SDR_CAPTURE = 11;
    static V4L2_BUF_TYPE_SDR_OUTPUT = 12;
    static V4L2_BUF_TYPE_META_CAPTURE = 13;
    static V4L2_BUF_TYPE_META_OUTPUT = 14;
    static V4L2_BUF_TYPE_PRIVATE = 0x80;
}

export default class v4l2_ioctl {
    videoDevice: string = "/dev/video0"
    fileDescriptor: number;
    static v4l2_constants: v4l2_const = new v4l2_const();
    static v4l2_types: v4l2_types = new v4l2_types();

    constructor(videoDevice: string = "/dev/video0") {
        this.videoDevice = videoDevice;
    }

    openDevice = function (cb: (err: NodeJS.ErrnoException, fd: number) => void) {
        fs.open(this.videoDevice, "r+", (err, fd) => {
            if (!err) {
                this.fileDescriptor = fd;
            }
            cb(err, fd);
        });
    };

    getCapabilities = function () {
        if (this.fileDescriptor === undefined) {
            return;
        }
        let stru = new this.v4l2_types.v4l2_capability();
        let handle = ioctl(this.fileDescriptor, this.v4l2_constants.VIDIOC_QUERYCAP, stru.ref());
        let retVal = {
            "card": stru.card.buffer.toString('utf-8'),
            "driver": stru.driver.buffer.toString('utf-8'),
            "bus_info": stru.bus_info.buffer.toString('utf-8'),
            "capabilities": {
                "V4L2_CAP_VIDEO_CAPTURE": false,
                "V4L2_CAP_VIDEO_CAPTURE_MPLANE": false,
                "V4L2_CAP_VIDEO_OUTPUT": false,
                "V4L2_CAP_VIDEO_OUTPUT_MPLANE": false,
                "V4L2_CAP_VIDEO_M2M": false,
                "V4L2_CAP_VIDEO_M2M_MPLANE": false,
                "V4L2_CAP_VIDEO_OVERLAY": false,
                "V4L2_CAP_VBI_CAPTURE": false,
                "V4L2_CAP_VBI_OUTPUT": false,
                "V4L2_CAP_SLICED_VBI_CAPTURE": false,
                "V4L2_CAP_SLICED_VBI_OUTPUT": false,
                "V4L2_CAP_RDS_CAPTURE": false,
                "V4L2_CAP_VIDEO_OUTPUT_OVERLAY": false,
                "V4L2_CAP_HW_FREQ_SEEK": false,
                "V4L2_CAP_RDS_OUTPUT": false,
                "V4L2_CAP_TUNER": false,
                "V4L2_CAP_AUDIO": false,
                "V4L2_CAP_RADIO": false,
                "V4L2_CAP_MODULATOR": false,
                "V4L2_CAP_SDR_CAPTURE": false,
                "V4L2_CAP_EXT_PIX_FORMAT": false,
                "V4L2_CAP_SDR_OUTPUT": false,
                "V4L2_CAP_META_CAPTURE": false,
                "V4L2_CAP_READWRITE": false,
                "V4L2_CAP_ASYNCIO": false,
                "V4L2_CAP_STREAMING": false,
                "V4L2_CAP_META_OUTPUT": false,
                "V4L2_CAP_TOUCH": false,
                "V4L2_CAP_DEVICE_CAPS": false
            },
            "capabilities_hex": "0x" + stru.capabilities.toString(16),
            "version": (stru.version >> 16 & 0xFF) + "." + (stru.version >> 8 & 0xFF) + "." + (stru.version & 0xFF),
            "raw": stru
        }
        return retVal;
    }

    enumVideoCaptureFormats = function () {
        var isDone = false;
        var idx = -1;
        var outStruc = [];
        while (!isDone) {
            try {
                idx++;
                let stru = new this.v4l2_types.v4l2_fmtdesc();
                stru.type = this.v4l2_constants.V4L2_BUF_TYPE_VIDEO_CAPTURE;
                stru.index = idx;
                let handle = ioctl(this.fileDescriptor, this.v4l2_constants.VIDIOC_ENUM_FMT, stru.ref());

                outStruc.push({
                    "index": stru.index,
                    "pixelformat": String.fromCharCode(stru.pixelformat & 0xFF) +
                        String.fromCharCode(stru.pixelformat >> 8 & 0xFF) +
                        String.fromCharCode(stru.pixelformat >> 16 & 0xFF) +
                        String.fromCharCode(stru.pixelformat >> 24 & 0xFF),
                    "type": {
                        "uncompressed": stru.type === 0,
                        "compressed": stru.type === 1,
                        "emulated": stru.type === 2
                    },
                    "flags": stru.flags,
                    "description": stru.description.buffer.toString('utf-8'),
                    "raw": stru
                })
            } catch (e) {
                isDone = true;
            }
        }
        return outStruc;
    }

    setVideoFormat = function(){
        /*let stru = new this.v4l2_types.v4l2_fmtdesc();
        stru.type = this.v4l2_constants.V4L2_BUF_TYPE_VIDEO_CAPTURE;
        stru.index = idx;
        let handle = ioctl(this.fileDescriptor, this.v4l2_constants.VIDIOC_ENUM_FMT, stru.ref());*/

    }

    enumInput = function(){
        var isDone = false;
        var idx = -1;
        var outStruc = [];
        while (!isDone) {
            try {
                idx++;
                let stru = new this.v4l2_types.v4l2_input();
                stru.type = this.v4l2_constants.V4L2_BUF_TYPE_VIDEO_CAPTURE;
                stru.index = idx;
                let handle = ioctl(this.fileDescriptor, this.v4l2_constants.VIDIOC_ENUMINPUT, stru.ref());

                outStruc.push({
                    "index": stru.index,
                    "name": stru.name.buffer.toString('utf-8'),
                    "raw": stru
                })
            } catch (e) {
                isDone = true;
            }
        }
        return outStruc;
    }


    closeDevice = function (cb: (err: NodeJS.ErrnoException) => void) {
        try {
            fs.close(this.fileDescriptor, cb);
        } catch (e) {
            cb(e);
        }
    };


}
