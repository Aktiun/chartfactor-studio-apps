window.timeFilter = window.cf.Filter().fromJSON({
    granularity: 'MONTH',
    label: 'Date',
    oneTimeUnit: true,
    operation: 'BETWEEN',
    path: '@timestamp',
    sender: { type: 'Time Slider', id: 'time-range' },
    value: ["2023-04-01 00:00:00", "2023-04-30 00:00:00"]
});