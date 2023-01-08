async function login_click(){
  //获取用户输入的信息
  var phone=$("#input_email").val();
  var password=$("#input_password").val();
  alert(phone)
  //判断输入的信息和注册的信息是否一致
  const { data } = await axios.post(`https://guoyi.work/user/login`, {
    phone,
    password,
  })

  alert(data)
  
}
