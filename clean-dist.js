import fs from 'fs';
import path from 'path';

function deleteTestTypeFiles(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            deleteTestTypeFiles(filePath);
        } else if (filePath.endsWith('.test.d.ts')) {
            fs.unlinkSync(filePath);
        }
    }
}

deleteTestTypeFiles('./dist');