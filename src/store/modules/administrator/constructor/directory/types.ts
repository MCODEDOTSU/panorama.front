import IDirectory from '@/domain/interfaces/IDirectory';
import IEntity from '@/domain/interfaces/IEntity';

export default interface DirectoryState {
    directories: IDirectory[];
    directory: IDirectory;
    entities: IEntity[];
}
