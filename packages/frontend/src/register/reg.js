window.register= async function(){
  const phone=$("#input_phone").val()
  const role=$("#role").val()
  const name=$$("#input_name").val()
  const password=$("#innput_password").val()
  alert(role)
  await axios.post(`${HOST}/user/register`, {
    role,
    phone,
    name,
    password,
  });
}
