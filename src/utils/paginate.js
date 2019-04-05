import _ from 'lodash';

export function paginate(events, pageNumber, pageSize) {
    const startIndex = (pageNumber -1 ) * pageSize;
    return _(events).slice(startIndex).take(pageSize).value();
}