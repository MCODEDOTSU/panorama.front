import IContractor from '@/domain/interfaces/IContractor';

export default interface IContractorTos {
    id: number;
    contractor_id: number;
    contractor: IContractor;
}
