import IHistory from '@/domain/interfaces/IHistory';

export default interface HistoryState {
    history: IHistory;
    histories: IHistory[];
}
