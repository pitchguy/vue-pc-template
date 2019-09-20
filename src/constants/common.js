// import { isEmpty, isUndefined } from 'lodash';
import localDb from '@/utils/localDb';

export default{
  //千位分割符号
  numFormat(num){
    if(isUndefined(num)){
      return ''
    }else{
      var res=num.toString().replace(/\d+/, function(n){ // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
              return $1+",";
            });
      })
    }
    return res;
  },
  //判断当前页面没有数据时跳转到前一页
  checkJumpLastPage(pageTotal,pageSize,currentPage){
    if((pageTotal%pageSize - 1)==0){
        //当前页面没数据
        if(currentPage==1){
          //最后一页则返回1
          return 1
        }else{
          //不是最后一页则当前页码减1
          return currentPage - 1
        }
    }else{
      //当前页面还有数据
      return currentPage
    }
  }
}