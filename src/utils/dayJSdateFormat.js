import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.locale("id");

const dateFormat = (date, format = "DD MMM YYYY") => {
  const timezone = dayjs.tz.guess();
  const convertedDate = dayjs.utc(date).tz(timezone);
  const currentDate = convertedDate.format(format);

  return currentDate;
};

export default dateFormat;
