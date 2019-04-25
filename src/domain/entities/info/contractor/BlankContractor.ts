import IContractor from '@/domain/entities/interfaces/IContractor';

export const blankContractor: IContractor = {
    id: 0,
    name: '',
    full_name: '',
    inn: '',
    kpp: '',
    address: {
        id: 0,
        city: '',
        build: '',
        street: '',
        region: '',
    },
    childElsVisibility: false,
    edited: false,
};
