<template>
  <div className="load-container">
      <div className="item-1"></div>
      <div className="item-2"></div>
      <div className="item-3"></div>
      <div className="item-4"></div>
      <div className="item-5"></div>
  </div>
</template>

<script>
export default {
};
</script>
<style lang="scss">
  .load-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    animation-delay: 1s;
  }
  
  .item-1 {
    width: 20px;
    height: 20px;
    background: #f583a1;
    border-radius: 50%;
    background-color: #8ec2f3;
    margin: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @keyframes scale {
    0% {
      transform: scale(1);
    }
    50%,
      75% {
      transform: scale(2.5);
    }
    78%, 100% {
      opacity: 0;
    }
  }
  .item-1:before {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #8ec2f3;
    opacity: 0.7;
    animation: scale 2s infinite cubic-bezier(0, 0, 0.49, 1.02);
    animation-delay: 200ms;
    transition: 0.5s all ease;
    transform: scale(1);
  }
  
  .item-2 {
    width: 20px;
    height: 20px;
    background: #f583a1;
    border-radius: 50%;
    background-color: #76b7f5;
    margin: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @keyframes scale {
    0% {
      transform: scale(1);
    }
    50%,
      75% {
      transform: scale(2.5);
    }
    78%, 100% {
      opacity: 0;
    }
  }
  .item-2:before {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #76b7f5;
    opacity: 0.7;
    animation: scale 2s infinite cubic-bezier(0, 0, 0.49, 1.02);
    animation-delay: 400ms;
    transition: 0.5s all ease;
    transform: scale(1);
  }
  
  .item-3 {
    width: 20px;
    height: 20px;
    background: #f583a1;
    border-radius: 50%;
    background-color: #62adf5;
    margin: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @keyframes scale {
    0% {
      transform: scale(1);
    }
    50%,
      75% {
      transform: scale(2.5);
    }
    78%, 100% {
      opacity: 0;
    }
  }
  .item-3:before {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #62adf5;
    opacity: 0.7;
    animation: scale 2s infinite cubic-bezier(0, 0, 0.49, 1.02);
    animation-delay: 600ms;
    transition: 0.5s all ease;
    transform: scale(1);
  }
  
  .item-4 {
    width: 20px;
    height: 20px;
    background: #f583a1;
    border-radius: 50%;
    background-color: #4ca8ff;
    margin: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @keyframes scale {
    0% {
      transform: scale(1);
    }
    50%,
      75% {
      transform: scale(2.5);
    }
    78%, 100% {
      opacity: 0;
    }
  }
  .item-4:before {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #4ca8ff;
    opacity: 0.7;
    animation: scale 2s infinite cubic-bezier(0, 0, 0.49, 1.02);
    animation-delay: 800ms;
    transition: 0.5s all ease;
    transform: scale(1);
  }
  
  .item-5 {
    width: 20px;
    height: 20px;
    background: #f583a1;
    border-radius: 50%;
    background-color: #3297f7;
    margin: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @keyframes scale {
    0% {
      transform: scale(1);
    }
    50%,
      75% {
      transform: scale(2.5);
    }
    78%, 100% {
      opacity: 0;
    }
  }
  .item-5:before {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #3297f7;
    opacity: 0.7;
    animation: scale 2s infinite cubic-bezier(0, 0, 0.49, 1.02);
    animation-delay: 1000ms;
    transition: 0.5s all ease;
    transform: scale(1);
  }
</style>
