import React, { useContext, useState } from 'react';
import useForceUpdate from 'use-force-update';
import { MyContext } from './context/context';
import { Avatar, Modal, Form, Input } from 'antd';
import './home.css';
import Login from './login/login';
import OneTree from './tree/tree';
import Register from './register/register';
import List from './list/list';

function Home(){
    const {rootState,logoutUser,toggleList,updateData} = useContext(MyContext);
    const {isAuth,theUser,regState, listState} = rootState;
    let extra = null;

    const initialState = {
        visible: false,
        id: '',
        name: '',
        email: '',
        type: ''
    }
    const [state,setState] = useState(initialState);
    const forceUpdate = useForceUpdate();

    if (theUser && theUser.type == 3){
        extra = (
            <div>        
                <button onClick={toggleList}>{listState ? "Tree" : "List"}</button>
            </div>
        )
    }

    const showModal = () => {
        setState({
            ...state,
            visible: true,
            id:theUser.id,
            name:theUser.name,
            email:theUser.email,
            type:theUser.type
        });
      };
    
    const handleOk = e => {
        updateData(state.id, state.name, state.email, theUser.type);
        setState({
            visible: false
        });
        forceUpdate();
    };
    
    const handleCancel = e => {
    setState({
        ...state,
        visible: false,
    });
    };

    //if user Logged in
    if(isAuth){
        return(
            <div>
                <div className="header">
                    <div className="userInfo">
                        <Avatar className="avatar" img src={require('./list/user.png')}/>
                        <div className="user">
                            <p className="username">{theUser.name} </p>
                            <p className="email">{theUser.email}</p>
                        </div>
                        <button className="edit" 
                            onClick={showModal}>edit</button>
                    </div>
                    <button className="button" onClick={() => logoutUser(theUser.id)}>Logout</button>
                    {extra}
                </div>
                <Modal
                    title="Your data"
                    visible={state.visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Form
                    name="basic">
                    <Form.Item
                        label="Username"
                        name="username">
                        <Input
                        type="text" id="name" name="username" placeholder="New username"
                        value={state.name}
                        onBlur={(e) => 
                            setState({
                              ...state,
                              name: e.target.value
                        })}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email">
                        <Input
                        type="text" id="email" name="email" placeholder="New email"
                        value={state.email}
                        onBlur={(e) =>  
                            setState({
                              ...state,
                              email: e.target.value
                        })}
                        />
                    </Form.Item>
                    </Form>
                </Modal>  
                {listState ? <List/> : <OneTree/>}
            </div>
        )
    }
    //showing login or register component according to the condition
    else if(regState){
        return <Register/>
    }
    else {
        return <Login/>;
    }
}

export default Home;