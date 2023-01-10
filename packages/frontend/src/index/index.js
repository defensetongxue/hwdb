async function login_click(){
  //获取用户输入的信息
  var phone=$("#input_email").val();
  var password=$("#input_password").val();
  // alert(phone)
  console.log(phone,password)
  //判断输入的信息和注册的信息是否一致
  const { data } = await axios.post(`http://guoyi.work/user/login`, {
    phone,
    password,
  })
  const { token, role } = data;
  // const data_str=JSON.stringify(data)
  const data_str=new URLSearchParams(data).toString()
  url=`../${role}/${role}_jm.html?${data_str}`
  // alert(url)
  window.location.href = url
  
}
