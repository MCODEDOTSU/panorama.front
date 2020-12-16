/**
 * Сравнить два объекта
 * @param objectA
 * @param objectB
 */
export const deepEqual = (objectA: Object, objectB: Object) => {
    return JSON.stringify(objectA) === JSON.stringify(objectB);
};
