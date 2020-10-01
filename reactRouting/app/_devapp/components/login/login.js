import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './login.css'
import { Form, Input, Button, Checkbox } from 'antd';
import { MyContext } from '../context/context.js';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function Login(){
  const {loginUser,isLoggedIn,toggleReg} = useContext(MyContext);

  const initialState = {
      userInfo:{
          email:'',
          password:'',
      },
      errorMsg:'',
      successMsg:''
  }

  const [state,setState] = useState(initialState);

  //on change input value (email & password)
  const onChangeValue = (e) => {
      setState({
          ...state,
          userInfo:{
              ...state.userInfo,
              [e.target.name]:e.target.value
          }
      });
  }

  //on submit login from
  const submitForm = async (event) => {
      event.preventDefault();
      const data = await loginUser(state.userInfo);
      if(data.success && data.token){
        setState({
            ...initialState,
        });
        localStorage.setItem('loginToken', data.token);
        await isLoggedIn();
      }
      else{
        setState({
          ...state,
          successMsg:'',
          errorMsg:data.message
        });
      }
  }

  return (
    <div className="main">
      <div className = 'Login'>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input
              type="email" id="email" name="email" placeholder="Your email.."
              value={state.userInfo.email}
              onChange={onChangeValue}/>
          </Form.Item>
    
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              type="password" id="pass" name="password" placeholder="Your password.."
              value={state.userInfo.password}
              onChange={onChangeValue}/>
          </Form.Item>
    
          <Form.Item className="login-form"{...tailLayout} name="remember" valuePropName="checked">
            <Checkbox >Remember me</Checkbox>
          </Form.Item >

          <Form.Item className="login-form" {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={e => submitForm(e) } >Submit</Button>
          </Form.Item>

        </Form>
      </div>
      <div className="Text">
        <p>Not registred yet?</p>
        <p className='signup1'>Sign up</p>
        <Link to=''>
          <p className='signup2' onClick={toggleReg}><span class="underline--magical">HERE</span></p>
        </Link>
      </div>
    </div>
  );
}


export default Login;