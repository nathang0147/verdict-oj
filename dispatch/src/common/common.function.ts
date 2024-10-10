import * as path from "node:path";
import * as fs from "fs";

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

export function checkExistFolder(name: string){
    const checkPath = path.join(__dirname, `../../${name}`);

    //check if folder exist
    //if not exist, create folder using fs.mkdir
    if (!fs.existsSync(checkPath)) {
        try {
            fs.mkdirSync(checkPath);
            console.log(`Folder created: ${checkPath}`);
        } catch (err) {
            console.error(`Error creating folder: ${checkPath}`, err);
        }
    }
}
