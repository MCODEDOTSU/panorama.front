export default interface IAddress {
    id: number;
    build: string;
    city: string;
    region: string;
    street: string;
    index?: string | undefined;
}
