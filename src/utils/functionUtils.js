import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");
dayjs.extend(localizedFormat);

function formatNotificationTime(notificationTime) {
    const now = dayjs();
    const time = dayjs(notificationTime);

    // Nếu thời gian nhỏ hơn 1 ngày
    if (now.diff(time, 'day') < 1) {
        return time.fromNow(); // Trả về '1 phút trước', '1 giờ trước', ...
    }

    // Nếu thời gian lâu hơn 1 ngày
    return time.format('DD-MM-YYYY HH:mm');
}

export {
    formatNotificationTime
}