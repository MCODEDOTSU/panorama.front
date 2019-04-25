export const makePages = (currentPage, lastPage) => {
    const arrayPages = [];
    const firstPage = 1;
    for (let i = firstPage; i <= lastPage; i++) {
        if (i === firstPage || i === lastPage
            || (i <= currentPage + 2 && i >= currentPage - 2)) {
            arrayPages.push(i);
        }
        else if (i === firstPage + 1 || i === lastPage - 1) {
            arrayPages.push(-1);
        }
    }
    return arrayPages;
};
//# sourceMappingURL=Pagination.js.map