import Vue from 'vue';
import Boebtn from '@/components/boeBtn'
import BoeLine from '@/components/boeLine'
import BoeBorder from '@/components/boeBorder'
import BoePoint from '@/components/boePoint'
const components=[
  Boebtn,
  BoeLine,
  BoeBorder,
  BoePoint
]
const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};
export default install;
