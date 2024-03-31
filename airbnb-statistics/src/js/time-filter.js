function getPreviousMonthRange() {
    const now = new Date();
    const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // -1 means previous month, use -2 to get 2 months ago and so on
    const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const formatNumber = num => ('0' + num).slice(-2);
    const formatDateString = date =>
        `${date.getFullYear()}-${formatNumber(date.getMonth() + 1)}-${formatNumber(date.getDate())} 00:00:00`;

    return {
        firstDay: formatDateString(firstDayPrevMonth),
        lastDay: formatDateString(lastDayPrevMonth)
    };
}

function getFirstDayLtmLastDayCurrentMonth() {
    const now = new Date();
    const firstDayPrevMonth = new Date(now.getFullYear() - 1, now.getMonth() - 11, 1);
    const lastDayCurrMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const formatNumber = num => ('0' + num).slice(-2);
    const formatDateString = date =>
        `${date.getFullYear()}-${formatNumber(date.getMonth() + 1)}-${formatNumber(date.getDate())} 00:00:00`;
    return {
        firstDay: formatDateString(firstDayPrevMonth),
        lastDay: formatDateString(lastDayCurrMonth)
    };
}

const { firstDayLtm, lastDayCurrent } = getFirstDayLtmLastDayCurrentMonth();

const { firstDay, lastDay } = getPreviousMonthRange();
// Use this filter when you have the previous month data
//   window.timeFilter = window.cf.Filter().fromJSON({
//     granularity: 'MONTH',
//     label: 'Date',
//     oneTimeUnit: true,
//     operation: 'BETWEEN',
//     path: '@timestamp',
//     sender: { type: 'Time Slider', id: 'time-range' },
//     value: [firstDay, lastDay]
//   });

window.timeFilter = window.cf.Filter().fromJSON({
    granularity: 'MONTH',
    label: 'Month date yyyymm',
    oneTimeUnit: true,
    operation: 'BETWEEN',
    path: '@timestamp',
    sender: { type: 'Time Slider', id: 'time-range' },
    value: ["2024-01-01 00:00:00", "2024-01-31 00:00:00"]
});

window.ltmFilter = window.cf.Filter().fromJSON({
    granularity: 'MONTH',
    label: 'Month date yyyymm',
    oneTimeUnit: true,
    operation: 'BETWEEN',
    path: '@timestamp',
    sender: { type: 'Time Slider', id: 'time-range' },
    value: [firstDayLtm, lastDayCurrent]
});