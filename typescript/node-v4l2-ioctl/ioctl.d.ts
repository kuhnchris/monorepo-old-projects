/* ioctl shim */
declare module "ioctl" {
    const ioctl: (fd: number, command: number, parameter: any) => void;
}











