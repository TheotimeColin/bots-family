const getId = function () {
    var d = new Date().getTime();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0) {
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        }

        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    })
}

const searchOne = function (where, query, key) {
    let results = where.filter(item => {
        let search = Object.keys(query)[0]
        let value = query[search]

        return item[search] == value
    })

    if (results[0]) {
        if (key) {
            return results[0][key]
        } else {
            return results[0]
        }
    } else {
        return false
    }
}

module.exports = {
    getId, searchOne
}