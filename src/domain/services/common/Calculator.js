export const lengthConverter = (lenght) => {
    if (lenght >= 1000) {
        lenght /= 1000;
        return `${lenght.toFixed(2)} км`;
    }
    else {
        return `${lenght.toFixed(2)} м`;
    }
};
export const perimeterConverter = (perimeter) => {
    return perimeter;
    if (perimeter >= 1000) {
        perimeter /= 1000;
        return `${perimeter.toFixed(2)} км`;
    }
    else {
        perimeter /= 1;
        return `${perimeter.toFixed(2)} м`;
    }
};
export const areaConverter = (area) => {
    if (area >= 1000000) {
        const a = (area / 1000000).toFixed(2);
        const b = (area / 1000).toFixed(2);
        return `${a} км<sup>2</sup> (${b} Га)`;
    }
    else {
        const a = (area / 1).toFixed(2);
        const b = (area / 1000).toFixed(2);
        return `${a} м<sup>2</sup> (${b} Га)`;
    }
};
//# sourceMappingURL=Calculator.js.map