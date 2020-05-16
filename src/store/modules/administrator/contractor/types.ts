import IContractor from '@/domain/interfaces/IContractor';

export default interface ContractorState {
    contractor: IContractor;
    contractors: IContractor[];
}
