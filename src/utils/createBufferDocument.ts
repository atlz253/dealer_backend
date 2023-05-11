import xlsx from "xlsx";

function createBufferDocument<T>(data: T[][]): any {
    const workBook = xlsx.utils.book_new();

    var ws = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workBook, ws);

    // write options
    const wopts: xlsx.WritingOptions = { 
        bookType: "xlsx", 
        bookSST: false, 
        type: "base64" 
    };
    
    return xlsx.write(workBook, wopts);
}

export default createBufferDocument;