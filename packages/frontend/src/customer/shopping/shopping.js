const url = document.location.search.substring(1)
const args = new URLSearchParams(url)
const global_token = args.get('token')
const global_role = args.get('role')
const shop_id=args.get('shop_id')
// alert(shop_id)
const HOST = "http://guoyi.work"
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
    `${HOST}/shop/${shop_id}/dishes`
  );
  return data
}
window.addCAr=async function (dish_id) {
  await axios.post(`${HOST}/customer/car/insert`, { dish_id });
  refreshCar();
}
function showDishList(dishes) {
  for (const dish of dishes) {
    $('#dish_list').append(`<li>${dish.dish_name} 销量:${dish.dish_sales} 价格：${dish.dish_value}
    <button class='btn btn-light'  onclick='addCar(${dish.dish_id})'>加购物车</button>
            </li>`)
  }
}
const dishes=await getDishes()
// console.log(dishes)
showDishList(dishes)
