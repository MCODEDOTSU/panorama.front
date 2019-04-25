import IInfoItem from '@/domain/entities/interfaces/IInfoItem';

export const blankInfoElement: any = (geomType: string) => {
    return {
        id: 0,
        title: '',
        description: '',
        geotype: geomType,
        address: {
            id: 0,
            city: '',
            build: '',
            street: '',
            region: '',
        },
        layer_composition_id: 2,
    };
};
