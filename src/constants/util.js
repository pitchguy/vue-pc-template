/*
 * @作者: weisi
 * @修改时间: 2019-0920
 * @参数: 
 * @描述: lodash方法本地复写，方便后期项目使用
 */

export default{
    forEach(array, callback){
        const { length } = array;
        for(let index = 0;index < length; index += 1){
            callback(array[index], index, array)
        }
    },
    
}