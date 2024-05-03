export const generateUniqString = (): string => {
  const currentDate = new Date();

  const { year, month, day, hours, minutes, seconds, milliseconds } = {
    year: currentDate.getFullYear(),
    month: (currentDate.getMonth() + 1).toString().padStart(2, "0"),
    day: currentDate.getDate().toString().padStart(2, "0"),
    hours: currentDate.getHours().toString().padStart(2, "0"),
    minutes: currentDate.getMinutes().toString().padStart(2, "0"),
    seconds: currentDate.getSeconds().toString().padStart(2, "0"),
    milliseconds: currentDate.getMilliseconds().toString().padStart(3, "0"),
  };

  return `${day}${month}${year}${hours}${minutes}${seconds}${milliseconds}`;
};
