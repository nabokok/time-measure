let daysType = document.querySelector('.days-type.focused').innerHTML;
let measureType = document.querySelector('.measure.focused').innerHTML;
let presetType = document.querySelector('.preset.focused')?.innerHTML;
let result = document.querySelector('.input-result');
let isValidated = true;
const dateInputs = document.querySelectorAll('[type=date]')
const startDate = document.getElementById('start');
const endDate = document.getElementById('end');
const filterDaysBtns = document.querySelectorAll('.days-type');
const filterMeasuresBtns = document.querySelectorAll('.measure');
const presetBtns = document.querySelectorAll('.preset');
const countBtn = document.querySelector('.btn');
const error = document.querySelector('.error');

//виклик функції при завантаженні DOM, яка відобразить таблицю history
document.addEventListener('DOMContentLoaded', () => {
    storeInHistory();
});

filterDaysBtns.forEach(btn => {
    clickBtnHandler(btn, filterDaysBtns, 'daysType');
});

filterMeasuresBtns.forEach(btn => {
    clickBtnHandler(btn, filterMeasuresBtns, 'measureType');
});

presetBtns.forEach(btn => {
    clickBtnHandler(btn, presetBtns, 'presetType');
});

//при зміні значення інпута очищаємо помилку, видаляємо стилі для кнопок пресетів
dateInputs.forEach(input => {
    input.addEventListener('change', () => {
        error.innerHTML = '';
        classRemover(presetBtns, 'focused');
    });
});

//при зміні значення інпута startDate встановлюємо атрибут min для інпута endDate
startDate.addEventListener('change', () => {
    endDate.setAttribute('min', new Date(startDate.value).toISOString().split('T')[0]);
    document.getElementById("end").disabled = false;
});

//при зміні значення інпута endDate встановлюємо атрибут max для інпута startDate
endDate.addEventListener('change', () => {
    startDate.setAttribute('max', new Date(endDate.value).toISOString().split('T')[0]);
});

countBtn.addEventListener('click', count);

function clickBtnHandler(btn, list = [], type) {
    btn.addEventListener('click', () => {
        //викликаємо ф-ю для масиву кнопок
        classRemover(list, 'focused'); 
        //додаємо клас для кнопки
        btn.classList.add('focused'); 
        //перезаписуємо змінні в залежності від отриманого типу
        switch (type) {
            case 'daysType':
                daysType = document.querySelector('.days-type.focused').innerHTML;
                break;
            case 'measureType':
                measureType = document.querySelector('.measure.focused').innerHTML;
                break;
            case 'presetType':
                presetType = document.querySelector('.preset.focused').innerHTML;
                setPreset();
                break;
        }
    });
}

//функція, яка видаляє клас для кожної кнопки з масиву
function classRemover(list, className) {
    list.forEach(btn => {
        btn.classList.remove(className);
    });
}

//функція для отримання кількості днів з масиву дат в залежнності від обраної опції
function filterType(startDateValue, endDateValue, type) {
    let countDay = 0;
    const dateList = createDateList(startDateValue, endDateValue);
    switch (type) {
        case 'Weekdays':
            dateList.forEach(date => {
                const currentDay = date.getDay();
                // 0 - Sunday, 6 - Saturday
                if (currentDay !== 0 && currentDay !== 6) {
                    countDay++;
                } return countDay;
            });
            break;
        case 'Weekend':
            dateList.forEach(date => {
                const currentDay = date.getDay();
                // 0 - Sunday, 6 - Saturday
                if (currentDay === 0 || currentDay === 6) {
                    countDay++;
                } return countDay;
            });
            break;
        default:
            countDay = dateList.length;
    };

    return countDay;
}

//функція для отримання масиву дат в заданому проміжку
function createDateList(startDateValue, endDateValue) {
    let currentDate = startDateValue;
    const dateList = [];
    //тривалість дня в мілісекундах
    const day = 60 * 60 * 24 * 1000;
    while (currentDate.getTime() < endDateValue.getTime()) {
        dateList.push(currentDate);
        currentDate = new Date(currentDate.getTime() + day);
    };
    return dateList;
}

//функція, яка встановлює значення startDate і endDate інпутів в залежності від обраного пресету
function setPreset() {
    const day = 60 * 60 * 24 * 1000;
    //якщо інпут startDate має значення, то отримуємо його, якщо ні використовуємо поточну дату
    const startDateValue = startDate.value ? new Date(startDate.value) : new Date();
    //getTime - повертає час у мілісекундах, new Date() - повертає об’єкт дати
    const week = new Date(startDateValue.getTime() + day * 7);
    const month = new Date(startDateValue.getTime() + day * 30);
    error.innerHTML = '';
    switch (presetType) {
        case 'Week':
            //toISOString().split('T')[0] - отримуємо рядок у форматі ISO, сплітимо до букви Т, з масиву отримуємо 1 елемент
            startDate.value = startDateValue.toISOString().split('T')[0];
            endDate.value = week.toISOString().split('T')[0];
            break;
        case 'Month':
            startDate.value = startDateValue.toISOString().split('T')[0];
            endDate.value = month.toISOString().split('T')[0];
            break;
    }
}

//функція для підрахунку 
function count() {
    dateValidation();
    if (!isValidated) {
        return;
    }
    //отримання значень інпутів
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);
    //отримання кількості днів
    const countDay = filterType(startDateValue, endDateValue, daysType);
    //калькуляція результату в залежності від обраної опції
    switch (measureType) {
        case 'Days':
            result.value = `${countDay} d`;
            break;
        case 'Hours':
            result.value = `${countDay * 24} h`;
            break;
        case 'Minutes':
            result.value = `${countDay * 24 * 60} min`;
            break;
        case 'Seconds':
            result.value = `${countDay * 24 * 3600} sec`;
            break;
    }
    storeInLocalStorage(startDateValue, endDateValue, result.value);
    storeInHistory();
}

//функція для перевірки startDate і endDate інпутів після натискання на кнопку Count
function dateValidation() {
    if (!startDate.value || !endDate.value) {
        error.innerHTML = `Dude, I don't see a date range!`;
        isValidated = false;
        return;
    }
    isValidated = true;
}

//функція для запису в локалсторадж
function storeInLocalStorage(startDateValue, endDateValue, result) {
    const formattedStartDate = startDateValue.toISOString().split('T')[0];
    const formattedEndDate = endDateValue.toISOString().split('T')[0];
    const results = JSON.parse(localStorage.getItem('results')) || [];
    //якщо довжина масиву об’єктів досягає 10, перший елемент масиву видаляється
    if (results.length >= 10) {
        results.shift();
    }
    //пушимо в масив об’єкт з ключами range і result
    results.push({ range: `${formattedStartDate} - ${formattedEndDate}`, result })
    localStorage.setItem('results', JSON.stringify(results));
}

//функція для відображення результатів, збережених в локалстораджі в таблиці history
function storeInHistory() {
    //отримуємо масив об’єктів з локалсторадж
    const results = JSON.parse(localStorage.getItem('results'));
    const table = document.querySelector('.history-data');
    //якщо в локалстораджі не існує записів, таблиця не відображається
    if (!results) {
        table.style.display = 'none';
        return;
    }
    const tableBody = table.querySelector('tbody')
    table.style.display = 'table';
    tableBody.innerHTML = null;
    //промальовуємо таблицю, додаємо класи для стилізації, присвоюємо значення ключів з масиву локалстораджа рядкам таблиці
    results.forEach(resultItem => {
        const tableRow = document.createElement('tr');
        const tableCol1 = document.createElement('td');
        const tableCol2 = document.createElement('td');
        tableCol1.className = 'history-data-row history-data-date';
        tableCol2.className = 'history-data-row history-data-duration';
        tableRow.appendChild(tableCol1);
        tableRow.appendChild(tableCol2);
        tableBody.appendChild(tableRow);
        tableCol1.innerHTML = resultItem.range;
        tableCol2.innerHTML = resultItem.result;
    })
}