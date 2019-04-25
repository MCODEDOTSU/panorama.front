/**
 * Вычитание массивов: (arrayA - arrayB)
 * @param {[]} arrayA
 * @param {[]} arrayB
 * @param key
 * @returns {any}
 */
export const arraySubtraction = (arrayA: any[], arrayB: any[], key?: any) => {
    key = key ? key : 'id';
    return arrayA.filter( (a: any) => {
        const find = arrayB.filter( (b: any) => {
            return (a[key] === b[key]);
        });
        return (find.length === 0);
    });
};

/**
 * Пересечение массивов
 * @param {[]} arrayA
 * @param {[]} arrayB
 * @param key
 * @returns {any}
 */
export const arrayIntersection = (arrayA: any[], arrayB: any[], key?: any) => {
    key = key ? key : 'id';
    return arrayA.filter( (a: any) => {
        const find = arrayB.filter( (b: any) => {
            return (a[key] === b[key]);
        });
        return (find.length !== 0);
    });
};

/**
 * Поиск элемента массива (первого)
 * @param {[]} array
 * @param value
 * @param key
 * @returns {boolean}
 */
export const arrayFindFirst = (array: any[], value: any, key?: any): any => {
    key = key ? key : 'id';
    const filtered = array.filter( (a: any) => {
        return (a[key] === value);
    });
    return filtered.length !== 0 ? filtered[0] : false;
};

/**
 * Поиск индекса элемента массива (первого)
 * @param {[]} array
 * @param value
 * @param key
 * @returns {boolean}
 */
export const arrayIndexOf = (array: any[], value: any, key?: any): any => {
    key = key ? key : 'id';
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return i;
        }
    }
    return -1;
};
