import "locale";

d3.locale.mk_MK = d3.locale({
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", " ден."],
  dateTime: "%A, %e %B %Y г. %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"],
  shortDays: ["нед", "пон", "вто", "сре", "чет", "пет", "саб"],
  months: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"],
  shortMonths: ["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"]
});
