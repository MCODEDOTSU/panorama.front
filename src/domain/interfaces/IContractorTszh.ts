import IContractor from '@/domain/interfaces/IContractor';

export default interface IContractorTszh {
    id: number;
    contractor_id: number;
    contractor?: IContractor;
    full_contractor?: IContractor;
}
