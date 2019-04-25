import IContractor from '@/domain/entities/interfaces/IContractor';

export default interface ContractorState {
    contractor: IContractor;
    contractors: IContractor[];
}
