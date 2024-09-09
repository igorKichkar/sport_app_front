const week = {
    0: "Воскресенье",
    1: "Понедельник",
    2: "Вторник",
    3: "Среда",
    4: "Четверг",
    5: "Пятница",
    6: "Суббота"
};

export function date_convertor(date) {
    date = new Date(date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();
    const day_week = week[date.getDay()];
    return `${day}.${month}.${year} ${day_week}`;
}

export function sum(appraches) {
    let counter = 0;
    for (const a in appraches) {
        if (Number.isInteger(+appraches[a].ammount)) counter += +appraches[a].ammount;
    }
    return counter;
}

export function truncateString(str, length = 20) {
    if (typeof str !== 'string') {
        return str;
    }

    if (str.length <= length) {
        return str;
    } else {
        return str.substring(0, length) + '...';
    }
}