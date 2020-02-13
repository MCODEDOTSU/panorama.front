export default interface FileUploaderState {
    path: IFile;
    file: any;
}

export interface IFile {
    path: string;
    name: string;
    ind?: any;
}
