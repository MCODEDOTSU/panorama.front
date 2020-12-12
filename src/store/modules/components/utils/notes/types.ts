import INote from '@/domain/interfaces/INote';

export default interface NotesState {
    note: INote;
    notes: INote[];
}
