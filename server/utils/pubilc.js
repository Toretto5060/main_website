function age(date,date2) {
    const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
    const oneMonth = 30.4375 * oneDay; // 一个月的平均毫秒数（按30.4375天计算）
    const oneYear = 365.25 * oneDay; // 一年的平均毫秒数（按365.25天计算）

    // 计算日期差值
    const diff = Math.abs(new Date(date).getTime() - new Date(date2).getTime());

    // 计算天数、月数和年数
    const days = Math.floor(diff / oneDay);
    const months = Math.floor(diff / oneMonth);
    const years = Math.floor(diff / oneYear);
    let dateType = years ? years + '岁' : months ? months + '个月' : days ? '未满月' : '出生当天'
    // return { days, months, years };
    return dateType;
}

/**
 * 文件遍历方法
 * @param array 需要遍历的数组
 * 对数组中的对象进行排序，根据 dateType 和 child 进行从小到大排序
 */

function sortObjectsByDate(array,key) {
    return array.sort((a, b) => {
        // 将 dateType 是“未满月”的视为最小值，其余按照字符串从小到大排序
        const aIsNotFullMonth = a[key] === '未满月';
        const bIsNotFullMonth = b[key] === '未满月';
        if (aIsNotFullMonth && !bIsNotFullMonth) {
            return -1;
        }
        if (!aIsNotFullMonth && bIsNotFullMonth) {
            return 1;
        }
        // 按照 dateType 进行排序，如果相同，则按照 child 的第一个元素的 date 进行排序
        const compareResult = a[key].localeCompare(b[key]);
        if (compareResult === 0 && a.child.length > 0 && b.child.length > 0) {
            const dateA = new Date(a.child[0].date);
            const dateB = new Date(b.child[0].date);
            return dateA.getTime() - dateB.getTime();
        }
        return compareResult;
    });
}

/**
 * 文件遍历方法
 * @param array 需要遍历的数组
 * @param keyName 根据某个字段  相同的数组生成新的obj（树形结构）
 */
// 遍历数组，以指定的动态字段相同的生成新的对象
function groupByDateType(array, keyName) {
    return array.reduce((result, item) => {
        const keyValue = item[keyName];

        // 如果 result 中已有该 keyValue 的数据，则将当前数据添加到该数据的 child 数组中
        if (result[keyValue]) {
            result[keyValue].child.push(item);
        }
        // 否则，创建一个新的包含当前数据的对象，并添加到 result 中
        else {
            result[keyValue] = { [keyName]: keyValue, child: [item] };
        }
        return result;
    }, {});
}

module.exports = { age, groupByDateType, sortObjectsByDate }