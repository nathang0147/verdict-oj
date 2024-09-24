export function isNumber(value: any): value is number {
    return !isNaN(Number(value));
}

export function calculatePagination(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (currentPage - 1) * pageSize;

    return {
        totalItems,
        currentPage,
        pageSize,
        totalPages,
        offset,
    };
}