var Util = {};

Util.getDayOfYear = function (entryDay) {
    var date = new Date(entryDay.year, entryDay.month, entryDay.dayOfMonth);
    var firstDayOfYear = new Date(entryDay.year, 0, 0);
    var diff = date - firstDayOfYear;
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear;
}

// fix the modulo for negative numbers to wrap around
Number.prototype.mod = function(n) { return ((this%n)+n)%n; }

module.exports = Util;