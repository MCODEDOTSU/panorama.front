export default interface IStyle {
    id: number;
    showTitle: boolean;
    shape?: {
        points: number;
        radius: number;
        fill: {
            color: string;
            opacity: number;
        };
        stroke: {
            color: string;
            width: number;
            opacity: number;
        };
        rotation: number;
    };
    icon?: {
        src: string;
        anchor: number[];
        opacity: number;
        scale: number;
        rotation: number;
    };
    pointType?: string;
    stroke?: {
        color: string;
        width: number;
        opacity: number;
    };
    fill?: {
        color: string;
        opacity: number;
    };
    font: {
        font: string;
        textBaseline: string;
        fill: {
            color: string;
        };
        stroke?: {
            color: string;
            width: number;
        };
        offsetY?: number;
        placement?: string;
    };
    list?: {
        hasList: boolean;
        visibility: boolean;
        color: string;
        opacity: number;
    };
}
