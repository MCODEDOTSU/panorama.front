import IPerson from '@/domain/interfaces/IPerson';

export default interface PersonState {
    person: IPerson;
    persons: IPerson[];
}
