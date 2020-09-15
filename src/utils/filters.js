


// function digitLength(data, length) {
//     return Util.sprintf('%0' + length + 'd', data);
// }
//
// function currencyFormat(money, type) {
//     money = parseInt(money);
//     if (money % 100 === 0 && !type) {
//         return Util.sprintf('%.2f', money / 100);
//     }
//     return Util.sprintf('%.2f', parseInt(money) / 100);
// }

// function imgUrl(img) {
//     if (!img) {
//         return img;
//     }
//     if (img.indexOf("http") >= 0) {
//         return img;
//     }
//     return Const.NET.FILE_STATIC_URL + img;
// }


function priceToPlace(pri) {
    return parseInt(pri)/100
}

function statusFilter(val){
    let arry = {
        0:'是',
        5:'否',
        10:'否'
    }
    return arry[val]
}

function marryFilter(val) {
    let arr = {
        10:'未婚',
        20:'已婚',
        21:'初婚',
        22:'再婚',
        23:'复婚',
        30:'丧偶',
        40:'离婚',
        90:'未说明'
    }
    return arr[val]
}

const _filters = {
    priceToPlace:priceToPlace,
    statusFilter:statusFilter,
    marryFilter:marryFilter
}

export default (Vue) => {
    Object.keys(_filters).forEach(key => {
        Vue.filter(key, _filters[key])
    })
}
