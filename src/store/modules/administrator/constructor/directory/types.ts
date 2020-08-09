import IDirectory from '@/domain/interfaces/IDirectory';

export default interface DirectoryState {
    directories: IDirectory[];
    directory: IDirectory;
    entities: any[];
}
