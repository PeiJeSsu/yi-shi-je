export const getWeekRange = (currentDate) => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4);
    endDate.setHours(23, 59, 59, 999);

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    return { start: startDate, end: endDate };
};

export const getWeekDates = (currentDate) => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
    return Array.from({ length: 5 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        return date;
    });
};

export const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // console.log("Format Date:", `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
