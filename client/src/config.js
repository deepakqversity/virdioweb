
//console.log('abhishek',user_token)

 const header = {
     
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'   
   }
   let user_token = JSON.parse(localStorage.getItem("userData"));
   console.log('user_token', user_token.token)
   if(user_token != null && !!user_token.token && user_token.token != '' )
   {
    header['Authorization'] =user_token.token;
    header['Access-Control-Allow-Methods'] ='GET, POST, PUT';
  
   }

   export default header;



