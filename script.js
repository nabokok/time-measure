let daysType = document.querySelector('.days-type.focused').innerHTML;
let measureType = document.querySelector('.measure.focused').innerHTML;
let presetType = document.querySelector('.preset.focused')?.innerHTML;
let result = document.querySelector('.input-result');
const dateInputs = document.querySelectorAll('[type=date]')
const startDate = document.getElementById('start');
const endDate = document.getElementById('end');
const filterDaysBtns = document.querySelectorAll('.days-type');
const filterMeasuresBtns = document.querySelectorAll('.measure');
const presetBtns = document.querySelectorAll('.preset');
const countBtn = document.querySelector('.btn');

document.addEventListener('DOMContentLoaded', () => {
    startDate.value = new Date().toISOString().split('T')[0];
    endDate.value = new Date().toISOString().split('T')[0];
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

dateInputs.forEach(input => {
    input.addEventListener('change', () => {
        classRemover(presetBtns, 'focused');
    });
});

countBtn.addEventListener('click', count);

function clickBtnHandler(btn, list = [], type) {
    btn.addEventListener('click', () => {
        classRemover(list, 'focused');
        btn.classList.add('focused');
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

function classRemover(list, className) {
    list.forEach(btn => {
        btn.classList.remove(className);
    });
}

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

function createDateList(startDateValue, endDateValue) {
    let currentDate = startDateValue;
    const dateList = [];
    const day = 60 * 60 * 24 * 1000;
    while (currentDate.getTime() < endDateValue.getTime()) {
        dateList.push(currentDate);
        currentDate = new Date(currentDate.getTime() + day);
    };
    return dateList;
}

function setPreset() {
    const day = 60 * 60 * 24 * 1000;
    const startDateValue = new Date(startDate.value);
    const week = new Date(startDateValue.getTime() + day * 7)
    const month = new Date(startDateValue.getTime() + day * 30)

    switch (presetType) {
        case 'Week':
            endDate.value = week.toISOString().split('T')[0];
            break;
        case 'Month':
            endDate.value = month.toISOString().split('T')[0];
            break;
    }
}

function count() {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);
    const countDay = filterType(startDateValue, endDateValue, daysType);
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

function storeInLocalStorage(startDateValue, endDateValue, result) {
    const formattedStartDate = startDateValue.toISOString().split('T')[0];
    const formattedEndDate = endDateValue.toISOString().split('T')[0];
    const results = JSON.parse(localStorage.getItem('results')) || [];
    if (results.length >= 10) {
        results.shift();
    }
    results.push({ range: `${formattedStartDate} - ${formattedEndDate}`, result })
    localStorage.setItem('results', JSON.stringify(results));
}

function storeInHistory() {
    const results = JSON.parse(localStorage.getItem('results'));
    const table = document.querySelector('.history-data');
    if (!results) {
        table.style.display = 'none';
        return;
    } 
    const tableBody = table.querySelector('tbody')
    table.style.display = 'table';
    tableBody.innerHTML = null;
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