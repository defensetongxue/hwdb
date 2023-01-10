const url = document.location.search.substring(1)
const args = new URLSearchParams(url)
const global_token = args.get('token')
const role = args.get('role')
const HOST = "http://guoyi.work"
const shop= {
  "shop_name": "商铺名",
  "shop_location" :"商铺地址",
  "delivery_range":"配送范围",
  "business_status": "商铺状态" 
}

axios.interceptors.request.use((config) => {
  const token = global_token;
  if (token !== null) {
    config.headers ?? (config.headers = {});
    config.headers.Authorization = `bearer ${token}`;
  }
  return config;
});

async function getDishes() {
  const { data } = await axios.get(
    `${HOST}/shop/${userInfo.shop_id}/dishes`
  );
  return data
}

async function getUserInfo() {
  const { data } = await axios.get(`${HOST}/user/info`);
  return data;
}

async function getOrders() {
  const { data } = await axios.get(`${HOST}/orders`);
  return data
}

window.editDish = async function (dish_id, dish_name, dish_value) {

  var edition = prompt("请输入你想要修改的价格：", dish_value)
  if (edition) {
    await axios.put(`${HOST}/shop/dish/${dish_id}`, {
      dish_name: dish_name,
      dish_value: edition,
    });
  }
  location.reload()
}

window.delDish = async function (dish_id) {
  await axios.delete(`${HOST}/shop/dish/${dish_id}`);
  location.reload()
}

window.addDish = async function () {
  const addDishName = $('#addDishName').val()
  const addDishValue = $('#addDishValue').val()
  // console.log(addDishName, addDishValue)
  await axios.post(`${HOST}/shop/dish`, {
    dish_name: addDishName,
    dish_value: addDishValue,
  });
  location.reload()
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
function showDishList(dishes) {
  for (const dish of dishes) {
    $('#dish_list').append(`<li>${dish.dish_name} 销量:${dish.dish_sales} 价格：${dish.dish_value}
    <button class='btn btn-light'  onclick='editDish(${dish.dish_id},"${dish.dish_name}",${dish.dish_value})'>编辑价格</button>
    <button class='btn btn-light'  onclick='delDish(${dish.dish_id})'>删除</button>
            </li>`)
  }
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
    // console.log(value,typeof(value))
    // if (typeof(value)=='string'){
    //   // value= '\"'+value+'\"'
    // }
    console.log(name,value)
    var val=value
    if(typeof(value)=='string'){
       val=`"${value}"`
    }
    $('#info_list').append(`<li>${key} : ${value} <button class='btn btn-light'  onclick='updateInfo("${name}", ${val})'>修改</button>
            </li>`)
  }
}

const userInfo = await getUserInfo()
const dishes = await getDishes()
const orders = await getOrders()
showDishList(dishes)
showOrderList(orders)
showInfoList(userInfo,shop)
