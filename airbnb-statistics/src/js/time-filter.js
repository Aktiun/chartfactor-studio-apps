window.timeFilter = window.cf.Filter().fromJSON({
    granularity: 'MONTH',
    label: 'Month date yyyymm',
    oneTimeUnit: true,
    operation: 'BETWEEN',
    path: '@timestamp',
    sender: { type: 'Time Slider', id: 'time-range' },
    value: ["2024-01-01 00:00:00", "2024-01-31 23:59:59.999"]
});

window.getFirstLastDayMonth = function getFirstLastDayMonth(datestring) {
    const baseDate = new Date(datestring + 'T00:00:00Z');
    const year = baseDate.getUTCFullYear();
    const month = baseDate.getUTCMonth();

    const firstDay = new Date(year, month, 1);
    const firstDayFormat = `${firstDay.getUTCFullYear()}-${String(firstDay.getUTCMonth() + 1).padStart(2, '0')}-${String(firstDay.getUTCDate()).padStart(2, '0')}`;

    const lastDay = new Date(year, month + 1, 0);
    const lastDayFormat = `${lastDay.getUTCFullYear()}-${String(lastDay.getUTCMonth() + 1).padStart(2, '0')}-${String(lastDay.getUTCDate()).padStart(2, '0')}`;
    return {firstDay: firstDayFormat, lastDay: lastDayFormat};
}