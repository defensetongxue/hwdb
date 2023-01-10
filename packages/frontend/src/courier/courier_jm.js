const url = document.location.search.substring(1)
const args = new URLSearchParams(url)
const global_token = args.get('token')
const role = args.get('role')
const HOST = "http://guoyi.work"
const courier= {
   "cour_name": "姓名",
   "cour_living": "家庭住址",
   "cour_onboarding_time": "入职日期",
}
axios.interceptors.request.use((config) => {
  const token = global_token;
  if (token !== null) {
    config.headers ?? (config.headers = {});
    config.headers.Authorization = `bearer ${token}`;
  }
  return config;
});


async function getUserInfo() {
  const { data } = await axios.get(`${HOST}/user/info`);
  return data;
}

async function getOrders() {
  const { data } = await axios.get(`${HOST}/orders`);
  return data
}

async function getFreeOrders() {
  const { data } = await axios.get(`${HOST}/orders/free`);
  return data
}

window.showOrder = async function (order_id) {
  const { data } = await axios.get(
    `${HOST}/order/${order_id}/dishes`
  );
  const detailedDishes = data;
  var detailContent = `菜品详情
  `
  for (const dish of detailedDishes) {
    detailContent += `${dish.dish_name} ${dish.dish_value} ${dish.contain_num}\n`

  }
  alert(detailContent)
}




window.changePhone=async function(){
  const newPhone=$("#CAna").val()
  const password=$("#CPp").val()
    await axios.put(`${HOST}/user/phone`, {
      phone: newPhone,
      password,
    });
}
window.changePassword=async function(){
  const oldPassword=$("#CPop").val()
  const newPassword=$("#CPnp").val()

  await axios.post(`${HOST}/user/password`, {
    oldPassword,
    newPassword,
  });
}

function showOrderList(orders) {
  for (const order of orders) {
    $('#order_list').append(`<li>${order.order_id} 起送:${order.shop_location} ${order.order_begin_time} 
    接受：${order.order_destination}  ,${order.cust_name}
    状态：${order.order_state}
    金额:${order.order_value}
    <button class='btn btn-light'  onclick='showOrder(${order.order_id})'>查看详情</button>
            </li>`)
  }
}

window.updateInfo=async function (key,val){
  var putInfo={}
  var edition = prompt("请输入你想要修改的数值：", val)
  putInfo[key]=edition
  if (edition){
  await axios.put(`${HOST}/user/info`, putInfo)
  }
  location.reload()
}

function showInfoList(userInfo,nameList){
  
  for (const name in nameList) {
    if (! name in userInfo){
      alert("wrong")
    }
  
    const key=nameList[name]
    const value=userInfo[name]
    console.log(name,value)
    var val=value
    if(typeof(value)=='string'){
       val=`"${value}"`
    }
    $('#info_list').append(`<li>${key} : ${value} <button class='btn btn-light'  onclick='updateInfo("${name}", ${val})'>修改</button>
            </li>`)
  }
}

window.onNext=async function(order_id){
  await axios.post(`${HOST}/order/${order_id}/next`);
  location.reload()
}

function showFreeOrderList(freeOrderList){
  for (const order of freeOrderList) {
    $('#order_list_free').append(`<li>${order.order_id} 起送:${order.shop_location} ${order.order_begin_time} 
    接受：${order.order_destination}  ,${order.cust_name}
    状态：${order.order_state}
    金额:${order.order_value}
    <button class='btn btn-light'  onclick='onNext(${order.order_id})'>接单</button>
    <button class='btn btn-light'  onclick='showOrder(${order.order_id})'>查看详情</button>
            </li>`)
  }
}

window.updateHealth= async function updateHealth() {
  var temperature = $("#temp").val()
  var covid=$("#covid").val()
  await axios.post(`${HOST}/courier/health`, {
    cour_temperature: temperature,
    cour_covid: new Date(covid).toISOString(),
  });
  window.location.reload();
}

const userInfo = await getUserInfo()
const orders = await getOrders()
const freeOrderList=await getFreeOrders()
// console.log(userInfo)
$("#covid").val(userInfo.cour_covid)
$("#temp").val(userInfo.cour_temperature)
showFreeOrderList(freeOrderList)
showOrderList(orders)
showInfoList(userInfo,courier)
