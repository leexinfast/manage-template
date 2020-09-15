//动态添加对象
export function addObj(data, key, val) {
    data[key] = val;
    return data;
};

//排序
export function sortObj(obj) {
    let x = objKeySort(obj)
    x = objFor(x)
    return x
};

//字典排序对象
function objKeySort(obj) {
    let newkey = Object.keys(obj).sort();
    let newObj = {};
    for (let i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]];
    }
    return newObj;
};

//遍历对象
function objFor(arr) {
    let elp = '';
    let i = 0;
    let j = '48da9f3b5aa949f889cf8d8d6cb67003'; //双方约定的签名密钥
    for (let index in arr) {
        if (i != 0)
            elp += "&";
        elp += index + "=" + arr[index];
        i++;
    }
    elp += j
    return elp
};
