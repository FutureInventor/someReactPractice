import React, { Component } from 'react';
import {MyContext} from '../context/context.js';
import axios from'axios';
import './register.css'
const API_PATH = 'http://localhost/reactRouting/php_jwt/register.php';
import { Form, Input, Button, message } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class Register extends Component {
  static contextType = MyContext;

  state = {
    fname: '',
    email: '',
    pass: '',
    repass: '',
    mailSent: false,
    error: null,
    contacts: [],
    }

  handleFormSubmit = e => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('name', this.state.fname);
    formData.append('email', this.state.email);
    formData.append('password', this.state.pass);
    
    if (this.state.pass == this.state.repass){
      axios({
        method: 'post',
        url: API_PATH,
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      })
      .then(result => {
        result.data.success 
          ? this.context.toggleReg() 
          : message.error(result.data.message)
        this.setState({
          mailSent: result.data
        })
      })
      .catch(error => this.setState({ error: error.message }));
    }
  };

  render() {
    return (
      <div className="main">
        <div className = 'Register'> 
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}>
              
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input
                type="text" id="fname" name="username" placeholder="Your username.."
                value={this.state.fname}
                onChange={e => this.setState({ fname: e.target.value })}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}>
              <Input
                type="text" id="email" name="email" placeholder="Your email.."
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password
                type="text" id="pass" name="password" placeholder="Your password.."
                value={this.state.pass}
                onChange={e => this.setState({ pass: e.target.value })}
              />
            </Form.Item>

            <Form.Item
              label="Repeat"
              dependencies={['password']}
              name="re_password"
              rules={[{ required: true, message: 'Repeat your password!' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) 
                      return Promise.resolve();
                    return Promise.reject('The two passwords that you entered do not match!');
                  }
                })
              ]}>
              <Input.Password
                type="text" id="repass" name="repass"
                value={this.state.repass}
                onChange={e => this.setState({ repass: e.target.value })}
              />
            </Form.Item>

            <Form.Item className="Register-form" {...tailLayout}>
              <Button type="primary" htmlType="submit" onClick={e => this.handleFormSubmit(e)}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Register;