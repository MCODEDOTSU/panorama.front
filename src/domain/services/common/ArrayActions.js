/**
 * Вычитание массивов: (arrayA - arrayB)
 * @param {[]} arrayA
 * @param {[]} arrayB
 * @param key
 * @returns {any}
 */
export const arraySubtraction = (arrayA, arrayB, key) => {
    key = key ? key : 'id';
    return arrayA.filter((a) => {
        const find = arrayB.filter((b) => {
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
export const arrayIntersection = (arrayA, arrayB, key) => {
    key = key ? key : 'id';
    return arrayA.filter((a) => {
        const find = arrayB.filter((b) => {
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
export const arrayFindFirst = (array, value, key) => {
    key = key ? key : 'id';
    const filtered = array.filter((a) => {
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
export const arrayIndexOf = (array, value, key) => {
    key = key ? key : 'id';
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return i;
        }
    }
    return -1;
};
//# sourceMappingURL=ArrayActions.js.map