import IContractor from '@/domain/interfaces/IContractor';
import IFiasAddress from "@/domain/interfaces/IFiasAddress";

export default interface IContractorTos {
    id: number;
    contractor_id: number;
    contractor?: IContractor;
    full_contractor?: IContractor;
    addresses?: IFiasAddress[];
}
