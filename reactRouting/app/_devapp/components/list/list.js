import React, { Component } from 'react';
import { Form, Input, Modal, List, Avatar, Skeleton, Select } from 'antd';
import {MyContext} from '../context/context.js';
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import './list.css';

class userList extends Component {
  static contextType = MyContext;

  state = {
    initLoading: true,
    loading: false,
    list: [],
    id: '',
    name: '',
    email: '',
    type: ''
  };

  //to get users right after the component is mounted
  componentDidMount() {
    const data = this.context.getUsers();
      this.setState({ 
        visible: false,
        initLoading: false,
        list: data
       });
  }
  
  showModal = (id, name, email, type) => {
    this.setState({
      visible: true,
      id:id,
      name:name,
      email:email,
      type:type
    });
  };

  handleOk = e => {
    this.context.updateData(this.state.id, this.state.name, this.state.email, this.state.type);
    this.setState({
      visible: false
    });
    console.log(e);
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { initLoading, loading, list } = this.state;

    return (
        <div className="userList">
            <List
                className="loadmore-list"
                loading={initLoading}
                itemLayout="horizontal"
                dataSource={list}
                renderItem={item => (                   
                  <List.Item
                    style={{borderBottom: ' 2px solid black'}}
                    actions={[<a key="list-loadmore-edit" 
                      onClick={() => this.showModal(item.id, item.name, item.email, item.type)}>edit</a>, 
                        <a>{item.logged == true 
                          ? <CheckCircleTwoTone twoToneColor="#52c41a" /> 
                          : <CloseCircleTwoTone twoToneColor="#eb2f96"/>}
                        </a>]}>
                      <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                          avatar={
                          <Avatar img src={require('./user.png')}/>}
                          title={item.name}
                          description={item.email}
                        />
                        <div style={{paddingLeft: 30}}>{item.id}</div>
                      </Skeleton>
                  </List.Item>
                )}
              /> 
          <Modal
            title="User's data"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form
              name="basic">
              <Form.Item
                label="Username"
                name="username">
                <Input
                  type="text" id="name" name="username" placeholder="New username"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email">
                <Input
                  type="text" id="email" name="email" placeholder="New email"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type">
                <Select defaultValue="Permission" style={{ width: 120 }} 
                  onChange={ (value) => this.setState({ type: value }) }>

                  <Option value={2}>Admin</Option>
                  <Option value={1}>Technicant</Option>
                  <Option value={0}>User</Option>

                </Select>
              </Form.Item>
            </Form>
          </Modal>  
        </div>
    );
  }
}

export default userList;