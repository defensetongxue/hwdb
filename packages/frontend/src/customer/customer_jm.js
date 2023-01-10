const url = document.location.search.substring(1)
const args = new URLSearchParams(url)
const global_token = args.get('token')
const global_role = args.get('role')
const HOST = "http://guoyi.work"
const customer={
  "cust_name": "姓名",
  "id":  "身份证号",
  "cust_birth": "出生日期",
  "cust_gender":  "性别",
  "cust_email":  "电子邮箱",
  "cust_address": "配送地址",
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

window.carDel= async function (dish_id) {
  await axios.post(`${HOST}/customer/car/delete`, { dish_id });
  location.reload()
}

function showCar(car_list) {
  for (const item of car_list) {
    $('#car').append(`<li>商店：${item.shop_name} 菜品：${item.dish_name}  数量：${item.car_num}  单价：${item.dish_value} 
    <button class='btn btn-light'  onclick='carDel( ${item.dish_id})'>删除</button>
            </li>`)
  }
}
window.shopDetail = function (shop_id){
  const data ={ "token":global_token,"shop_id":shop_id }
  const data_str=new URLSearchParams(data).toString()
  const url=`./shopping/shopping.html?${data_str}`
  window.location.href = url
}
function showShop(shop_list) {
  for (const shop of shop_list) {
    $('#shop_list').append(`<li>商店：${shop.shop_name} 位置：${shop.shop_location}      配送范围：${shop.delivery_range}     电话：${shop.shop_phone} 
    <button class='btn btn-light'  onclick='shopDetail( ${shop.shop_id})'>进店逛逛</button>
            </li>`)
  }
}
async function getShopList() {
  const { data } = await axios.get(`${HOST}/shops`);
  return data
}
async function getCar() {
  const { data } = await axios.get(`${HOST}/customer/car`);
  return data
}

const userInfo = await getUserInfo()
const orders = await getOrders()
const shopList= await getShopList()
const carList=await getCar()
showOrderList(orders)
showInfoList(userInfo,customer)
showShop(shopList)
showCar(carList)
