export default interface FileUploaderState {
    path: File;
    file: any;
}

interface File {
    path: string;
    name: string;
}
